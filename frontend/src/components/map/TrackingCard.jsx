import MiniMap from './MiniMap';

const rideOptions = [
  { icon: 'ri-motorbike-fill', name: 'Economy', eta: '2 min away', seats: 1, price: '₹252' },
  { icon: 'ri-taxi-fill', name: 'Comfort', eta: '4 min away', seats: 3, price: '₹383' },
  { icon: 'ri-car-fill', name: 'Premium', eta: '6 min away', seats: 4, price: '₹560' },
];

const rows = [
  { title: 'Pickup', value: 'Gateway of India', icon: 'ri-map-pin-fill', color: 'text-green-500' },
  { title: 'Destination', value: 'Bandra West, Mumbai', icon: 'ri-map-pin-fill', color: 'text-amber-500' },
];

/**
 * Compact floating tracking card for the landing hero. A pulsing "Live
 * tracking" pill sits at the top-left (no competing pin icon); below it a
 * compact real map shows the demo route, pickup/destination pins and a car
 * animated along the route.
 */
const TrackingCard = () => (
  <div className="relative mx-auto w-full max-w-[400px]">
    <div className="overflow-hidden rounded-2xl border border-ui-line bg-ui-card/85 shadow-lift backdrop-blur-md">
      {/* Live tracking pill (top-left, pulsing) */}
      <div className="absolute left-3 top-3 z-[1001]">
        <span
          className="inline-flex items-center gap-2 rounded-full border border-ui-line bg-ui-card/95 px-3 py-1.5 text-xs font-bold text-ui-ink shadow-card"
          title="Demo ride simulation"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          Live tracking
        </span>
      </div>

      {/* Compact map */}
      <div className="relative h-[150px]">
        <MiniMap />
      </div>

      {/* Pickup / destination */}
      <div className="space-y-2 p-3">
        {rows.map((row) => (
          <div key={row.title} className="flex items-center gap-2.5">
            <span className={`text-base ${row.color}`}>
              <i className={row.icon} />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-ui-faint">{row.title}</p>
              <p className="truncate text-sm font-medium text-ui-ink">{row.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ride options */}
      <div className="space-y-1 border-t border-ui-line p-3">
        {rideOptions.map((ride) => (
          <div
            key={ride.name}
            className="flex items-center justify-between rounded-xl px-2.5 py-2 transition hover:bg-ui-card2"
          >
            <div className="flex items-center gap-2.5">
              <i className={`${ride.icon} text-lg text-ui-faint`} />
              <span className="text-sm font-semibold text-ui-ink">{ride.name}</span>
              <span className="text-xs text-ui-faint">
                {ride.eta} · {ride.seats} seat{ride.seats > 1 ? 's' : ''}
              </span>
            </div>
            <span className="text-sm font-bold text-ui-ink">{ride.price}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default TrackingCard;
