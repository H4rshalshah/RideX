import { useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { useTheme } from '../../context/ThemeContext';

// Top-down car silhouette (points up by default; rotated by bearing).
const CAR_TOP =
  'M12 2c-2.1 0-3.6 1.4-4 3.2C5.3 6.1 3.5 8 3 10.4L2 15c-.2 1 .4 2 1.4 2.2l.6.1v2.7c0 .6.4 1 1 1h1c.6 0 1-.4 1-1V19h10v1c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-2.7l.6-.1c1-.2 1.6-1.2 1.4-2.2l-1-4.6c-.5-2.4-2.3-4.3-5-5.2C15.6 3.4 14.1 2 12 2zm0 2c1.2 0 2.2.8 2.6 2H9.4c.4-1.2 1.4-2 2.6-2zM5.5 9c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm13 0c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z';

const lerpAngle = (from, to, t) => {
  let diff = (to - from) % 360;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return from + diff * t;
};

const toDeg = (r) => (r * 180) / Math.PI;

/**
 * Leaflet marker for the captain's car. Smoothly interpolates position toward
 * the latest socket-provided location and rotates to face the direction of
 * travel (bearing-based, shortest-angle). Updates the DOM directly — no React
 * re-renders per frame.
 */
const DriverCar = ({ position }) => {
  const map = useMap();
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const carColor = dark ? '#FF6B00' : '#2563EB';

  const markerRef = useRef(null);
  const rafRef = useRef(null);
  const angleRef = useRef(0);
  const currentRef = useRef(position);

  const icon = useMemo(
    () =>
      L.divIcon({
        className: '',
        html: `<div style="width:38px;height:38px;display:flex;align-items:center;justify-content:center">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="${carColor}" style="filter:drop-shadow(0 1px 3px rgba(0,0,0,0.5))"><path d="${CAR_TOP}"/></svg>
        </div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      }),
    [carColor]
  );

  useEffect(() => {
    const marker = L.marker(position, { icon, zIndexOffset: 1000 });
    marker.addTo(map);
    markerRef.current = marker;
    return () => {
      marker.remove();
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, icon]);

  // Smoothly glide toward the latest target position (no teleporting)
  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return undefined;

    currentRef.current = position;

    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const current = marker.getLatLng();
      const target = currentRef.current;
      if (!target) return;

      const dLat = target.lat - current.lat;
      const dLng = target.lng - current.lng;
      const dist = Math.hypot(dLat, dLng);

      if (dist > 0.00002) {
        // Move a fixed fraction of the remaining gap per frame — fast at
        // first, easing as it closes in (~3s to cover a typical jump).
        const k = Math.min(1, dt * 1.6);
        marker.setLatLng([current.lat + dLat * k, current.lng + dLng * k]);

        const bearing = (toDeg(Math.atan2(dLng, dLat)) + 360) % 360;
        angleRef.current = lerpAngle(angleRef.current, bearing, Math.min(1, dt * 8));
        const el = marker.getElement();
        if (el) {
          const inner = el.querySelector('div');
          if (inner) inner.style.transform = `rotate(${angleRef.current + 90}deg)`; // glyph points up
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [position]);

  return null;
};

export default DriverCar;
