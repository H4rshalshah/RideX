import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import api, { getErrorMessage } from '../lib/api';
import { useToast } from './ui/Toast';

const FinishRide = ({ ride, onClose }) => {
  const [paymentStep, setPaymentStep] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const user = ride?.user;

  const endRide = async (paymentReceived) => {
    setFinishing(true);
    try {
      await api.post('/rides/end-ride', { rideId: ride._id, paymentReceived });
      toast(
        paymentReceived
          ? 'Ride finished — payment received. Thanks!'
          : 'Ride finished — payment not done yet. Ask the rider to pay.',
        paymentReceived ? 'success' : 'info'
      );
      navigate('/captain-home');
    } catch (err) {
      const message = getErrorMessage(err, '');
      // The ride may already be over (completed/cancelled elsewhere) — don't trap
      // the captain on a stale screen. Treat it as finished and go to the dashboard.
      if (/not ongoing|not found/i.test(message)) {
        toast('This ride is already finished.', 'info');
        navigate('/captain-home');
      } else {
        toast(message || 'Could not finish the ride. Please try again.', 'error');
        setFinishing(false);
      }
    }
  };

  if (paymentStep) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-ui-ink">Confirm payment</h3>
          <button
            onClick={() => setPaymentStep(false)}
            aria-label="Back"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ui-line bg-ui-card text-ui-muted transition hover:bg-ui-card2"
          >
            <i className="ri-arrow-up-line text-xl" />
          </button>
        </div>
        <p className="mt-1 text-sm text-ui-muted">
          Did the rider pay the fare of <b className="text-ui-ink">₹{ride?.fare}</b>? This keeps
          both sides clear about the payment.
        </p>

        <div className="mt-5 flex items-center gap-4 rounded-2xl border border-ui-line bg-ui-card2/60 p-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ui-accent text-lg font-extrabold text-ui-onaccent">
            {user?.fullname?.firstname?.[0]?.toUpperCase() || 'R'}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold capitalize text-ui-ink">
              {user?.fullname?.firstname} {user?.fullname?.lastname}
            </p>
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

        <div className="mt-5 flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full"
            loading={finishing}
            onClick={() => endRide(true)}
          >
            <i className="ri-check-double-line" /> Yes, payment received
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="w-full"
            loading={finishing}
            onClick={() => endRide(false)}
          >
            <i className="ri-time-line" /> No, not done yet
          </Button>
        </div>
        <p className="mt-4 rounded-xl border border-ui-line bg-ui-card2/40 px-3.5 py-2.5 text-xs leading-relaxed text-ui-muted">
          <i className="ri-shield-check-line mr-1" />
          The rider will be thanked or reminded to pay, based on your answer. The choice is saved
          on the ride so both sides can verify it later.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-ui-ink">Finish this ride</h3>
        <button
          onClick={onClose}
          aria-label="Close"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ui-line bg-ui-card text-ui-muted transition hover:bg-ui-card2"
        >
          <i className="ri-arrow-down-wide-line text-xl" />
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
          <p className="text-xs text-ui-faint">Collected on arrival</p>
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

      <div className="mt-4 space-y-3 rounded-2xl border border-ui-line px-4">
        <div className="flex items-center gap-3.5 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ui-line bg-ui-card text-ui-muted">
            <i className="ri-map-pin-user-line" />
          </span>
          <div className="min-w-0">
            <p className="text-sm text-ui-muted">Pickup</p>
            <p className="truncate font-semibold text-ui-ink">{ride?.pickup}</p>
          </div>
        </div>
        <div className="flex items-center gap-3.5 border-t border-ui-line py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ui-line bg-ui-card text-ui-muted">
            <i className="ri-map-pin-2-fill" />
          </span>
          <div className="min-w-0">
            <p className="text-sm text-ui-muted">Destination</p>
            <p className="truncate font-semibold text-ui-ink">{ride?.destination}</p>
          </div>
        </div>
      </div>

      <Button size="lg" className="mt-5 w-full" onClick={() => setPaymentStep(true)}>
        <i className="ri-flag-2-line" /> Finish ride
      </Button>
    </div>
  );
};

export default FinishRide;
