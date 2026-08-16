import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import Logo from '../components/brand/Logo';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useToast } from '../components/ui/Toast';
import { SocketContext } from '../context/SocketContext';
import { UserDataContext } from '../context/UserContext';
import api, { getErrorMessage } from '../lib/api';

const Steps = {
  FORM: 'form',
  VEHICLES: 'vehicles',
  CONFIRM: 'confirm',
  LOOKING: 'looking',
  WAITING: 'waiting',
};

const RECENTS_KEY = 'ridex-recents';
const readRecents = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENTS_KEY)) || [];
  } catch {
    return [];
  }
};
const saveRecents = (list) => {
  try {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(list.slice(0, 5)));
  } catch {
    // storage unavailable — recents just won't persist
  }
};

const Home = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [activeField, setActiveField] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [fare, setFare] = useState({});
  const [distanceText, setDistanceText] = useState('');
  const [durationText, setDurationText] = useState('');
  const [etaMinutes, setEtaMinutes] = useState(null);
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);
  const [step, setStep] = useState(Steps.FORM);
  const [fareLoading, setFareLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [locating, setLocating] = useState(false);
  const [recent, setRecent] = useState(readRecents);
  const [bookingAttempt, setBookingAttempt] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);
  const suggestionTimer = useRef(null);
  const [focusPosition, setFocusPosition] = useState(null);

  // Prefill pickup/destination when arriving from the landing hero search card
  useEffect(() => {
    if (location.state?.pickup) setPickup(location.state.pickup);
    if (location.state?.destination) setDestination(location.state.destination);
    window.history.replaceState({}, document.title);
  }, [location.state]);

  // Register this socket as a rider and listen for ride events
  useEffect(() => {
    if (!socket) return undefined;
    if (user?._id) socket.emit('join', { userType: 'user', userId: user._id });
  }, [socket, user?._id]);

  useEffect(() => {
    if (!socket) return undefined;
    const onRideConfirmed = (rideData) => {
      setRide(rideData);
      setStep(Steps.WAITING);
    };
    const onRideStarted = (rideData) => {
      navigate('/riding', { state: { ride: rideData, distanceText, durationText } });
    };
    socket.on('ride-confirmed', onRideConfirmed);
    socket.on('ride-started', onRideStarted);
    return () => {
      socket.off('ride-confirmed', onRideConfirmed);
      socket.off('ride-started', onRideStarted);
    };
  }, [socket, navigate, distanceText, durationText]);

  useEffect(() => () => clearTimeout(suggestionTimer.current), []);

  const handleLocationChange = useCallback(
    (field, value) => {
      if (field === 'pickup') setPickup(value);
      else setDestination(value);

      clearTimeout(suggestionTimer.current);
      if (value.trim().length < 3) {
        setSuggestions([]);
        setSuggestionsLoading(false);
        return;
      }
      setSuggestionsLoading(true);
      suggestionTimer.current = setTimeout(async () => {
        try {
          const res = await api.get('/maps/get-suggestions', { params: { input: value.trim() } });
          setSuggestions(res.data);
        } catch {
          setSuggestions([]);
        } finally {
          setSuggestionsLoading(false);
        }
      }, 350);
    },
    []
  );

  const addRecent = (value) => {
    setRecent((prev) => {
      const next = [ value, ...prev.filter((r) => r !== value) ].slice(0, 5);
      saveRecents(next);
      return next;
    });
  };

  const handleSuggestionSelect = (suggestion) => {
    if (activeField === 'pickup') setPickup(suggestion);
    else setDestination(suggestion);
    addRecent(suggestion);
    setSuggestions([]);
    setActiveField(null);
  };

  const clearRecents = () => {
    setRecent([]);
    saveRecents([]);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast('Location is not supported by this browser.', 'error');
      return;
    }
    setLocating(true);

    const coords = { lat: null, lng: null };
    const finish = () => setLocating(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        coords.lat = position.coords.latitude;
        coords.lng = position.coords.longitude;
        setFocusPosition({ lat: coords.lat, lng: coords.lng });

        try {
          const res = await api.get('/maps/reverse-geocode', {
            params: { ltd: coords.lat, lng: coords.lng },
          });
          setPickup(res.data.address || 'Current location');
        } catch {
          // Reverse geocoding failed — still centre the map and let the user type
          setPickup('Current location');
          toast('Could not resolve your address — you can type it manually.', 'info');
        } finally {
          finish();
        }
      },
      (err) => {
        finish();
        const code = err?.code;
        if (code === 1) {
          toast('Location permission was denied. Enter your pickup location manually.', 'error');
        } else if (code === 2) {
          toast('Location is unavailable right now. Enter your pickup location manually.', 'error');
        } else if (code === 3) {
          toast('Timed out getting your location. Try again.', 'error');
        } else {
          toast('Could not get your location. Enter your pickup location manually.', 'error');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const findRides = async () => {
    if (!pickup.trim() || !destination.trim()) {
      toast('Enter both a pickup location and a destination.', 'error');
      return;
    }
    setFareLoading(true);
    setStep(Steps.VEHICLES);
    try {
      const [fareRes, routeRes] = await Promise.all([
        api.get('/rides/get-fare', { params: { pickup, destination } }),
        api.get('/maps/get-distance-time', { params: { origin: pickup, destination } }),
      ]);
      setFare(fareRes.data);
      setDistanceText(routeRes.data.distance?.text || '');
      setDurationText(routeRes.data.duration?.text || '');
      const seconds = routeRes.data.duration?.value;
      setEtaMinutes(seconds ? Math.max(1, Math.round(seconds / 60)) : null);
    } catch (err) {
      setStep(Steps.FORM);
      toast(getErrorMessage(err, 'Could not calculate fares for this route.'), 'error');
    } finally {
      setFareLoading(false);
    }
  };

  const confirmRide = async () => {
    setConfirming(true);
    try {
      const res = await api.post('/rides/create', { pickup, destination, vehicleType });
      setRide(res.data);
      setStep(Steps.LOOKING);
    } catch (err) {
      toast(getErrorMessage(err, 'Could not book this ride right now.'), 'error');
    } finally {
      setConfirming(false);
    }
  };

  const cancelRequest = async () => {
    if (ride?._id) {
      try {
        await api.post('/rides/cancel', { rideId: ride._id });
      } catch {
        // the ride may already be gone — proceed regardless
      }
    }
    setRide(null);
    setStep(Steps.FORM);
  };

  // Retry a booking that found no captain: cancel the stale request and send
  // a fresh one out to captains in the area (same route, same ride type).
  const retryBooking = async () => {
    if (ride?._id) {
      try {
        await api.post('/rides/cancel', { rideId: ride._id });
      } catch {
        // the ride may already be gone — proceed regardless
      }
    }
    setRide(null);
    setBookingAttempt((n) => n + 1);
    setConfirming(true);
    try {
      const res = await api.post('/rides/create', { pickup, destination, vehicleType });
      setRide(res.data);
      setStep(Steps.LOOKING);
    } catch (err) {
      toast(getErrorMessage(err, 'Could not book this ride right now.'), 'error');
      setStep(Steps.FORM);
    } finally {
      setConfirming(false);
    }
  };

  const resetTrip = () => {
    setPickup('');
    setDestination('');
    setFare({});
    setRide(null);
    setVehicleType(null);
    setStep(Steps.FORM);
  };

  const initials = (user?.fullname?.firstname?.[0] || 'R').toUpperCase();

  const renderPanel = () => {
    if (step === Steps.VEHICLES && fareLoading) {
      return (
        <div aria-live="polite">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
          <div className="mt-5 space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
          <p className="mt-4 text-center text-sm font-medium text-ui-faint">
            <i className="ri-loader-4-line mr-1.5 animate-spin" />
            Calculating fares…
          </p>
        </div>
      );
    }

    if (step === Steps.VEHICLES) {
      return (
        <VehiclePanel
          fare={fare}
          etaMinutes={etaMinutes}
          onSelect={(type) => {
            setVehicleType(type);
            setStep(Steps.CONFIRM);
          }}
          onClose={() => setStep(Steps.FORM)}
        />
      );
    }

    if (step === Steps.CONFIRM) {
      return (
        <ConfirmRide
          rideType={vehicleType}
          pickup={pickup}
          destination={destination}
          fare={fare}
          distanceText={distanceText}
          durationText={durationText}
          loading={confirming}
          onConfirm={confirmRide}
          onClose={() => setStep(Steps.VEHICLES)}
        />
      );
    }

    if (step === Steps.LOOKING) {
      return (
        <LookingForDriver
          key={bookingAttempt}
          rideType={vehicleType}
          pickup={pickup}
          destination={destination}
          fare={fare}
          onCancel={cancelRequest}
          onRetry={retryBooking}
        />
      );
    }

    if (step === Steps.WAITING) {
      return <WaitingForDriver ride={ride} onCancel={cancelRequest} />;
    }

    // FORM
    return (
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-ui-ink">Where to?</h2>
          {(pickup || destination) && (
            <button
              onClick={resetTrip}
              className="text-xs font-semibold text-ui-faint transition hover:text-ui-ink"
            >
              Clear trip
            </button>
          )}
        </div>

        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            findRides();
          }}
        >
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-ui-faint">
              <i className="ri-map-pin-user-line" />
            </span>
            <input
              value={pickup}
              onChange={(e) => handleLocationChange('pickup', e.target.value)}
              onFocus={() => setActiveField('pickup')}
              placeholder="Pickup location"
              aria-label="Pickup location"
              className="w-full rounded-2xl border border-ui-line bg-ui-card2 py-2.5 pl-10 pr-3 text-sm font-medium text-ui-ink placeholder:text-ui-faint transition focus:border-ui-ink focus:bg-ui-card focus:outline-none focus:ring-2 focus:ring-ui-ink/10"
            />
            <button
              type="button"
              onClick={useCurrentLocation}
              disabled={locating}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-ui-line bg-ui-card px-2.5 py-1.5 text-xs font-bold text-ui-ink transition hover:bg-ui-card2 disabled:opacity-60"
            >
              {locating ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-crosshair-2-line mr-1" />}
              {locating ? 'Locating…' : 'Current location'}
            </button>
          </div>

          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-ui-faint">
              <i className="ri-map-pin-2-line" />
            </span>
            <input
              value={destination}
              onChange={(e) => handleLocationChange('destination', e.target.value)}
              onFocus={() => setActiveField('destination')}
              placeholder="Enter your destination"
              aria-label="Destination"
              className="w-full rounded-2xl border border-ui-line bg-ui-card2 py-2.5 pl-10 pr-3 text-sm font-medium text-ui-ink placeholder:text-ui-faint transition focus:border-ui-ink focus:bg-ui-card focus:outline-none focus:ring-2 focus:ring-ui-ink/10"
            />
          </div>

          {activeField && (
            <div className="rounded-2xl border border-ui-line bg-ui-card p-2 shadow-card">
              <LocationSearchPanel
                suggestions={suggestions}
                loading={suggestionsLoading}
                onSelect={handleSuggestionSelect}
                onSelectRecent={handleSuggestionSelect}
                recent={recent}
                onClearRecent={clearRecents}
                emptyText={
                  suggestionsLoading
                    ? ''
                    : 'Keep typing — suggestions appear after 3 characters.'
                }
              />
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={fareLoading}>
            <i className="ri-taxi-line" /> Find rides
          </Button>
        </form>
      </div>
    );
  };

  return (
    <div className="relative h-screen overflow-hidden bg-ui-canvas">
      <div className="absolute inset-0 z-0">
        <LiveTracking
          pickup={pickup}
          destination={destination}
          focusPosition={focusPosition}
          mapClassName="ridex-map-has-right-panel"
        />
      </div>

      {/* Top bar */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between p-4 sm:p-5">
        <Link to="/" aria-label="RideX home" className="rounded-xl p-1 transition hover:opacity-80">
          <Logo size={26} />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle className="h-10 w-10 border-ui-line bg-ui-canvas/90" />
          <Link
            to="/history"
            aria-label="Ride history"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ui-line bg-ui-canvas/90 text-ui-ink shadow-card backdrop-blur-sm transition hover:bg-ui-card"
          >
            <i className="ri-history-line text-lg" />
          </Link>
          <Link
            to="/profile"
            aria-label="Profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-ui-accent text-sm font-extrabold text-ui-onaccent shadow-card transition hover:opacity-90"
          >
            {initials}
          </Link>
        </div>
      </header>

      {/* Booking panel */}
      <div className="absolute inset-x-0 bottom-0 z-20 lg:inset-x-auto lg:bottom-6 lg:right-6 lg:w-[400px]">
        <div className="max-h-[68vh] overflow-y-auto rounded-t-3xl border-t border-ui-line bg-ui-card p-4 shadow-lift lg:max-h-[80vh] lg:rounded-3xl lg:border lg:border-ui-line">
          {renderPanel()}
        </div>
      </div>
    </div>
  );
};

export default Home;
