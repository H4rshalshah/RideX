import { useState } from 'react';
import Button from './ui/Button';
import api, { getErrorMessage } from '../lib/api';
import { useToast } from './ui/Toast';

const chip = 'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold';

const WaitingForDriver = ({ ride, onCancel }) => {
  const [cancelling, setCancelling] = useState(false);
  const { toast } = useToast();

  const captain = ride?.captain;
  const vehicle = captain?.vehicle;
  const vehicleName = vehicle?.vehicleType
    ? { car: 'RideX Car', auto: 'RideX Auto', moto: 'RideX Moto' }[vehicle.vehicleType]
    : 'RideX vehicle';

  const cancelRide = async () => {
    setCancelling(true);
    try {
      await api.post('/rides/cancel', { rideId: ride._id });
      toast('Ride cancelled.', 'info');
      onCancel?.();
    } catch (err) {
      toast(getErrorMessage(err, 'Could not cancel this ride right now.'), 'error');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-ui-ink">Your captain is on the way</h3>
        <span className={`${chip} border-green-500/30 bg-green-500/10 text-green-600 dark:border-green-500/40 dark:bg-green-500/15 dark:text-green-400`}>
          <i className="ri-radio-button-line animate-pulse" /> Confirmed
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4 rounded-2xl border border-ui-line bg-ui-card2/60 p-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ui-accent text-xl font-extrabold text-ui-onaccent">
          {captain?.fullname?.firstname?.[0]?.toUpperCase() || 'R'}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold capitalize text-ui-ink">
            {captain?.fullname?.firstname} {captain?.fullname?.lastname}
          </p>
          <p className="truncate text-sm text-ui-muted">
            {vehicleName} · {vehicle?.plate}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ui-faint">Ride OTP</p>
          <p className="font-mono text-xl font-extrabold tracking-widest text-ui-ink">{ride?.otp}</p>
        </div>
      </div>

      <div className="mt-4 divide-y divide-ui-line rounded-2xl border border-ui-line px-4">
        {[
          { icon: 'ri-map-pin-user-line', label: 'Pickup', value: ride?.pickup || 'Current location' },
          { icon: 'ri-map-pin-2-fill', label: 'Destination', value: ride?.destination },
          { icon: 'ri-wallet-3-line', label: 'Fare', value: `₹${ride?.fare}` },
        ].map((row) => (
          <div key={row.label} className="flex items-center gap-3.5 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ui-line bg-ui-card text-ui-muted">
              <i className={row.icon} />
            </span>
            <div className="min-w-0">
              <p className="text-sm text-ui-muted">{row.label}</p>
              <p className="truncate font-semibold text-ui-ink">{row.value}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-400">
        <i className="ri-information-line mr-1" />
        Share this OTP with your captain to start the ride. Tracking starts automatically.
      </p>

      {onCancel && (
        <Button
          variant="danger"
          size="lg"
          className="mt-4 w-full"
          loading={cancelling}
          onClick={cancelRide}
        >
          <i className="ri-close-circle-line" /> Cancel ride
        </Button>
      )}
    </div>
  );
};

export default WaitingForDriver;
