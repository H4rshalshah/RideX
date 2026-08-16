const WaitingForDriver = ({ ride }) => {
  const captain = ride?.captain;
  const vehicle = captain?.vehicle;
  const vehicleName = vehicle?.vehicleType
    ? { car: 'RideX Car', auto: 'RideX Auto', moto: 'RideX Moto' }[vehicle.vehicleType]
    : 'RideX vehicle';

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-ink-900">Your captain is on the way</h3>
        <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
          <i className="ri-radio-button-line animate-pulse" /> Confirmed
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4 rounded-2xl border border-ink-100 bg-ink-50/60 p-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xl font-extrabold text-white">
          {captain?.fullname?.firstname?.[0]?.toUpperCase() || 'R'}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold capitalize text-ink-900">
            {captain?.fullname?.firstname} {captain?.fullname?.lastname}
          </p>
          <p className="truncate text-sm text-ink-500">
            {vehicleName} · {vehicle?.plate}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Ride OTP</p>
          <p className="font-mono text-xl font-extrabold tracking-widest text-brand-600">{ride?.otp}</p>
        </div>
      </div>

      <div className="mt-4 divide-y divide-ink-100 rounded-2xl border border-ink-100 px-4">
        {[
          { icon: 'ri-map-pin-user-line', label: 'Pickup', value: ride?.pickup || 'Current location' },
          { icon: 'ri-map-pin-2-fill', label: 'Destination', value: ride?.destination },
          { icon: 'ri-wallet-3-line', label: 'Fare', value: `₹${ride?.fare}` },
        ].map((row) => (
          <div key={row.label} className="flex items-center gap-3.5 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500">
              <i className={row.icon} />
            </span>
            <div className="min-w-0">
              <p className="text-sm text-ink-500">{row.label}</p>
              <p className="truncate font-semibold text-ink-900">{row.value}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
        <i className="ri-information-line mr-1" />
        Share this OTP with your captain to start the ride. Tracking starts automatically.
      </p>
    </div>
  );
};

export default WaitingForDriver;
