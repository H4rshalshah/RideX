import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '../../context/ThemeContext';
import MapRecenter from './MapRecenter';

const DEFAULT_CENTER = [19.076, 72.8777]; // Mumbai
const DEFAULT_ZOOM = 12;

const liveDotIcon = L.divIcon({
  className: '',
  html: '<span class="ridex-live-dot"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const tileUrl = (dark) =>
  dark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

/**
 * Real map that fills the hero background. Tiles are muted to blend with the
 * UI; the map stays behind all content. Shows a pulsing dot at the user's
 * location when geolocation is granted.
 */
const HeroMap = ({ center = DEFAULT_CENTER, zoom = DEFAULT_ZOOM }) => {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [userPos, setUserPos] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return undefined;
    const ok = (p) => setUserPos({ lat: p.coords.latitude, lng: p.coords.longitude });
    navigator.geolocation.getCurrentPosition(ok, () => {});
    return undefined;
  }, []);

  return (
    <MapContainer
      center={userPos || center}
      zoom={zoom}
      className={`h-full w-full ${dark ? 'map-tiles-dark' : 'map-tiles-light'}`}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
      zoomControl={false}
    >
      <TileLayer url={tileUrl(dark)} attribution={TILE_ATTR} />
      {userPos && <Marker position={userPos} icon={liveDotIcon} />}
      <MapRecenter target={userPos || center} zoom={zoom + 2} />
    </MapContainer>
  );
};

export default HeroMap;
