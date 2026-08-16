export const RIDE_OPTIONS = {
  moto: {
    type: 'moto',
    name: 'Economy',
    tag: 'RideX Moto',
    seats: 1,
    icon: 'ri-motorbike-fill',
    description: 'Budget rides for quick solo trips',
  },
  auto: {
    type: 'auto',
    name: 'Comfort',
    tag: 'RideX Auto',
    seats: 3,
    icon: 'ri-taxi-fill',
    description: 'Spacious three-wheeler for daily commutes',
  },
  car: {
    type: 'car',
    name: 'Premium',
    tag: 'RideX Car',
    seats: 4,
    icon: 'ri-car-fill',
    description: 'Comfortable car rides with extra space',
  },
};

const VehiclePanel = ({ fare, etaMinutes, onSelect, onClose }) => (
  <div>
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-extrabold text-ui-ink">Choose your ride</h3>
      <button
        onClick={onClose}
        aria-label="Close ride options"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-ui-line bg-ui-card text-ui-muted transition hover:bg-ui-card2"
      >
        <i className="ri-arrow-down-wide-line text-xl" />
      </button>
    </div>
    <p className="mt-1 text-sm text-ui-faint">Upfront fares — no surprises.</p>

    <div className="mt-4 space-y-2.5">
      {Object.values(RIDE_OPTIONS).map((ride) => (
        <button
          key={ride.type}
          type="button"
          onClick={() => onSelect(ride.type)}
          className="group flex w-full items-center gap-4 rounded-2xl border border-ui-line bg-ui-card p-4 text-left shadow-card transition hover:border-ui-faint hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ui-ink"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-ui-line bg-ui-card2 text-3xl text-ui-ink transition group-hover:bg-ui-accent group-hover:text-ui-onaccent">
            <i className={ride.icon} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-base font-bold text-ui-ink">{ride.name}</span>
              <span className="text-xs font-medium text-ui-faint">{ride.tag}</span>
            </span>
            <span className="mt-0.5 flex items-center gap-3 text-xs text-ui-muted">
              <span className="inline-flex items-center gap-1">
                <i className="ri-time-line" />
                {etaMinutes ? `~${etaMinutes} min away` : 'nearby'}
              </span>
              <span className="inline-flex items-center gap-1">
                <i className="ri-user-3-line" /> {ride.seats}
              </span>
            </span>
            <span className="mt-0.5 block text-xs text-ui-faint">{ride.description}</span>
          </span>
          <span className="text-lg font-extrabold text-ui-ink">
            ₹{fare?.[ride.type] ?? '—'}
          </span>
        </button>
      ))}
    </div>
  </div>
);

export default VehiclePanel;
