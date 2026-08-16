import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, AttributionControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '../../context/ThemeContext';
import { CAR_PATH } from '../ui/carIcon';
import MapRecenter from './MapRecenter';

// Demo route between real Mumbai coordinates (Gateway of India → Bandra West).
// The car is a clearly simulated demo tracking mode — no real driver data.
const DEMO_ROUTE = [
  [18.922, 72.8347],
  [18.933, 72.831],
  [18.944, 72.826],
  [18.955, 72.821],
  [18.966, 72.817],
  [18.977, 72.815],
  [18.988, 72.819],
  [18.999, 72.824],
  [19.01, 72.826],
  [19.021, 72.827],
  [19.032, 72.829],
  [19.043, 72.83],
  [19.0596, 72.8295],
];
const PICKUP = DEMO_ROUTE[0];
const DEST = DEMO_ROUTE[DEMO_ROUTE.length - 1];
const POINTS_PER_SEC = 1.2; // route points traversed per second (~10s per crossing)

const tileUrl = (dark) =>
  dark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const pinIcon = (color) =>
  L.divIcon({
    className: '',
    html: `<svg width="26" height="33" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
    </svg>`,
    iconSize: [26, 33],
    iconAnchor: [13, 31],
  });

const lerp = (a, b, t) => a + (b - a) * t;

// Bearing (degrees, 0 = north, clockwise) between two [lat, lng] points
const bearing = (a, b) => {
  const toRad = (d) => (d * Math.PI) / 180;
  const toDeg = (r) => (r * 180) / Math.PI;
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const dLng = toRad(b[1] - a[1]);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
};

const lerpAngle = (from, to, t) => {
  let diff = (to - from) % 360;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return from + diff * t;
};

// Fit the route into view once
const FitRoute = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (points?.length > 1) {
      map.fitBounds(L.latLngBounds(points), { padding: [28, 28] });
    }
  }, [map, points]);
  return null;
};

const MiniMap = ({ className = '' }) => {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const carColor = dark ? '#FF6B00' : '#2563EB';

  const carMarkerRef = useRef(null);

  // Car marker icon (created once; position + rotation updated per frame)
  const carIcon = useMemo(
    () =>
      L.divIcon({
        className: '',
        html: `<div style="width:34px;height:34px;display:flex;align-items:center;justify-content:center;transform:rotate(0deg);transition:transform 0.3s linear">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="${carColor}" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,0.4))"><path d="${CAR_PATH}"/></svg>
      </div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      }),
    [carColor]
  );

  // Simulated live movement along the route (ping-pong, no teleporting)
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) return undefined;

    let raf;
    let last = performance.now();
    // progress in [0, len-1]; direction flips at the ends
    let p = 0;
    let dir = 1;
    let angle = 0;

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      p += dir * POINTS_PER_SEC * dt;
      const maxP = DEMO_ROUTE.length - 1;
      if (p >= maxP) {
        p = maxP;
        dir = -1;
      } else if (p <= 0) {
        p = 0;
        dir = 1;
      }

      const i = Math.min(Math.floor(p), maxP - 1);
      const j = i + 1;
      const t = p - i;
      const lat = lerp(DEMO_ROUTE[i][0], DEMO_ROUTE[j][0], t);
      const lng = lerp(DEMO_ROUTE[i][1], DEMO_ROUTE[j][1], t);

      const targetBearing = bearing(DEMO_ROUTE[i], DEMO_ROUTE[j]);
      angle = lerpAngle(angle, targetBearing, Math.min(1, dt * 6));

      const marker = carMarkerRef.current;
      if (marker) {
        marker.setLatLng([lat, lng]);
        const el = marker.getElement();
        if (el) {
          const inner = el.querySelector('div');
          if (inner) inner.style.transform = `rotate(${angle - 90}deg)`; // glyph faces east by default
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [carColor]);

  return (
    <MapContainer
      center={PICKUP}
      zoom={13}
      className={`ridex-map h-full w-full ${dark ? 'map-tiles-dark' : 'map-tiles-light'} ${className}`}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer url={tileUrl(dark)} attribution={TILE_ATTR} />
      <AttributionControl position="bottomleft" prefix="Leaflet" />
      <FitRoute points={DEMO_ROUTE} />
      <Polyline
        positions={DEMO_ROUTE}
        pathOptions={{ color: dark ? '#FF6B00' : '#2563EB', weight: 4, opacity: 0.85 }}
      />
      <Marker position={PICKUP} icon={pinIcon('#10b981')} title="Pickup" />
      <Marker position={DEST} icon={pinIcon('#f59e0b')} title="Destination" />
      <Marker
        ref={carMarkerRef}
        position={DEMO_ROUTE[0]}
        icon={carIcon}
        zIndexOffset={1000}
        title="Demo ride"
      />
      <MapRecenter target={PICKUP} zoom={14} />
    </MapContainer>
  );
};

export default MiniMap;
