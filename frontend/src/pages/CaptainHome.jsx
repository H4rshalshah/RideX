import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CaptainDetails from '../components/CaptainDetails';
import RidePopUp from '../components/RidePopUp';
import ConfirmRidePopUp from '../components/ConfirmRidePopUp';
import LiveTracking from '../components/LiveTracking';
import Logo from '../components/brand/Logo';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useToast } from '../components/ui/Toast';
import { SocketContext } from '../context/SocketContext';
import { CaptainDataContext } from '../context/CapatainContext';
import api, { getErrorMessage } from '../lib/api';

const CaptainHome = () => {
  const [ride, setRide] = useState(null);
  const [showRideRequest, setShowRideRequest] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [stats, setStats] = useState(null);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);
  const { toast } = useToast();
  const locationTimer = useRef(null);

  // Join as captain + listen for new ride requests
  useEffect(() => {
    if (!socket || !captain?._id) return undefined;
    socket.emit('join', { userId: captain._id, userType: 'captain' });

    const onNewRide = (data) => {
      setRide(data);
      setShowRideRequest(true);
    };
    socket.on('new-ride', onNewRide);
    return () => socket.off('new-ride', onNewRide);
  }, [socket, captain?._id]);

  // Stream location to the server while online
  useEffect(() => {
    if (!socket || !isOnline || !captain?._id) return undefined;
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
          toast('Could not access your location. Enable location to receive ride requests.', 'error');
        }
      );
    };
    update();
    locationTimer.current = setInterval(update, 10000);
    return () => clearInterval(locationTimer.current);
  }, [socket, isOnline, captain?._id, toast]);

  // Default online state from the captain's account
  useEffect(() => {
    setIsOnline(captain?.status === 'active');
  }, [captain?.status]);

  // Load real trip stats
  useEffect(() => {
    let cancelled = false;
    api
      .get('/rides/captain-history')
      .then((res) => {
        if (cancelled) return;
        const rides = res.data;
        const completed = rides.filter((r) => r.status === 'completed');
        setStats({
          total: rides.length,
          completed: completed.length,
          earnings: completed.reduce((sum, r) => sum + (r.fare || 0), 0),
        });
      })
      .catch((err) => {
        if (!cancelled) toast(getErrorMessage(err, 'Could not load your trip stats.'), 'error');
      });
    return () => {
      cancelled = true;
    };
  }, [toast]);

  const toggleOnline = () => {
    if (!captain?._id) return;
    const next = !isOnline;
    setIsOnline(next);
    socket.emit('set-status', { userId: captain._id, status: next ? 'active' : 'inactive' });
    if (next) {
      toast('You are online — ride requests will appear here.', 'success');
    } else {
      toast('You are offline. No ride requests will be sent.', 'info');
    }
  };

  const acceptRide = async () => {
    setAccepting(true);
    try {
      await api.post('/rides/confirm', { rideId: ride._id });
      setShowRideRequest(false);
      setShowConfirm(true);
    } catch (err) {
      toast(getErrorMessage(err, 'Could not accept this ride.'), 'error');
    } finally {
      setAccepting(false);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-ui-canvas">
      <div className="absolute inset-0">
        <LiveTracking showLocationNotice={false} />
      </div>

      {/* Top bar */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between p-4 sm:p-5">
        <span className="rounded-2xl border border-ui-line bg-ui-canvas/90 px-3 py-1.5 shadow-card backdrop-blur-sm">
          <Logo size={26} />
        </span>
        <div className="flex items-center gap-2">
          <ThemeToggle className="h-10 w-10 border-ui-line bg-ui-canvas/90" />
          <Link
            to="/captain/logout"
            aria-label="Log out"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ui-line bg-ui-canvas/90 text-ui-ink shadow-card backdrop-blur-sm transition hover:bg-ui-card"
          >
            <i className="ri-logout-box-r-line text-lg" />
          </Link>
        </div>
      </header>

      {/* Status banner */}
      <div className="absolute inset-x-4 top-20 z-20 sm:inset-x-auto sm:left-6">
        <div
          className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold shadow-card backdrop-blur-sm ${
            isOnline ? 'bg-green-600 text-white' : 'bg-ui-accent text-ui-onaccent'
          }`}
        >
          <span className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'animate-pulse bg-white' : 'bg-current opacity-40'}`} />
          {isOnline ? 'Online — looking for rides' : 'Offline'}
        </div>
      </div>

      {/* Bottom panel */}
      <div className="absolute inset-x-0 bottom-0 z-20 lg:inset-x-auto lg:bottom-6 lg:left-6 lg:w-[420px]">
        <div className="max-h-[60vh] overflow-y-auto rounded-t-3xl border-t border-ui-line bg-ui-card p-5 shadow-lift lg:rounded-3xl lg:border">
          <Button
            size="lg"
            variant={isOnline ? 'danger' : 'primary'}
            className="w-full"
            onClick={toggleOnline}
          >
            <i className={isOnline ? 'ri-pause-circle-line' : 'ri-play-circle-line'} />
            {isOnline ? 'Go offline' : 'Go online'}
          </Button>

          <div className="mt-5">
            {stats === null ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-24 w-full rounded-2xl" />
              </div>
            ) : (
              <CaptainDetails stats={stats} />
            )}
          </div>
        </div>
      </div>

      {/* New ride request sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 lg:inset-x-auto lg:bottom-6 lg:right-6 lg:w-[420px] ${
          showRideRequest ? 'translate-y-0' : 'translate-y-full'
        }`}
        aria-hidden={!showRideRequest}
      >
        <div className="max-h-[80vh] overflow-y-auto rounded-t-3xl border-t border-ui-line bg-ui-card p-5 shadow-lift lg:rounded-3xl lg:border">
          {ride && (
            <RidePopUp
              ride={ride}
              accepting={accepting}
              onAccept={acceptRide}
              onIgnore={() => setShowRideRequest(false)}
            />
          )}
        </div>
      </div>

      {/* OTP confirmation overlay */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm lg:items-center">
          <div className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-ui-line bg-ui-card p-5 shadow-lift lg:rounded-3xl">
            {ride && (
              <ConfirmRidePopUp
                ride={ride}
                onClose={() => {
                  setShowConfirm(false);
                  setShowRideRequest(false);
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptainHome;
