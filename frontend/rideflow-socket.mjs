// Full socket-driven lifecycle test, mirroring the real app flow
import { io } from 'socket.io-client';

const BASE = 'http://localhost:3000';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
  });
  return res.json();
}

const stamp = Date.now();

// 1. Register user + captain, connect sockets
const userRes = await api('/users/register', {
  method: 'POST',
  body: JSON.stringify({ fullname: { firstname: 'Sock', lastname: 'Rider' }, email: `sr${stamp}@ridex.app`, password: 'demo123' }),
});
const capRes = await api('/captains/register', {
  method: 'POST',
  body: JSON.stringify({
    fullname: { firstname: 'Sock', lastname: 'Captain' },
    email: `sc2${stamp}@ridex.app`,
    password: 'demo123',
    vehicle: { color: 'White', plate: 'MH 01 XY 5678', capacity: 4, vehicleType: 'car' },
  }),
});
const userToken = userRes.token;
const capToken = capRes.token;
const userId = userRes.user._id;
const capId = capRes.captain._id;

const userSock = io(BASE, { transports: ['websocket'] });
const capSock = io(BASE, { transports: ['websocket'] });
await Promise.all([new Promise((r) => userSock.on('connect', r)), new Promise((r) => capSock.on('connect', r))]);
userSock.emit('join', { userType: 'user', userId });
capSock.emit('join', { userType: 'captain', userId: capId });
capSock.emit('set-status', { userId: capId, status: 'active' });
await sleep(600);

// Set captain location near Mumbai so they get the new-ride
capSock.emit('update-location-captain', { userId: capId, location: { ltd: 18.922, lng: 72.834 } });
await sleep(600);

// 2. Create ride
const ride = await api('/rides/create', {
  method: 'POST',
  headers: { Authorization: `Bearer ${userToken}` },
  body: JSON.stringify({ pickup: 'Gateway of India, Mumbai', destination: 'Bandra West, Mumbai', vehicleType: 'car' }),
});

// 3. Captain should receive new-ride
const newRide = await new Promise((resolve) => capSock.once('new-ride', resolve));
console.log('captain got new-ride ✓ rideId:', newRide._id === ride._id);

// 4. Captain confirms → rider gets ride-confirmed
const confirmPromise = new Promise((resolve) => userSock.once('ride-confirmed', resolve));
await api('/rides/confirm', { method: 'POST', headers: { Authorization: `Bearer ${capToken}` }, body: JSON.stringify({ rideId: ride._id }) });
const confirmed = await confirmPromise;
console.log('rider got ride-confirmed ✓ otp:', confirmed.otp);

// 5. Captain starts with the OTP → rider gets ride-started
const startPromise = new Promise((resolve) => userSock.once('ride-started', resolve));
const started = await api(`/rides/start-ride?rideId=${ride._id}&otp=${confirmed.otp}`, { method: 'GET', headers: { Authorization: `Bearer ${capToken}` } });
const startedEvent = await startPromise;
console.log('rider got ride-started ✓ started.status =', started.status, '| event.status =', startedEvent.status);

// 6. Captain ends → rider gets ride-ended
const endPromise = new Promise((resolve) => userSock.once('ride-ended', resolve));
const ended = await api('/rides/end-ride', { method: 'POST', headers: { Authorization: `Bearer ${capToken}` }, body: JSON.stringify({ rideId: ride._id }) });
console.log('end-ride response:', ended.status, '| message:', ended.message || 'none');
const endedEvent = await endPromise;
console.log('rider got ride-ended ✓ event.status =', endedEvent.status);

userSock.close();
capSock.close();
console.log(ended.status === 'completed' && !ended.message ? '✅ FULL FLOW OK' : '❌ BUG');
process.exit(0);
