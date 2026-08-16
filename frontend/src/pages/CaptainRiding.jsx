import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FinishRide from '../components/FinishRide';
import LiveTracking from '../components/LiveTracking';
import Logo from '../components/brand/Logo';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useToast } from '../components/ui/Toast';
import { SocketContext } from '../context/SocketContext';
import { CaptainDataContext } from '../context/CapatainContext';

const CaptainRiding = () => {
  const [showFinish, setShowFinish] = useState(false);
  const location = useLocation();
  const ride = location.state?.ride;
  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);
  const { toast } = useToast();
  const locationTimer = useRef(null);

  // Stream the captain's live location to the rider while the ride is active
  useEffect(() => {
    if (!socket || !captain?._id) return undefined;
    const update = () => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          socket.emit('update-location-captain', {
            userId: captain._id,
            location: { ltd: position.coords.latitude, lng: position.coords.longitude },
          });
        },
        () => {
          toast('Could not access your location while riding.', 'error');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };
    update();
    locationTimer.current = setInterval(update, 8000);
    return () => clearInterval(locationTimer.current);
  }, [socket, captain?._id, toast]);

  return (
    <div className="relative h-screen overflow-hidden bg-ui-canvas">
      <div className="absolute inset-0 z-0">
        <LiveTracking pickup={ride?.pickup} destination={ride?.destination} showLocationNotice={false} />
      </div>

      {/* Top bar */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between p-4 sm:p-5">
        <Link to="/" aria-label="RideX home" className="rounded-xl p-1 transition hover:opacity-80">
          <Logo size={26} />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle className="h-10 w-10 border-ui-line bg-ui-canvas/90" />
          <Link
            to="/captain-home"
            aria-label="Back to dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ui-line bg-ui-canvas/90 text-ui-ink shadow-card backdrop-blur-sm transition hover:bg-ui-card"
          >
            <i className="ri-dashboard-3-line text-lg" />
          </Link>
        </div>
      </header>

      {/* Ride status bar */}
      <div className="absolute inset-x-4 bottom-0 z-20 rounded-t-3xl border border-ui-line bg-ui-card p-4 shadow-lift sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[400px] sm:rounded-3xl">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-bold text-green-600">
              <i className="ri-radio-button-line animate-pulse" /> Ride in progress
            </p>
            <h4 className="mt-1 truncate text-lg font-extrabold capitalize text-ui-ink">
              {ride?.user?.fullname?.firstname} {ride?.user?.fullname?.lastname}
            </h4>
            <p className="truncate text-sm text-ui-muted">→ {ride?.destination}</p>
            {ride?.user?.phone && (
              <a
                href={`tel:${ride.user.phone}`}
                className="mt-0.5 inline-flex items-center gap-1.5 text-xs font-semibold text-ui-ink/80 transition hover:text-ui-ink"
              >
                <i className="ri-phone-line text-ui-faint" /> {ride.user.phone}
              </a>
            )}
          </div>
          <p className="shrink-0 text-2xl font-extrabold text-ui-ink">₹{ride?.fare}</p>
        </div>
        <button
          onClick={() => setShowFinish(true)}
          className="mt-4 w-full rounded-2xl bg-green-600 py-3.5 text-base font-bold text-white transition hover:bg-green-700"
        >
          <i className="ri-flag-2-line mr-1.5" /> Complete ride
        </button>
      </div>

      {/* Finish ride sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 lg:inset-x-auto lg:bottom-6 lg:right-6 lg:w-[420px] ${
          showFinish ? 'translate-y-0' : 'translate-y-full'
        }`}
        aria-hidden={!showFinish}
      >
        <div className="max-h-[80vh] overflow-y-auto rounded-t-3xl border border-ui-line bg-ui-card p-4 shadow-lift lg:rounded-3xl">
          {ride && <FinishRide ride={ride} onClose={() => setShowFinish(false)} />}
        </div>
      </div>
    </div>
  );
};

export default CaptainRiding;
