import { RIDE_OPTIONS } from './VehiclePanel';
import Button from './ui/Button';

const LookingForDriver = ({ rideType, pickup, destination, fare, onCancel }) => {
  const option = RIDE_OPTIONS[rideType] || RIDE_OPTIONS.car;

  return (
    <div>
      <h3 className="text-xl font-extrabold text-ui-ink">Looking for a captain</h3>
      <p className="mt-1 text-sm text-ui-faint">
        We are notifying {option.name} captains near your pickup…
      </p>

      <div className="mt-5 flex items-center justify-center gap-3 rounded-2xl border border-ui-line bg-ui-card2 py-6">
        <span className="relative flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ui-faint opacity-60" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-ui-ink" />
        </span>
        <p className="text-sm font-semibold text-ui-ink">Finding your ride</p>
      </div>

      <div className="mt-4 divide-y divide-ui-line rounded-2xl border border-ui-line px-4">
        <div className="flex items-center gap-3.5 py-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ui-line bg-ui-card text-ui-muted">
            <i className="ri-map-pin-user-line" />
          </span>
          <div className="min-w-0">
            <p className="text-sm text-ui-muted">Pickup</p>
            <p className="truncate font-semibold text-ui-ink">{pickup || 'Current location'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3.5 py-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ui-line bg-ui-card text-ui-muted">
            <i className="ri-map-pin-2-fill" />
          </span>
          <div className="min-w-0">
            <p className="text-sm text-ui-muted">Destination</p>
            <p className="truncate font-semibold text-ui-ink">{destination}</p>
          </div>
        </div>
        <div className="flex items-center gap-3.5 py-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ui-line bg-ui-card text-ui-muted">
            <i className="ri-wallet-3-line" />
          </span>
          <div className="min-w-0">
            <p className="text-sm text-ui-muted">Estimated fare</p>
            <p className="font-semibold text-ui-ink">₹{fare?.[rideType] ?? '—'}</p>
          </div>
        </div>
      </div>

      <Button variant="secondary" size="lg" className="mt-4 w-full" onClick={onCancel}>
        Cancel request
      </Button>
    </div>
  );
};

export default LookingForDriver;
