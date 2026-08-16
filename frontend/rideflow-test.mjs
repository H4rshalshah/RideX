// Reproduce: rider books → captain confirms → captain starts (OTP) → captain ends
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

// 1. Register a user + captain
const userRes = await api('/users/register', {
  method: 'POST',
  body: JSON.stringify({ fullname: { firstname: 'Flow', lastname: 'Rider' }, email: `fr${stamp}@ridex.app`, password: 'demo123' }),
});
const capRes = await api('/captains/register', {
  method: 'POST',
  body: JSON.stringify({
    fullname: { firstname: 'Flow', lastname: 'Captain' },
    email: `fc${stamp}@ridex.app`,
    password: 'demo123',
    vehicle: { color: 'White', plate: 'MH 01 XY 1234', capacity: 4, vehicleType: 'car' },
  }),
});
const userToken = userRes.token;
const capToken = capRes.token;
console.log('registered user + captain');

// 2. Create ride
const ride = await api('/rides/create', {
  method: 'POST',
  headers: { Authorization: `Bearer ${userToken}` },
  body: JSON.stringify({ pickup: 'Gateway of India, Mumbai', destination: 'Bandra West, Mumbai', vehicleType: 'car' }),
});
console.log('ride created:', ride._id, 'status:', ride.status, 'fare:', ride.fare);

// 3. Captain confirms
const confirmed = await api('/rides/confirm', {
  method: 'POST',
  headers: { Authorization: `Bearer ${capToken}` },
  body: JSON.stringify({ rideId: ride._id }),
});
console.log('after confirm → status:', confirmed.status, 'otp:', confirmed.otp);

// 4. Captain starts with OTP
const started = await api(`/rides/start-ride?rideId=${ride._id}&otp=${confirmed.otp}`, {
  method: 'GET',
  headers: { Authorization: `Bearer ${capToken}` },
});
console.log('after start → status:', started.status, '| message:', started.message || '');

// 5. Captain ends the ride
const ended = await api('/rides/end-ride', {
  method: 'POST',
  headers: { Authorization: `Bearer ${capToken}` },
  body: JSON.stringify({ rideId: ride._id }),
});
console.log('after end → status:', ended.status, '| message:', ended.message || '');
if (ended.status === 'completed') {
  console.log('✅ RIDE FLOW WORKS');
} else {
  console.log('❌ BUG REPRODUCED:', ended.message);
}
process.exit(0);
