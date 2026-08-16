import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import { useToast } from './ui/Toast';

/**
 * Compact "Where to?" card for the landing hero. Collects pickup and
 * destination, then continues the real booking flow on /home (auth-protected).
 * Suggestions, fares and geocoding all happen there against the live backend.
 */
const HeroSearchCard = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const submit = (e) => {
    e.preventDefault();
    if (!pickup.trim() || !destination.trim()) {
      toast('Enter both a pickup location and a destination.', 'error');
      return;
    }
    const state = { pickup: pickup.trim(), destination: destination.trim() };
    if (localStorage.getItem('token')) {
      // Logged in — go straight to the booking screen with the trip prefilled.
      navigate('/home', { state });
    } else {
      // Logged out — send them to log in first; the login page carries the trip
      // over to /home after a successful sign-in.
      navigate('/login', { state: { ...state, redirectTo: '/home' } });
    }
  };

  return (
    <div className="mx-auto w-full max-w-[400px] rounded-2xl border border-ui-line bg-ui-card/90 p-4 shadow-lift backdrop-blur-md">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-extrabold text-ui-ink">Book a ride</h2>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-ui-line bg-ui-card px-2.5 py-1 text-[11px] font-bold text-ui-muted">
          <i className="ri-flashlight-fill text-ui-ink" /> Instant
        </span>
      </div>
      <p className="mt-0.5 text-xs text-ui-faint">Set your pickup and destination to get fares instantly.</p>

      <form onSubmit={submit} className="mt-4 space-y-2.5">
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-green-500">
            <i className="ri-map-pin-2-fill text-base" />
          </span>
          <input
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="Pickup location"
            aria-label="Pickup location"
            className="w-full rounded-xl border border-ui-line bg-ui-card2 py-3 pl-10 pr-3 text-sm font-medium text-ui-ink placeholder:text-ui-faint transition focus:border-ui-ink focus:bg-ui-card focus:outline-none focus:ring-2 focus:ring-ui-ink/10"
          />
        </div>
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-amber-500">
            <i className="ri-map-pin-2-fill text-base" />
          </span>
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter your destination"
            aria-label="Destination"
            className="w-full rounded-xl border border-ui-line bg-ui-card2 py-3 pl-10 pr-3 text-sm font-medium text-ui-ink placeholder:text-ui-faint transition focus:border-ui-ink focus:bg-ui-card focus:outline-none focus:ring-2 focus:ring-ui-ink/10"
          />
        </div>
        <Button type="submit" size="lg" className="w-full">
          <i className="ri-taxi-line" /> Find rides
        </Button>
      </form>
    </div>
  );
};

export default HeroSearchCard;
