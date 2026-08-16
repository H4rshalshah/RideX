import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, AttributionControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../lib/api';
import Spinner from './ui/Spinner';
import MapControls from './map/MapControls';
import DriverCar from './map/DriverCar';
import { useTheme } from '../context/ThemeContext';

const DEFAULT_CENTER = [28.6139, 77.209]; // New Delhi

// Custom SVG pins (no default Leaflet icon assets needed)
const pinIcon = (color, label) =>
  L.divIcon({
    className: '',
    html: `<svg width="30" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
      <text x="12" y="12.2" text-anchor="middle" dominant-baseline="middle" font-size="9" font-weight="700" fill="#ffffff">${label}</text>
    </svg>`,
    iconSize: [30, 38],
    iconAnchor: [15, 36],
  });

const liveDotIcon = L.divIcon({
  className: '',
  html: '<span class="ridex-live-dot"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// Refits the viewport to the route (or pickup/destination, or the user).
const FitBounds = ({ pickupCoords, destCoords, route, currentPosition }) => {
  const map = useMap();
  const centeredRef = useRef(false);

  useEffect(() => {
    const pts = [];
    if (pickupCoords) pts.push(pickupCoords);
    if (destCoords) pts.push(destCoords);
    if (route) pts.push(...route);

    if (pts.length >= 2) {
      map.fitBounds(L.latLngBounds(pts), { padding: [45, 45], maxZoom: 16 });
    } else if (pts.length === 1) {
      map.setView(pts[0], 15);
    } else if (currentPosition && !centeredRef.current) {
      centeredRef.current = true;
      map.setView(currentPosition, 15);
    }
  }, [map, pickupCoords, destCoords, route, currentPosition]);

  return null;
};

// Flies the camera to an externally requested position (e.g. "Current location" click)
const FlyToFocus = ({ focus }) => {
  const map = useMap();
  const lastKey = useRef(null);

  useEffect(() => {
    if (!focus) return;
    const key = `${focus.lat},${focus.lng}`;
    if (lastKey.current === key) return;
    lastKey.current = key;
    map.flyTo([focus.lat, focus.lng], Math.max(map.getZoom(), 14), { duration: 1 });
  }, [map, focus]);

  return null;
};

/**
 * Live location map with an optional route between pickup and destination.
 * Uses Leaflet + free OpenStreetMap tiles (no API key required). Addresses are
 * geocoded and routes are fetched through the backend, which falls back to
 * keyless providers (Nominatim/OSRM) when no Google key is configured.
 *
 * Optional props:
 *  - driverPosition: { lat, lng } — animates a captain car marker (live tracking)
 *  - focusPosition:  { lat, lng } — flies the camera here + shows the user dot
 */
const LiveTracking = ({
  pickup,
  destination,
  showLocationNotice = true,
  mapClassName = '',
  driverPosition = null,
  focusPosition = null,
}) => {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [currentPosition, setCurrentPosition] = useState(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);
  const [route, setRoute] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);

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

  // Resolve pickup/destination coordinates + driving route through the backend
  useEffect(() => {
    let cancelled = false;
    async function loadRoute() {
      setRoute(null);
      setRouteLoading(true);
      if (!pickup || !destination) {
        setPickupCoords(null);
        setDestCoords(null);
        setRouteLoading(false);
        return;
      }
      try {
        const [p, d] = await Promise.all([
          api.get('/maps/get-coordinates', { params: { address: pickup } }),
          api.get('/maps/get-coordinates', { params: { address: destination } }),
        ]);
        if (cancelled) return;
        const pc = { lat: p.data.ltd, lng: p.data.lng };
        const dc = { lat: d.data.ltd, lng: d.data.lng };
        setPickupCoords(pc);
        setDestCoords(dc);

        try {
          const r = await api.get('/maps/get-route', {
            params: {
              origin: `${p.data.ltd},${p.data.lng}`,
              destination: `${d.data.ltd},${d.data.lng}`,
            },
          });
          if (!cancelled && r.data?.geometry?.length) {
            setRoute(r.data.geometry.map(([lat, lng]) => ({ lat, lng })));
          }
        } catch {
          // No route — the straight dashed line between the markers is shown instead
        }
      } catch {
        if (!cancelled) {
          setPickupCoords(null);
          setDestCoords(null);
        }
      } finally {
        if (!cancelled) setRouteLoading(false);
      }
    }
    loadRoute();
    return () => {
      cancelled = true;
    };
  }, [pickup, destination]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={currentPosition || DEFAULT_CENTER}
        zoom={13}
        className={`ridex-map h-full w-full ${dark ? 'map-tiles-dark' : 'map-tiles-light'} ${mapClassName}`}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
        zoomControl={false}
      >
        <TileLayer
          url={
            dark
              ? 'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png'
              : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
          }
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        <FitBounds
          pickupCoords={pickupCoords}
          destCoords={destCoords}
          route={route}
          currentPosition={currentPosition}
        />

        {route && (
          <Polyline
            positions={route}
            pathOptions={{ color: '#3b82f6', weight: 5, opacity: 0.85 }}
          />
        )}
        {!route && pickupCoords && destCoords && (
          <Polyline
            positions={[pickupCoords, destCoords]}
            pathOptions={{ color: '#3b82f6', weight: 3, opacity: 0.6, dashArray: '8 10' }}
          />
        )}

        {pickupCoords && <Marker position={pickupCoords} icon={pinIcon('#10b981', 'P')} title="Pickup" />}
        {destCoords && <Marker position={destCoords} icon={pinIcon('#f59e0b', 'D')} title="Destination" />}
        {(focusPosition || currentPosition) && (
          <Marker position={focusPosition || currentPosition} icon={liveDotIcon} title="You are here" />
        )}

        {driverPosition && <DriverCar position={driverPosition} />}

        <FlyToFocus focus={focusPosition} />
        <AttributionControl position="bottomleft" prefix="Leaflet" />
        <MapControls target={currentPosition || focusPosition || DEFAULT_CENTER} />
      </MapContainer>

      {routeLoading && (
        <div className="pointer-events-none absolute left-1/2 top-3 z-[1000] -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full border border-ui-line bg-ui-card px-3 py-1.5 shadow-card">
            <Spinner className="h-3.5 w-3.5 text-ui-ink" />
            <span className="text-xs font-medium text-ui-muted">Finding route…</span>
          </div>
        </div>
      )}

      {locationDenied && showLocationNotice && (
        <div className="absolute left-1/2 top-4 z-[1000] w-max max-w-[90%] -translate-x-1/2 rounded-xl bg-ui-accent px-4 py-2 text-xs font-medium text-ui-onaccent shadow-lift">
          <i className="ri-navigation-line mr-1.5" />
          Enable location access for live tracking
        </div>
      )}
    </div>
  );
};

export default LiveTracking;
