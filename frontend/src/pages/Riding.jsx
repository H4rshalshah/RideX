import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';
import Logo from '../components/brand/Logo';
import ThemeToggle from '../components/ui/ThemeToggle';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { SocketContext } from '../context/SocketContext';

const vehicleNames = { car: 'RideX Car', auto: 'RideX Auto', moto: 'RideX Moto' };

/**
 * Full-screen live ride-tracking screen. The real map is the primary visual;
 * a compact driver card floats at the bottom with captain/vehicle/fare/status
 * details. The captain's car moves on the map from real socket location
 * updates (backend broadcasts `ride-location-update`).
 */
const Riding = () => {
  const location = useLocation();
  const { ride, distanceText, durationText } = location.state || {};
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { toast } = useToast();
  const [driverPosition, setDriverPosition] = useState(null);

  const captain = ride?.captain;
  const vehicle = captain?.vehicle;

  // Seed the driver marker at the captain's last known location if provided
  useEffect(() => {
    const loc = captain?.location;
    if (loc?.coordinates?.length === 2 && (loc.coordinates[0] || loc.coordinates[1])) {
      setDriverPosition({ lat: loc.coordinates[1], lng: loc.coordinates[0] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for live captain location + ride lifecycle events
  useEffect(() => {
    if (!socket) return undefined;
    const onLocationUpdate = (data) => {
      if (data?.rideId === ride?._id && data.location) {
        setDriverPosition({ lat: data.location.ltd, lng: data.location.lng });
      }
    };
    const onRideEnded = (data) => {
      // The captain confirms the payment when finishing the ride — thank the
      // rider or remind them to pay so both sides stay clear.
      if (data?.paymentStatus === 'received') {
        toast('Ride completed — payment received. Thanks for riding with RideX!', 'success');
      } else {
        toast(`Ride completed — payment of ₹${data?.fare} not done yet. Please pay your captain.`, 'info');
      }
      navigate('/home');
    };
    socket.on('ride-location-update', onLocationUpdate);
    socket.on('ride-ended', onRideEnded);
    return () => {
      socket.off('ride-location-update', onLocationUpdate);
      socket.off('ride-ended', onRideEnded);
    };
  }, [socket, ride?._id, navigate, toast]);

  return (
    <div className="relative h-screen overflow-hidden bg-ui-canvas">
      {/* Full-screen real map */}
      <div className="absolute inset-0 z-0">
        <LiveTracking
          pickup={ride?.pickup}
          destination={ride?.destination}
          showLocationNotice={false}
          driverPosition={driverPosition}
        />
      </div>

      {/* Top bar — same container as the landing navbar so the logo stays put */}
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" aria-label="RideX home" className="transition hover:opacity-80">
            <Logo size={30} />
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-xs font-bold text-green-600 backdrop-blur-sm dark:text-green-400">
              <i className="ri-radio-button-line animate-pulse" /> Ride in progress
            </span>
            <ThemeToggle className="h-10 w-10 border-ui-line bg-ui-canvas/90" />
            <Link
              to="/home"
              aria-label="Back home"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ui-line bg-ui-canvas/90 text-ui-ink shadow-card backdrop-blur-sm transition hover:bg-ui-card"
            >
              <i className="ri-home-5-line text-lg" />
            </Link>
          </div>
        </div>
      </header>

      {/* Compact driver card */}
      <div className="absolute inset-x-0 bottom-0 z-20 lg:inset-x-auto lg:bottom-6 lg:left-6 lg:w-[400px]">
        <div className="max-h-[55vh] overflow-y-auto rounded-t-3xl border-t border-ui-line bg-ui-card/95 p-4 shadow-lift backdrop-blur-md lg:rounded-3xl lg:border">
          {/* Status stepper */}
          <div className="flex items-center justify-between text-[11px] font-bold">
            {[
              { label: 'Captain assigned', done: true },
              { label: 'On the way', done: true },
              { label: 'In progress', active: true },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${
                      step.done
                        ? 'bg-green-500 text-white'
                        : step.active
                          ? 'bg-ui-accent text-ui-onaccent'
                          : 'border border-ui-line bg-ui-card text-ui-faint'
                    }`}
                  >
                    {step.done ? <i className="ri-check-line" /> : i + 1}
                  </span>
                  <span className={step.done || step.active ? 'text-ui-ink' : 'text-ui-faint'}>
                    {step.label}
                  </span>
                </div>
                {i < arr.length - 1 && <span className="mx-1 mb-4 h-px flex-1 bg-ui-line" />}
              </div>
            ))}
          </div>

          {/* Captain + vehicle */}
          <div className="mt-4 flex items-center gap-3.5 rounded-2xl border border-ui-line bg-ui-card2/60 p-3.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ui-accent text-lg font-extrabold text-ui-onaccent">
              {captain?.fullname?.firstname?.[0]?.toUpperCase() || 'R'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold capitalize text-ui-ink">
                {captain?.fullname?.firstname} {captain?.fullname?.lastname}
              </p>
              <p className="truncate text-sm text-ui-muted">
                {vehicle ? vehicleNames[vehicle.vehicleType] || 'RideX vehicle' : 'RideX captain'} ·{' '}
                {vehicle?.plate}
                {vehicle?.color ? ` · ${vehicle.color}` : ''}
              </p>
              {captain?.phone && (
                <a
                  href={`tel:${captain.phone}`}
                  className="mt-0.5 inline-flex items-center gap-1.5 text-xs font-semibold text-ui-ink/80 transition hover:text-ui-ink"
                >
                  <i className="ri-phone-line text-ui-faint" /> {captain.phone}
                </a>
              )}
            </div>
            <p className="shrink-0 text-xl font-extrabold text-ui-ink">₹{ride?.fare}</p>
          </div>

          {/* Trip summary */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-ui-line bg-ui-card2/40 px-3 py-2.5">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-ui-faint">
                <i className="ri-time-line" /> ETA
              </p>
              <p className="mt-0.5 truncate text-sm font-bold text-ui-ink">
                {durationText || (ride?.duration ? `${Math.round(ride.duration / 60)} min` : '—')}
              </p>
            </div>
            <div className="rounded-xl border border-ui-line bg-ui-card2/40 px-3 py-2.5">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-ui-faint">
                <i className="ri-route-line" /> Distance
              </p>
              <p className="mt-0.5 truncate text-sm font-bold text-ui-ink">
                {distanceText || (ride?.distance ? `${(ride.distance / 1000).toFixed(1)} km` : '—')}
              </p>
            </div>
          </div>

          {/* Route + payment */}
          <div className="mt-2 divide-y divide-ui-line rounded-2xl border border-ui-line px-3.5">
            <div className="flex items-center gap-3 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ui-line bg-ui-card text-ui-muted">
                <i className="ri-map-pin-user-line" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-ui-muted">Pickup</p>
                <p className="truncate text-sm font-semibold text-ui-ink">{ride?.pickup || 'Current location'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ui-line bg-ui-card text-ui-muted">
                <i className="ri-map-pin-2-fill" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-ui-muted">Destination</p>
                <p className="truncate text-sm font-semibold text-ui-ink">{ride?.destination}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ui-line bg-ui-card text-ui-muted">
                <i className="ri-wallet-3-line" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-ui-muted">Payment method</p>
                <p className="truncate text-sm font-semibold text-ui-ink">Cash on arrival</p>
              </div>
            </div>
          </div>

          <p className="mt-3 rounded-xl border border-ui-line bg-ui-card2/40 px-3.5 py-2.5 text-xs leading-relaxed text-ui-muted">
            <i className="ri-radar-line mr-1" />
            Your captain is being tracked live. Share OTP <b className="font-mono text-ui-ink">{ride?.otp}</b> to
            start the ride.
          </p>

          <Link to="/home" className="mt-3 block">
            <Button variant="secondary" size="lg" className="w-full">
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Riding;
