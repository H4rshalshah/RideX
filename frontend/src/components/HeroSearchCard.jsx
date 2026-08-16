import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import LocationSearchPanel from './LocationSearchPanel';
import api from '../lib/api';
import { useToast } from './ui/Toast';

/**
 * Compact "Where to?" card for the landing hero. Collects pickup and
 * destination with live place suggestions for both fields, then continues
 * the real booking flow on /home (auth-protected). Suggestions, fares and
 * geocoding all happen against the live backend.
 */
const HeroSearchCard = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [activeField, setActiveField] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const suggestionTimer = useRef(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (field, value) => {
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
        setSuggestions(res.data || []);
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 350);
  };

  const selectSuggestion = (value) => {
    if (activeField === 'pickup') setPickup(value);
    else setDestination(value);
    setSuggestions([]);
    setActiveField(null);
  };

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

  // Show the suggestion list only while there is something useful to show,
  // so the card doesn't flash an empty state while typing.
  const showPanel = activeField && (suggestionsLoading || suggestions.length > 0);
  const panel = (
    <div className="rounded-xl border border-ui-line bg-ui-card p-1.5 shadow-card">
      <LocationSearchPanel
        suggestions={suggestions}
        loading={suggestionsLoading}
        onSelect={selectSuggestion}
        recent={[]}
        onSelectRecent={() => undefined}
        onClearRecent={() => undefined}
        emptyText="No matches found. Try a different search."
      />
    </div>
  );

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
            onChange={(e) => handleChange('pickup', e.target.value)}
            onFocus={() => setActiveField('pickup')}
            placeholder="Pickup location"
            aria-label="Pickup location"
            autoComplete="off"
            className="w-full rounded-xl border border-ui-line bg-ui-card2 py-3 pl-10 pr-3 text-sm font-medium text-ui-ink placeholder:text-ui-faint transition focus:border-ui-ink focus:bg-ui-card focus:outline-none focus:ring-2 focus:ring-ui-ink/10"
          />
        </div>
        {showPanel && activeField === 'pickup' && panel}
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-amber-500">
            <i className="ri-map-pin-2-fill text-base" />
          </span>
          <input
            value={destination}
            onChange={(e) => handleChange('destination', e.target.value)}
            onFocus={() => setActiveField('destination')}
            placeholder="Enter your destination"
            aria-label="Destination"
            autoComplete="off"
            className="w-full rounded-xl border border-ui-line bg-ui-card2 py-3 pl-10 pr-3 text-sm font-medium text-ui-ink placeholder:text-ui-faint transition focus:border-ui-ink focus:bg-ui-card focus:outline-none focus:ring-2 focus:ring-ui-ink/10"
          />
        </div>
        {showPanel && activeField === 'destination' && panel}
        <Button type="submit" size="lg" className="w-full">
          <i className="ri-taxi-line" /> Find rides
        </Button>
      </form>
    </div>
  );
};

export default HeroSearchCard;
