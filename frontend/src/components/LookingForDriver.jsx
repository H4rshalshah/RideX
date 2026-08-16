import { useEffect, useState } from 'react';
import { RIDE_OPTIONS } from './VehiclePanel';
import Button from './ui/Button';

const LookingForDriver = ({ rideType, pickup, destination, fare, onCancel, onRetry }) => {
  const option = RIDE_OPTIONS[rideType] || RIDE_OPTIONS.car;
  const [timedOut, setTimedOut] = useState(false);

  // If no captain accepts within 30s, stop spinning and offer a retry —
  // like real ride-hailing apps do when no captain is available nearby.
  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 30000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <h3 className="text-xl font-extrabold text-ui-ink">Looking for a captain</h3>
      <p className="mt-1 text-sm text-ui-faint">
        {timedOut
          ? 'No captains were available nearby. Try again in a moment.'
          : `We are notifying ${option.name} captains near your pickup…`}
      </p>

      <div className="mt-5 flex items-center justify-center gap-3 rounded-2xl border border-ui-line bg-ui-card2 py-6">
        {timedOut ? (
          <span className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
            <i className="ri-user-unfollow-line text-lg" /> No captain found yet
          </span>
        ) : (
          <>
            <span className="relative flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ui-faint opacity-60" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-ui-ink" />
            </span>
            <p className="text-sm font-semibold text-ui-ink">Finding your ride</p>
          </>
        )}
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

      {timedOut && (
        <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-400">
          <i className="ri-information-line mr-1" />
          Make sure a captain is online near your pickup, then try again. Your request will be
          sent out to captains in the area.
        </p>
      )}

      <div className="mt-4 flex gap-3">
        <Button variant="secondary" size="lg" className="flex-1" onClick={onCancel}>
          Cancel request
        </Button>
        {onRetry && (
          <Button size="lg" className="flex-1" onClick={onRetry}>
            <i className="ri-refresh-line" /> Try again
          </Button>
        )}
      </div>
    </div>
  );
};

export default LookingForDriver;
