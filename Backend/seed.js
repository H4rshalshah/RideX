/**
 * RideX demo seed — creates a demo rider, an online demo captain (with a
 * location near Mumbai) and a few completed rides so the history/profile/
 * captain-stats screens show real data during presentations.
 *
 * Usage: node seed.js   (requires DB_CONNECT in Backend/.env)
 */
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');
const rideModel = require('./models/ride.model');

const DEMO_RIDER = { email: 'demo@ridex.app', password: 'demo1234' };
const DEMO_CAPTAIN = { email: 'captain@ridex.app', password: 'demo1234' };
// Mumbai — near Gateway of India so the suggested demo pickup matches
const CAPTAIN_LOCATION = { ltd: 18.922, lng: 72.8346 };

const SAMPLE_RIDES = [
  { pickup: 'Gateway of India, Mumbai', destination: 'Bandra West, Mumbai', vehicleType: 'car', fare: 285 },
  { pickup: 'Churchgate Station, Mumbai', destination: 'Juhu Beach, Mumbai', vehicleType: 'moto', fare: 148 },
  { pickup: 'Colaba Causeway, Mumbai', destination: 'Andheri East, Mumbai', vehicleType: 'auto', fare: 342 },
];

async function runSeed({ disconnect = true } = {}) {
  if (!process.env.DB_CONNECT) {
    throw new Error('DB_CONNECT is not set. Copy Backend/.env.example to Backend/.env first.');
  }

  await mongoose.connect(process.env.DB_CONNECT);
  console.log('Connected to DB');

  // Remove any previous demo data (scoped to the demo accounts only)
  const prevRider = await userModel.findOne({ email: DEMO_RIDER.email });
  const prevCaptain = await captainModel.findOne({ email: DEMO_CAPTAIN.email });
  const prevIds = [ prevRider?._id, prevCaptain?._id ].filter(Boolean);
  if (prevIds.length) {
    await rideModel.deleteMany({ $or: [ { user: { $in: prevIds } }, { captain: { $in: prevIds } } ] });
    await userModel.deleteMany({ _id: { $in: prevIds } });
    await captainModel.deleteMany({ _id: { $in: prevIds } });
  }

  // Demo rider
  const rider = await userModel.create({
    fullname: { firstname: 'Alex', lastname: 'Morgan' },
    email: DEMO_RIDER.email,
    phone: '9876543210',
    password: await userModel.hashPassword(DEMO_RIDER.password),
  });

  // Demo captain — already online with a fixed location
  const captain = await captainModel.create({
    fullname: { firstname: 'Sam', lastname: 'Rivera' },
    email: DEMO_CAPTAIN.email,
    phone: '9876501234',
    password: await captainModel.hashPassword(DEMO_CAPTAIN.password),
    status: 'active',
    vehicle: { color: 'Black', plate: 'MH-01-AB-1234', capacity: 4, vehicleType: 'car' },
    location: { type: 'Point', coordinates: [ CAPTAIN_LOCATION.lng, CAPTAIN_LOCATION.ltd ] },
  });

  // Sample completed rides so history and stats are populated
  for (const ride of SAMPLE_RIDES) {
    await rideModel.create({
      user: rider._id,
      captain: captain._id,
      otp: '123456',
      status: 'completed',
      paymentStatus: 'received',
      ...ride,
    });
  }

  console.log('\nDemo accounts created:\n');
  console.log(`  Rider    → ${DEMO_RIDER.email} / ${DEMO_RIDER.password}`);
  console.log(`  Captain  → ${DEMO_CAPTAIN.email} / ${DEMO_CAPTAIN.password}`);
  console.log('\nThe captain is online near Gateway of India, Mumbai (18.922, 72.8346).');
  console.log('For a live booking demo, open /home and pick a pickup location near Mumbai.');

  if (disconnect) {
    await mongoose.disconnect();
    console.log('\nDone.');
  }
}

module.exports = { runSeed };

if (require.main === module) {
  runSeed().catch((err) => {
    console.error(err.message || err);
    process.exit(1);
  });
}
