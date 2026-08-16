import { useEffect, useState } from 'react';
import { RIDE_OPTIONS } from './VehiclePanel';
import Button from './ui/Button';
import api from '../lib/api';

const LookingForDriver = ({ rideType, pickup, destination, fare, onCancel, onRetry }) => {
  const option = RIDE_OPTIONS[rideType] || RIDE_OPTIONS.car;
  const [timedOut, setTimedOut] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  // If no captain accepts within 30s, stop spinning and offer a retry —
  // like real ride-hailing apps do when no captain is available nearby.
  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 30000);
    return () => clearTimeout(timer);
  }, []);

  // Ask the backend whether any captain is online near the pickup, so the
  // rider sees a real status instead of a silent spinner. Re-checks every
  // few seconds while the request is still being broadcast.
  useEffect(() => {
    let cancelled = false;
    let interval;

    const check = async () => {
      if (!pickup?.trim()) return;
      setAvailabilityLoading(true);
      try {
        const res = await api.get('/rides/availability', { params: { pickup: pickup.trim() } });
        if (!cancelled) setAvailability(res.data);
      } catch {
        if (!cancelled) setAvailability(null);
      } finally {
        if (!cancelled) setAvailabilityLoading(false);
      }
    };

    check();
    interval = setInterval(check, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [pickup]);

  const showNoCaptain = timedOut && availability && !availability.available;

  return (
    <div>
      <h3 className="text-xl font-extrabold text-ui-ink">Looking for a captain</h3>
      <p className="mt-1 text-sm text-ui-faint">
        {showNoCaptain
          ? 'No captains are available near your pickup right now.'
          : timedOut
            ? 'Captains are online nearby, but none has accepted yet. Keep waiting or try again.'
            : `We are notifying ${option.name} captains near your pickup…`}
      </p>

      <div className="mt-5 flex items-center justify-center gap-3 rounded-2xl border border-ui-line bg-ui-card2 py-6">
        {showNoCaptain ? (
          <span className="flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400">
            <i className="ri-user-unfollow-line text-lg" /> No captain available nearby
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

      {/* Live availability status — tells the rider if captains exist nearby */}
      {availability && !availabilityLoading && (
        <div
          className={`mt-3 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-xs font-semibold ${
            availability.available
              ? 'border-green-500/30 bg-green-500/10 text-green-700 dark:border-green-500/40 dark:bg-green-500/15 dark:text-green-400'
              : 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-400'
          }`}
        >
          {availability.available ? (
            <>
              <i className="ri-radio-button-line animate-pulse" />
              {availability.count} captain{availability.count === 1 ? '' : 's'} online near your pickup — request sent
            </>
          ) : (
            <>
              <i className="ri-information-line" />
              No captains are online within {availability.radiusKm} km of your pickup right now
            </>
          )}
        </div>
      )}

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

      {showNoCaptain && (
        <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-400">
          <i className="ri-information-line mr-1" />
          No captains are currently online near your pickup. You can keep waiting, try the same
          route again in a moment, or pick a pickup point closer to a busy area.
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
