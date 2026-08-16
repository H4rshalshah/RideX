import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import api, { getErrorMessage } from '../lib/api';

const ConfirmRidePopUp = ({ ride, onClose }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);
  const navigate = useNavigate();

  const user = ride?.user;

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^\d{6}$/.test(otp.trim())) {
      setError('Enter the 6-digit OTP shared by the rider.');
      return;
    }
    setStarting(true);
    try {
      const res = await api.get('/rides/start-ride', {
        params: { rideId: ride._id, otp: otp.trim() },
      });
      onClose();
      navigate('/captain-riding', { state: { ride: res.data } });
    } catch (err) {
      setError(getErrorMessage(err, 'Could not start the ride. Check the OTP and try again.'));
    } finally {
      setStarting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-ink-900">Start the ride</h3>
        <button
          onClick={onClose}
          aria-label="Close"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-ink-600 transition hover:bg-ink-200"
        >
          <i className="ri-close-line text-xl" />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-4 rounded-2xl border border-ink-100 bg-ink-50/60 p-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-600 text-lg font-extrabold text-white">
          {user?.fullname?.firstname?.[0]?.toUpperCase() || 'R'}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold capitalize text-ink-900">
            {user?.fullname?.firstname} {user?.fullname?.lastname}
          </p>
          <p className="truncate text-xs text-ink-400">{ride?.destination}</p>
        </div>
        <p className="text-lg font-extrabold text-ink-900">₹{ride?.fare}</p>
      </div>

      <form onSubmit={submitHandler} className="mt-5" noValidate>
        <label htmlFor="captain-otp" className="mb-1.5 block text-sm font-semibold text-ink-800">
          Rider OTP
        </label>
        <input
          id="captain-otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="6-digit OTP"
          className={`w-full rounded-2xl border bg-white px-4 py-3.5 text-center font-mono text-2xl font-extrabold tracking-[0.5em] text-ink-900 placeholder:text-ink-300 focus:outline-none focus:ring-2 ${
            error ? 'border-red-400 focus:ring-red-100' : 'border-ink-200 focus:border-brand-500 focus:ring-brand-100'
          }`}
          aria-invalid={!!error}
        />
        {error && (
          <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="mt-4 w-full" loading={starting}>
          Confirm & start ride
        </Button>
      </form>
    </div>
  );
};

export default ConfirmRidePopUp;
