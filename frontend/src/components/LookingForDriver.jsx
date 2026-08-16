import { RIDE_OPTIONS } from './VehiclePanel';
import Button from './ui/Button';

const LookingForDriver = ({ rideType, pickup, destination, fare, onCancel }) => {
  const option = RIDE_OPTIONS[rideType] || RIDE_OPTIONS.car;

  return (
    <div>
      <h3 className="text-xl font-extrabold text-ink-900">Looking for a captain</h3>
      <p className="mt-1 text-sm text-ink-400">
        We are notifying {option.name} captains near your pickup…
      </p>

      <div className="mt-5 flex items-center justify-center gap-3 rounded-2xl bg-brand-50 py-6">
        <span className="relative flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-brand-600" />
        </span>
        <p className="text-sm font-semibold text-brand-700">Finding your ride</p>
      </div>

      <div className="mt-4 divide-y divide-ink-100 rounded-2xl border border-ink-100 px-4">
        <div className="flex items-center gap-3.5 py-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500">
            <i className="ri-map-pin-user-line" />
          </span>
          <div className="min-w-0">
            <p className="text-sm text-ink-500">Pickup</p>
            <p className="truncate font-semibold text-ink-900">{pickup || 'Current location'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3.5 py-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500">
            <i className="ri-map-pin-2-fill" />
          </span>
          <div className="min-w-0">
            <p className="text-sm text-ink-500">Destination</p>
            <p className="truncate font-semibold text-ink-900">{destination}</p>
          </div>
        </div>
        <div className="flex items-center gap-3.5 py-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500">
            <i className="ri-wallet-3-line" />
          </span>
          <div className="min-w-0">
            <p className="text-sm text-ink-500">Estimated fare</p>
            <p className="font-semibold text-ink-900">₹{fare?.[rideType] ?? '—'}</p>
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
