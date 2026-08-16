import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';

/**
 * Google-Maps-style re-center button. Flies the camera to the user's
 * geolocated position (or a fallback target) with a smooth animation —
 * without reloading the map or touching any booking state.
 */
const MapRecenter = ({ target = null, zoom = 15 }) => {
  const map = useMap();
  const [userPos, setUserPos] = useState(null);
  const [locDenied, setLocDenied] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocDenied(true);
      return undefined;
    }
    const ok = (p) => setUserPos({ lat: p.coords.latitude, lng: p.coords.longitude });
    navigator.geolocation.getCurrentPosition(ok, () => setLocDenied(true));
    return undefined;
  }, []);

  const recenter = () => {
    const pos = userPos || target;
    if (pos) {
      map.flyTo(pos, zoom, { duration: 0.9 });
    } else {
      map.flyTo(map.getCenter(), Math.max(map.getZoom(), 13), { duration: 0.9 });
    }
  };

  return (
    <button
      type="button"
      onClick={recenter}
      aria-label="Re-center map on your location"
      title={locDenied ? 'Location unavailable — recenter map' : 'Re-center on your location'}
      className="absolute bottom-3 right-3 z-[1000] flex h-9 w-9 items-center justify-center rounded-full border border-ui-line bg-ui-card/90 text-ui-ink shadow-card backdrop-blur-sm transition hover:bg-ui-card2 active:scale-95"
    >
      <i className="ri-crosshair-2-line text-lg" />
    </button>
  );
};

export default MapRecenter;
