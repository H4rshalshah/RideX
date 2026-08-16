// Minimal: does an online captain near the pickup receive new-ride?
import { io } from 'socket.io-client';

const BASE = 'http://localhost:3000';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) } });
  return res.json();
}

const stamp = Date.now();

console.log('step: register user');
const userRes = await api('/users/register', {
  method: 'POST',
  body: JSON.stringify({ fullname: { firstname: 'Mini', lastname: 'Rider' }, email: `mr${stamp}@ridex.app`, password: 'demo123' }),
});
console.log('  user:', userRes.user ? 'ok' : JSON.stringify(userRes).slice(0, 120));

console.log('step: register captain');
const capRes = await api('/captains/register', {
  method: 'POST',
  body: JSON.stringify({
    fullname: { firstname: 'Mini', lastname: 'Captain' },
    email: `mc${stamp}@ridex.app`,
    password: 'demo123',
    vehicle: { color: 'White', plate: 'MH 01 XY 9999', capacity: 4, vehicleType: 'car' },
  }),
});
console.log('  captain:', capRes.captain ? 'ok' : JSON.stringify(capRes).slice(0, 120));

console.log('step: connect sockets');
const userSock = io(BASE, { transports: ['websocket'], reconnectionAttempts: 2, timeout: 5000 });
const capSock = io(BASE, { transports: ['websocket'], reconnectionAttempts: 2, timeout: 5000 });
await Promise.all([
  new Promise((r) => userSock.on('connect', r)),
  new Promise((r) => capSock.on('connect', r)),
]);
console.log('  sockets connected');

console.log('step: join sockets (user + captain)');
userSock.emit('join', { userType: 'user', userId: userRes.user._id });
capSock.emit('join', { userType: 'captain', userId: capRes.captain._id });
await sleep(400);

console.log('step: captain online + location near Mumbai');
capSock.emit('set-status', { userId: capRes.captain._id, status: 'active' });
capSock.emit('update-location-captain', { userId: capRes.captain._id, location: { ltd: 18.922, lng: 72.834 } });
await sleep(1000);

console.log('step: create ride');
const ride = await api('/rides/create', {
  method: 'POST',
  headers: { Authorization: `Bearer ${userRes.token}` },
  body: JSON.stringify({ pickup: 'Gateway of India, Mumbai', destination: 'Bandra West, Mumbai', vehicleType: 'car' }),
});
console.log('  ride:', ride._id ? `created ${ride.status}` : JSON.stringify(ride).slice(0, 200));

console.log('step: wait for new-ride on captain socket (10s timeout)');
const newRide = await Promise.race([
  new Promise((resolve) => capSock.once('new-ride', resolve)),
  sleep(10000).then(() => null),
]);
console.log('  new-ride received:', newRide ? 'YES' : 'NO (timeout)');

userSock.close();
capSock.close();
process.exit(0);
