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
      <h3 className="text-xl font-extrabold text-ink-900">Choose your ride</h3>
      <button
        onClick={onClose}
        aria-label="Close ride options"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-ink-600 transition hover:bg-ink-200"
      >
        <i className="ri-arrow-down-wide-line text-xl" />
      </button>
    </div>
    <p className="mt-1 text-sm text-ink-400">Upfront fares — no surprises.</p>

    <div className="mt-4 space-y-2.5">
      {Object.values(RIDE_OPTIONS).map((ride) => (
        <button
          key={ride.type}
          type="button"
          onClick={() => onSelect(ride.type)}
          className="group flex w-full items-center gap-4 rounded-2xl border border-ink-100 bg-white p-4 text-left shadow-card transition hover:border-brand-300 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-3xl text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
            <i className={ride.icon} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-base font-bold text-ink-900">{ride.name}</span>
              <span className="text-xs font-medium text-ink-400">{ride.tag}</span>
            </span>
            <span className="mt-0.5 flex items-center gap-3 text-xs text-ink-500">
              <span className="inline-flex items-center gap-1">
                <i className="ri-time-line" />
                {etaMinutes ? `~${etaMinutes} min away` : 'nearby'}
              </span>
              <span className="inline-flex items-center gap-1">
                <i className="ri-user-3-line" /> {ride.seats}
              </span>
            </span>
            <span className="mt-0.5 block text-xs text-ink-400">{ride.description}</span>
          </span>
          <span className="text-lg font-extrabold text-ink-900">
            ₹{fare?.[ride.type] ?? '—'}
          </span>
        </button>
      ))}
    </div>
  </div>
);

export default VehiclePanel;
