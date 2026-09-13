// CARTO basemap tiles used by every Leaflet map in the app.
//
// Without the `key` query param CARTO renders an "API key required" watermark
// over the tiles. The key below is a public, domain-restricted basemap key and
// is safe to ship in client code; set VITE_CARTO_KEY to override it per
// environment (e.g. a key restricted to the production domain).
const CARTO_API_KEY = import.meta.env.VITE_CARTO_KEY || 'cb1_3j3u_1_7e8e150c7f68f5f577d1a5e5';

const CARTO_KEY_PARAM = `key=${CARTO_API_KEY}`;

const CARTO_TILE_URLS = {
  dark: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?${CARTO_KEY_PARAM}`,
  light: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?${CARTO_KEY_PARAM}`,
};

export const cartoTileUrl = (dark) => (dark ? CARTO_TILE_URLS.dark : CARTO_TILE_URLS.light);

export const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
