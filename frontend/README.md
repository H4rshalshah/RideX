# RideX — Frontend

React 18 + Vite + Tailwind CSS single-page app for the RideX ride-booking platform.

## Getting started

```bash
npm install
cp .env.example .env   # fill in VITE_BASE_URL (other keys are optional — see below)
npm run dev            # http://localhost:5173
```

Other commands: `npm run build` (production build), `npm run lint` (ESLint), `npm run preview`
(preview the production build).

### Map tiles

Basemaps come from CARTO and are configured in `src/lib/mapTiles.js`, which includes a default
basemap key — without a key CARTO stamps an "API key required" watermark over the tiles. Set
`VITE_CARTO_KEY` in `.env` to use a different (e.g. domain-restricted) key.

See the [root README](../README.md) for the full project overview, environment variables and
running instructions.
