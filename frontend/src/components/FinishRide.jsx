import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import api, { getErrorMessage } from '../lib/api';
import { useToast } from './ui/Toast';

const FinishRide = ({ ride, onClose }) => {
  const [finishing, setFinishing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const user = ride?.user;

  const endRide = async () => {
    setFinishing(true);
    try {
      await api.post('/rides/end-ride', { rideId: ride._id });
      navigate('/captain-home');
    } catch (err) {
      toast(getErrorMessage(err, 'Could not finish the ride. Please try again.'), 'error');
      setFinishing(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-ink-900">Finish this ride</h3>
        <button
          onClick={onClose}
          aria-label="Close"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-ink-600 transition hover:bg-ink-200"
        >
          <i className="ri-arrow-down-wide-line text-xl" />
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
          <p className="text-xs text-ink-400">Collected on arrival</p>
        </div>
        <p className="text-lg font-extrabold text-ink-900">₹{ride?.fare}</p>
      </div>

      <div className="mt-4 space-y-3 rounded-2xl border border-ink-100 px-4">
        <div className="flex items-center gap-3.5 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500">
            <i className="ri-map-pin-user-line" />
          </span>
          <div className="min-w-0">
            <p className="text-sm text-ink-500">Pickup</p>
            <p className="truncate font-semibold text-ink-900">{ride?.pickup}</p>
          </div>
        </div>
        <div className="flex items-center gap-3.5 border-t border-ink-100 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500">
            <i className="ri-map-pin-2-fill" />
          </span>
          <div className="min-w-0">
            <p className="text-sm text-ink-500">Destination</p>
            <p className="truncate font-semibold text-ink-900">{ride?.destination}</p>
          </div>
        </div>
      </div>

      <Button size="lg" className="mt-5 w-full" loading={finishing} onClick={endRide}>
        <i className="ri-flag-2-line" /> Finish ride
      </Button>
    </div>
  );
};

export default FinishRide;
