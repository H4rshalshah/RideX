import { useCallback, useEffect, useRef, useState } from 'react';
import { LoadScript, GoogleMap, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import api from '../lib/api';
import Spinner from './ui/Spinner';

const containerStyle = { width: '100%', height: '100%' };

const DEFAULT_CENTER = { lat: 28.6139, lng: 77.209 }; // New Delhi
const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const pinIcon = (color) => ({
  path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z',
  fillColor: color,
  fillOpacity: 1,
  strokeColor: '#ffffff',
  strokeWeight: 2,
  scale: 1.6,
  anchor: { x: 12, y: 24 },
});

/**
 * Live location map with an optional route between pickup and destination.
 * Coordinates for the route are fetched through the backend proxy so no map
 * API key is used outside of the browser Maps JS loader.
 */
const LiveTracking = ({ pickup, destination, showLocationNotice = true }) => {
  const [currentPosition, setCurrentPosition] = useState(DEFAULT_CENTER);
  const [locationDenied, setLocationDenied] = useState(false);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);
  const [directions, setDirections] = useState(null);
  const mapRef = useRef(null);

  // Live geolocation (single watcher, cleaned up on unmount)
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationDenied(true);
      return undefined;
    }
    const onSuccess = (position) => {
      setLocationDenied(false);
      setCurrentPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
    };
    const onError = () => setLocationDenied(true);

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    const watchId = navigator.geolocation.watchPosition(onSuccess, onError);
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Resolve pickup/destination coordinates through the backend proxy
  useEffect(() => {
    let cancelled = false;
    async function loadRoute() {
      setDirections(null);
      if (!pickup || !destination) {
        setPickupCoords(null);
        setDestCoords(null);
        return;
      }
      try {
        const [p, d] = await Promise.all([
          api.get('/maps/get-coordinates', { params: { address: pickup } }),
          api.get('/maps/get-coordinates', { params: { address: destination } }),
        ]);
        if (cancelled) return;
        setPickupCoords({ lat: p.data.ltd, lng: p.data.lng });
        setDestCoords({ lat: d.data.ltd, lng: d.data.lng });
      } catch {
        if (!cancelled) {
          setPickupCoords(null);
          setDestCoords(null);
        }
      }
    }
    loadRoute();
    return () => {
      cancelled = true;
    };
  }, [pickup, destination]);

  const onDirectionsLoad = useCallback(
    (result) => {
      setDirections(result);
      const map = mapRef.current;
      if (map && window.google?.maps && result?.routes?.length) {
        const bounds = new window.google.maps.LatLngBounds();
        result.routes[0].overview_path.forEach((p) => bounds.extend(p));
        map.fitBounds(bounds, 60);
      }
    },
    []
  );

  const onDirectionsError = useCallback(() => setDirections(null), []);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onMapUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  if (!MAPS_KEY) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-ui-card2 text-center">
        <i className="ri-map-2-line text-4xl text-ui-faint" />
        <p className="max-w-xs text-sm text-ui-muted">
          Map unavailable — add <code className="rounded border border-ui-line bg-ui-card px-1.5 py-0.5 text-xs">VITE_GOOGLE_MAPS_API_KEY</code> to
          your environment to enable live maps.
        </p>
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={MAPS_KEY}
      loadingElement={
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-ui-card2">
          <Spinner className="h-7 w-7 text-ui-ink" />
          <p className="text-sm font-medium text-ui-muted">Loading map…</p>
        </div>
      }
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentPosition}
        zoom={15}
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
        options={{
          disableDefaultUI: true,
          clickableIcons: false,
          styles: [
            { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
          ],
        }}
      >
        {pickupCoords && <Marker position={pickupCoords} icon={pinIcon('#10b981')} title="Pickup" />}
        {destCoords && <Marker position={destCoords} icon={pinIcon('#f59e0b')} title="Destination" />}
        <Marker position={currentPosition} title="You are here" />
        {pickupCoords && destCoords && !directions && (
          <DirectionsService
            options={{
              origin: pickupCoords,
              destination: destCoords,
              travelMode: 'DRIVING',
            }}
            callback={(result, status) => {
              if (status === 'OK' && result) onDirectionsLoad(result);
              else onDirectionsError();
            }}
          />
        )}
        {directions && <DirectionsRenderer options={{ directions, suppressMarkers: true, polylineOptions: { strokeColor: '#6d28f0', strokeWeight: 5, strokeOpacity: 0.85 } }} />}
      </GoogleMap>

      {locationDenied && showLocationNotice && (
        <div className="absolute left-1/2 top-4 z-10 w-max max-w-[90%] -translate-x-1/2 rounded-xl bg-ui-accent px-4 py-2 text-xs font-medium text-ui-onaccent shadow-lift">
          <i className="ri-navigation-line mr-1.5" />
          Enable location access for live tracking
        </div>
      )}
    </LoadScript>
  );
};

export default LiveTracking;
