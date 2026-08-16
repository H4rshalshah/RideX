/**
 * RideX dev launcher — starts the API with an in-memory MongoDB so the
 * project runs on localhost without installing MongoDB.
 *
 * Usage: npm run dev   (from the Backend folder)
 *
 * Note: maps, geocoding, routes and fares work without any API key (free
 * OpenStreetMap / Nominatim / OSRM / Photon providers). Setting a real
 * GOOGLE_MAPS_API key in Backend/.env upgrades those calls to Google Maps.
 */
const { MongoMemoryServer } = require('mongodb-memory-server');
const http = require('http');

(async () => {
  console.log('Starting in-memory MongoDB…');
  const mongod = await MongoMemoryServer.create();
  process.env.DB_CONNECT = mongod.getUri('ridex');
  console.log(`In-memory MongoDB ready: ${mongod.getUri('ridex')}`);

  const app = require('./app');
  const { initializeSocket } = require('./socket');

  const server = http.createServer(app);
  initializeSocket(server);

  const port = process.env.PORT || 3000;
  server.on('error', async (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\nPort ${port} is already in use.`);
      console.error('Another RideX server may already be running.');
      console.error(`Stop it (or set PORT to another value in Backend/.env) and run npm run dev again.`);
    } else {
      console.error(err);
    }
    await mongod.stop();
    process.exit(1);
  });

  server.listen(port, async () => {
    console.log(`RideX server is running on http://localhost:${port}`);

    try {
      const { runSeed } = require('./seed');
      await runSeed({ disconnect: false });
    } catch (err) {
      console.error(`Seed skipped: ${err.message}`);
    }
  });

  const shutdown = () => {
    console.log('\nShutting down…');
    server.close(async () => {
      await mongod.stop();
      process.exit(0);
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
})();
