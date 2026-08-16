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
      <div className="flex items-center justify-between">      <h3 className="text-xl font-extrabold text-ui-ink">Start the ride</h3>
      <button
        onClick={onClose}
        aria-label="Close"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-ui-line bg-ui-card text-ui-muted transition hover:bg-ui-card2"
      >
        <i className="ri-close-line text-xl" />
      </button>
    </div>

      <div className="mt-4 flex items-center gap-4 rounded-2xl border border-ui-line bg-ui-card2/60 p-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ui-accent text-lg font-extrabold text-ui-onaccent">
          {user?.fullname?.firstname?.[0]?.toUpperCase() || 'R'}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold capitalize text-ui-ink">
            {user?.fullname?.firstname} {user?.fullname?.lastname}
          </p>
          <p className="truncate text-xs text-ui-faint">{ride?.destination}</p>
          {user?.phone && (
            <a
              href={`tel:${user.phone}`}
              className="mt-0.5 inline-flex items-center gap-1.5 text-xs font-semibold text-ui-ink/80 transition hover:text-ui-ink"
            >
              <i className="ri-phone-line text-ui-faint" /> {user.phone}
            </a>
          )}
        </div>
        <p className="text-lg font-extrabold text-ui-ink">₹{ride?.fare}</p>
      </div>

      <form onSubmit={submitHandler} className="mt-5" noValidate>
        <label htmlFor="captain-otp" className="mb-1.5 block text-sm font-semibold text-ui-ink">
          Rider OTP
        </label>
        <input
          id="captain-otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="6-digit OTP"
          className={`w-full rounded-2xl border bg-ui-card px-4 py-3.5 text-center font-mono text-2xl font-extrabold tracking-[0.5em] text-ui-ink placeholder:text-ui-faint focus:outline-none focus:ring-2 ${
            error ? 'border-red-500/60 focus:ring-red-500/15' : 'border-ui-line focus:border-ui-ink focus:ring-ui-ink/10'
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
