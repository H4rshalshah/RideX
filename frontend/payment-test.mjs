// Verify end-ride stores paymentStatus from the captain's payment confirmation.
const BASE = 'http://localhost:3000';
async function api(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) } });
  return res.json();
}
const stamp = Date.now();

async function runFlow(paymentReceived, tag) {
  const userRes = await api('/users/register', {
    method: 'POST',
    body: JSON.stringify({ fullname: { firstname: 'Pay', lastname: 'Rider' }, email: `${tag}u${stamp}@ridex.app`, password: 'demo123' }),
  });
  const capRes = await api('/captains/register', {
    method: 'POST',
    body: JSON.stringify({
      fullname: { firstname: 'Pay', lastname: 'Captain' },
      email: `${tag}c${stamp}@ridex.app`, password: 'demo123',
      vehicle: { color: 'White', plate: 'MH 01 XY 7777', capacity: 4, vehicleType: 'car' },
    }),
  });
  const ride = await api('/rides/create', {
    method: 'POST',
    headers: { Authorization: `Bearer ${userRes.token}` },
    body: JSON.stringify({ pickup: 'Gateway of India, Mumbai', destination: 'Bandra West, Mumbai', vehicleType: 'car' }),
  });
  const confirmed = await api('/rides/confirm', {
    method: 'POST', headers: { Authorization: `Bearer ${capRes.token}` }, body: JSON.stringify({ rideId: ride._id }),
  });
  await api(`/rides/start-ride?rideId=${ride._id}&otp=${confirmed.otp}`, { method: 'GET', headers: { Authorization: `Bearer ${capRes.token}` } });
  const ended = await api('/rides/end-ride', {
    method: 'POST', headers: { Authorization: `Bearer ${capRes.token}` }, body: JSON.stringify({ rideId: ride._id, paymentReceived }),
  });
  return { status: ended.status, paymentStatus: ended.paymentStatus, message: ended.message || '' };
}

const paid = await runFlow(true, 'a');
console.log('paymentReceived=true  →', JSON.stringify(paid));
const notPaid = await runFlow(false, 'b');
console.log('paymentReceived=false →', JSON.stringify(notPaid));

const okPaid = paid.status === 'completed' && paid.paymentStatus === 'received';
const okNot = notPaid.status === 'completed' && notPaid.paymentStatus === 'pending';
console.log(okPaid && okNot ? '✅ PAYMENT STATUS WORKS' : '❌ BUG');
process.exit(0);
