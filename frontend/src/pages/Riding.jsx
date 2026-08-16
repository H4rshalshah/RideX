import { useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';
import Logo from '../components/brand/Logo';
import { useToast } from '../components/ui/Toast';
import { SocketContext } from '../context/SocketContext';

const vehicleNames = { car: 'RideX Car', auto: 'RideX Auto', moto: 'RideX Moto' };

const Riding = () => {
  const location = useLocation();
  const { ride } = location.state || {};
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { toast } = useToast();

  const captain = ride?.captain;
  const vehicle = captain?.vehicle;

  useEffect(() => {
    if (!socket) return undefined;
    const onRideEnded = () => {
      toast('Ride completed — thanks for riding with RideX!', 'success');
      navigate('/home');
    };
    socket.on('ride-ended', onRideEnded);
    return () => socket.off('ride-ended', onRideEnded);
  }, [socket, navigate, toast]);

  return (
    <div className="flex h-screen flex-col bg-ink-950">
      {/* Top bar */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between p-4 sm:p-5">
        <span className="rounded-2xl bg-white/90 px-3 py-1.5 shadow-card backdrop-blur-sm">
          <Logo size={26} />
        </span>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-green-600/90 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
            <i className="ri-radio-button-line mr-1 animate-pulse" /> Ride in progress
          </span>
          <Link
            to="/home"
            aria-label="Back home"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow-card backdrop-blur-sm transition hover:bg-white"
          >
            <i className="ri-home-5-line text-lg" />
          </Link>
        </div>
      </header>

      {/* Map */}
      <div className="relative h-1/2 min-h-[260px]">
        <LiveTracking pickup={ride?.pickup} destination={ride?.destination} showLocationNotice={false} />
      </div>

      {/* Details */}
      <div className="flex-1 overflow-y-auto rounded-t-3xl bg-white p-5 sm:p-6">
        <div className="flex items-center gap-4 rounded-2xl border border-ink-100 bg-ink-50/60 p-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-600 text-lg font-extrabold text-white">
            {captain?.fullname?.firstname?.[0]?.toUpperCase() || 'R'}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold capitalize text-ink-900">
              {captain?.fullname?.firstname} {captain?.fullname?.lastname}
            </p>
            <p className="truncate text-sm text-ink-500">
              {vehicle ? vehicleNames[vehicle.vehicleType] || 'RideX vehicle' : 'RideX captain'} · {vehicle?.plate}
            </p>
          </div>
          <p className="text-2xl font-extrabold text-ink-900">₹{ride?.fare}</p>
        </div>

        <div className="mt-5 divide-y divide-ink-100">
          {[
            { icon: 'ri-map-pin-user-line', title: 'Pickup', value: ride?.pickup || 'Current location' },
            { icon: 'ri-map-pin-2-fill', title: 'Destination', value: ride?.destination },
            { icon: 'ri-wallet-3-line', title: 'Payment method', value: 'Cash on arrival' },
          ].map((row) => (
            <div key={row.title} className="flex items-start gap-3.5 py-3.5">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500">
                <i className={row.icon} />
              </span>
              <div className="min-w-0">
                <p className="text-sm text-ink-500">{row.title}</p>
                <p className="truncate font-semibold text-ink-900">{row.value}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 rounded-xl bg-ink-50 px-4 py-3 text-xs leading-relaxed text-ink-500">
          <i className="ri-information-line mr-1" />
          Your captain is being tracked live. Pay the exact fare shown to your captain in cash when
          you arrive. RideX never charges extra at the destination.
        </p>
      </div>
    </div>
  );
};

export default Riding;
