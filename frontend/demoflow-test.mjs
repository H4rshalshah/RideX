import { io } from 'socket.io-client';
const BASE = 'http://localhost:3000';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function api(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) } });
  return res.json();
}
const rider = await api('/users/login', { method: 'POST', body: JSON.stringify({ email: 'demo@ridex.app', password: 'demo1234' }) });
const captain = await api('/captains/login', { method: 'POST', body: JSON.stringify({ email: 'captain@ridex.app', password: 'demo1234' }) });
console.log('rider:', rider.user ? 'ok' : 'FAIL ' + rider.message);
console.log('captain:', captain.captain ? 'ok' : 'FAIL ' + captain.message);

const userSock = io(BASE, { transports: ['websocket'] });
const capSock = io(BASE, { transports: ['websocket'] });
await Promise.all([new Promise((r) => userSock.on('connect', r)), new Promise((r) => capSock.on('connect', r))]);
userSock.emit('join', { userType: 'user', userId: rider.user._id });
capSock.emit('join', { userType: 'captain', userId: captain.captain._id });
capSock.emit('set-status', { userId: captain.captain._id, status: 'active' });
capSock.emit('update-location-captain', { userId: captain.captain._id, location: { ltd: 18.922, lng: 72.834 } });
await sleep(800);

const ride = await api('/rides/create', {
  method: 'POST',
  headers: { Authorization: `Bearer ${rider.token}` },
  body: JSON.stringify({ pickup: 'Gateway of India, Mumbai', destination: 'Bandra West, Mumbai', vehicleType: 'car' }),
});
console.log('ride created:', ride.status, ride._id);
const newRide = await new Promise((res) => capSock.once('new-ride', res));
console.log('captain got new-ride:', newRide._id === ride._id);
const confP = new Promise((res) => userSock.once('ride-confirmed', res));
await api('/rides/confirm', { method: 'POST', headers: { Authorization: `Bearer ${captain.token}` }, body: JSON.stringify({ rideId: ride._id }) });
const conf = await confP;
console.log('confirmed, otp:', conf.otp, 'status:', conf.status);
const startP = new Promise((res) => userSock.once('ride-started', res));
const started = await api(`/rides/start-ride?rideId=${ride._id}&otp=${conf.otp}`, { method: 'GET', headers: { Authorization: `Bearer ${captain.token}` } });
await startP;
console.log('started response status:', started.status, '| message:', started.message || 'none');
const endP = new Promise((res) => userSock.once('ride-ended', res));
const ended = await api('/rides/end-ride', { method: 'POST', headers: { Authorization: `Bearer ${captain.token}` }, body: JSON.stringify({ rideId: ride._id }) });
const endEvt = await endP;
console.log('end-ride response:', ended.status, '| message:', ended.message || 'none');
console.log('ride-ended event status:', endEvt.status);
userSock.close(); capSock.close();
console.log(ended.message ? '❌ BUG: ' + ended.message : '✅ OK (but note response statuses are stale)');
process.exit(0);
