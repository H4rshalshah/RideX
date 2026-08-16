import { RIDE_OPTIONS } from './VehiclePanel';
import Button from './ui/Button';

const Row = ({ icon, title, value, sub }) => (
  <div className="flex items-start gap-3.5 py-3.5">
    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500">
      <i className={icon} />
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-sm text-ink-500">{title}</p>
      <p className="truncate font-semibold text-ink-900">{value}</p>
      {sub && <p className="text-xs text-ink-400">{sub}</p>}
    </div>
  </div>
);

const ConfirmRide = ({ rideType, pickup, destination, fare, distanceText, durationText, loading = false, onConfirm, onClose }) => {
  const option = RIDE_OPTIONS[rideType] || RIDE_OPTIONS.car;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-ink-900">Confirm your ride</h3>
        <button
          onClick={onClose}
          disabled={loading}
          aria-label="Close confirmation"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-ink-600 transition hover:bg-ink-200 disabled:opacity-50"
        >
          <i className="ri-arrow-down-wide-line text-xl" />
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-ink-100 bg-ink-50/60 p-4">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-2xl text-white">
            <i className={option.icon} />
          </span>
          <div className="flex-1">
            <p className="font-bold text-ink-900">
              {option.name} <span className="text-xs font-medium text-ink-400">{option.tag}</span>
            </p>
            <p className="text-xs text-ink-500">
              {distanceText ? `${distanceText} · ` : ''}
              {durationText ? `${durationText} trip` : 'trip'}
            </p>
          </div>
          <p className="text-2xl font-extrabold text-ink-900">₹{fare?.[rideType] ?? '—'}</p>
        </div>

        <div className="mt-3 divide-y divide-ink-100 border-t border-ink-100">
          <Row icon="ri-map-pin-user-line" title="Pickup" value={pickup || 'Current location'} />
          <Row icon="ri-map-pin-2-fill" title="Destination" value={destination} />
          <Row
            icon="ri-wallet-3-line"
            title="Payment"
            value="Cash on arrival"
            sub="Fare shown is the estimated total"
          />
        </div>
      </div>

      <Button size="lg" className="mt-4 w-full" loading={loading} onClick={onConfirm}>
        <i className="ri-check-double-line" /> Confirm ride
      </Button>
    </div>
  );
};

export default ConfirmRide;
