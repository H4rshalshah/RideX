import Button from './ui/Button';

const RidePopUp = ({ ride, onAccept, onIgnore, accepting = false }) => {
  const user = ride?.user;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-ink-900">New ride request</h3>
        <span className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand-600" /> Live
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4 rounded-2xl border border-ink-100 bg-ink-50/60 p-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-600 text-lg font-extrabold text-white">
          {user?.fullname?.firstname?.[0]?.toUpperCase() || 'R'}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold capitalize text-ink-900">
            {user?.fullname?.firstname} {user?.fullname?.lastname}
          </p>
          <p className="text-xs text-ink-400">Waiting near pickup</p>
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

      <div className="mt-4 flex gap-3">
        <Button
          variant="secondary"
          size="lg"
          className="flex-1"
          onClick={onIgnore}
          disabled={accepting}
        >
          Ignore
        </Button>
        <Button size="lg" className="flex-1" onClick={onAccept} loading={accepting}>
          <i className="ri-check-double-line" /> Accept
        </Button>
      </div>
    </div>
  );
};

export default RidePopUp;
