import { RIDE_OPTIONS } from './VehiclePanel';
import Button from './ui/Button';

const Row = ({ icon, title, value, sub }) => (
  <div className="flex items-start gap-3.5 py-3.5">
    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ui-line bg-ui-card text-ui-muted">
      <i className={icon} />
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-sm text-ui-muted">{title}</p>
      <p className="truncate font-semibold text-ui-ink">{value}</p>
      {sub && <p className="text-xs text-ui-faint">{sub}</p>}
    </div>
  </div>
);

const ConfirmRide = ({ rideType, pickup, destination, fare, distanceText, durationText, loading = false, onConfirm, onClose }) => {
  const option = RIDE_OPTIONS[rideType] || RIDE_OPTIONS.car;

  return (
    <div>
      <div className="flex items-center justify-between">
      <h3 className="text-xl font-extrabold text-ui-ink">Confirm your ride</h3>
      <button
        onClick={onClose}
        disabled={loading}
        aria-label="Close confirmation"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-ui-line bg-ui-card text-ui-muted transition hover:bg-ui-card2 disabled:opacity-50"
      >
        <i className="ri-arrow-down-wide-line text-xl" />
      </button>
    </div>

    <div className="mt-4 rounded-2xl border border-ui-line bg-ui-card2/60 p-4">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ui-accent text-2xl text-ui-onaccent">
          <i className={option.icon} />
        </span>
        <div className="flex-1">
          <p className="font-bold text-ui-ink">
            {option.name} <span className="text-xs font-medium text-ui-faint">{option.tag}</span>
          </p>
          <p className="text-xs text-ui-muted">
            {distanceText ? `${distanceText} · ` : ''}
            {durationText ? `${durationText} trip` : 'trip'}
          </p>
        </div>
        <p className="text-2xl font-extrabold text-ui-ink">₹{fare?.[rideType] ?? '—'}</p>
      </div>

      <div className="mt-3 divide-y divide-ui-line border-t border-ui-line">
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
