import Button from './ui/Button';

const RidePopUp = ({ ride, onAccept, onIgnore, accepting = false }) => {
  const user = ride?.user;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-ui-ink">New ride request</h3>
        <span className="flex items-center gap-1.5 rounded-full border border-ui-line bg-ui-card px-3 py-1 text-xs font-bold text-ui-muted">
          <span className="h-2 w-2 animate-pulse rounded-full bg-ui-ink" /> Live
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4 rounded-2xl border border-ui-line bg-ui-card2/60 p-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ui-accent text-lg font-extrabold text-ui-onaccent">
          {user?.fullname?.firstname?.[0]?.toUpperCase() || 'R'}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold capitalize text-ui-ink">
            {user?.fullname?.firstname} {user?.fullname?.lastname}
          </p>
          <p className="text-xs text-ui-faint">Waiting near pickup</p>
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
