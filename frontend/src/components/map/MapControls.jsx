import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';

/**
 * Single compact vertical control group (bottom-right of the map):
 *
 *     ◎  ← Re-center / current location
 *     +  ← Zoom in
 *     −  ← Zoom out
 *
 * Replaces Leaflet's default zoom control so the group never renders at the
 * top-left (where the RideX logo lives) and always stays theme-consistent.
 */
const MapControls = ({ target = null, zoom = 15 }) => {
  const map = useMap();
  const [userPos, setUserPos] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return undefined;
    const ok = (p) => setUserPos({ lat: p.coords.latitude, lng: p.coords.longitude });
    navigator.geolocation.getCurrentPosition(ok, () => {});
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
    <div
      className="ridex-map-controls absolute bottom-3 right-3 z-[1000] flex flex-col overflow-hidden rounded-xl border border-ui-line bg-ui-card/90 shadow-card backdrop-blur-sm"
      role="group"
      aria-label="Map controls"
    >
      <button
        type="button"
        onClick={recenter}
        aria-label="Re-center map on your location"
        title="Re-center on your location"
        className="ridex-map-btn"
      >
        <i className="ri-crosshair-2-line text-lg" />
      </button>
      <button
        type="button"
        onClick={() => map.zoomIn()}
        aria-label="Zoom in"
        title="Zoom in"
        className="ridex-map-btn"
      >
        +
      </button>
      <button
        type="button"
        onClick={() => map.zoomOut()}
        aria-label="Zoom out"
        title="Zoom out"
        className="ridex-map-btn"
      >
        −
      </button>
    </div>
  );
};

export default MapControls;
