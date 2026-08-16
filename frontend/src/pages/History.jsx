import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/brand/Logo';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import api, { getErrorMessage } from '../lib/api';

const vehicleNames = { car: 'Premium', auto: 'Comfort', moto: 'Economy' };
const vehicleIcons = { car: 'ri-car-fill', auto: 'ri-taxi-fill', moto: 'ri-motorbike-fill' };

const statusMeta = {
  completed: { label: 'Completed', className: 'border-green-500/30 bg-green-500/10 text-green-600 dark:border-green-500/40 dark:bg-green-500/15 dark:text-green-400' },
  cancelled: { label: 'Cancelled', className: 'border-red-500/30 bg-red-500/10 text-red-500 dark:border-red-500/40 dark:bg-red-500/15 dark:text-red-400' },
  pending: { label: 'Upcoming', className: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-400' },
  accepted: { label: 'Upcoming', className: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-400' },
  ongoing: { label: 'Upcoming', className: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-400' },
};

const filters = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};

const RideCard = ({ ride }) => {
  const meta = statusMeta[ride.status] || statusMeta.pending;
  return (
    <div className="rounded-2xl border border-ui-line bg-ui-card p-4 shadow-card transition hover:shadow-lift sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-ui-line bg-ui-card2 text-xl text-ui-ink">
            <i className={vehicleIcons[ride.vehicleType] || 'ri-taxi-fill'} />
          </span>
          <div>
            <p className="text-sm font-bold capitalize text-ui-ink">
              {vehicleNames[ride.vehicleType] || 'Ride'} · ₹{ride.fare}
            </p>
            <p className="text-xs text-ui-faint">{formatDate(ride.createdAt)}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${meta.className}`}>
            {meta.label}
          </span>
          {ride.status === 'completed' && (
            <span
              className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                ride.paymentStatus === 'received'
                  ? 'border-green-500/30 bg-green-500/10 text-green-600 dark:border-green-500/40 dark:bg-green-500/15 dark:text-green-400'
                  : 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-400'
              }`}
            >
              {ride.paymentStatus === 'received' ? 'Paid ✓' : 'Payment pending'}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        <div className="flex items-center gap-3">
          <i className="ri-map-pin-user-line text-ui-faint" />
          <p className="min-w-0 flex-1 truncate text-sm text-ui-muted">{ride.pickup}</p>
        </div>
        <div className="flex items-center gap-3">
          <i className="ri-map-pin-2-fill text-ui-faint" />
          <p className="min-w-0 flex-1 truncate text-sm text-ui-muted">{ride.destination}</p>
        </div>
      </div>
    </div>
  );
};

const History = () => {
  const [rides, setRides] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [query, setQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;
    api
      .get('/rides/history')
      .then((res) => {
        if (!cancelled) setRides(res.data);
      })
      .catch((err) => {
        if (!cancelled) {
          toast(getErrorMessage(err, 'Could not load your ride history.'), 'error');
          setRides([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [toast]);

  const filtered = useMemo(() => {
    if (!rides) return [];
    let list = rides;
    if (activeFilter === 'upcoming') list = list.filter((r) => ['pending', 'accepted', 'ongoing'].includes(r.status));
    else if (activeFilter !== 'all') list = list.filter((r) => r.status === activeFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (r) => r.pickup?.toLowerCase().includes(q) || r.destination?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [rides, activeFilter, query]);

  return (
    <div className="min-h-screen bg-ui-canvas">
      <header className="sticky top-0 z-30 border-b border-ui-line bg-ui-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link to="/" aria-label="RideX home">
            <Logo size={28} />
          </Link>
          <nav className="flex items-center gap-1 text-sm font-semibold" aria-label="Account">
            <Link to="/home" className="rounded-lg border border-transparent px-3 py-2 text-ui-muted transition hover:bg-ui-card2">
              Book a ride
            </Link>
            <Link to="/profile" className="rounded-lg border border-transparent px-3 py-2 text-ui-muted transition hover:bg-ui-card2">
              Profile
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-ui-ink">Ride history</h1>
        <p className="mt-1 text-sm text-ui-muted">Every trip you have taken with RideX, in one place.</p>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter rides">
            {filters.map((f) => (
              <button
                key={f.key}
                role="tab"
                aria-selected={activeFilter === f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  activeFilter === f.key
                    ? 'border-ui-line bg-ui-accent text-ui-onaccent shadow-sm'
                    : 'border-ui-line bg-ui-card text-ui-muted hover:bg-ui-card2'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ui-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pickup or destination"
              aria-label="Search rides"
              className="w-full rounded-xl border border-ui-line bg-ui-card py-2.5 pl-9 pr-3 text-sm text-ui-ink placeholder:text-ui-faint focus:border-ui-ink focus:outline-none focus:ring-2 focus:ring-ui-ink/10 sm:w-72"
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {rides === null &&
            [0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-36 w-full rounded-2xl" />
            ))}

          {rides !== null && filtered.length === 0 && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ui-line bg-ui-card px-6 py-14 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-ui-line bg-ui-card2 text-2xl text-ui-faint">
                <i className="ri-roadster-line" />
              </span>
              <h2 className="text-lg font-bold text-ui-ink">No rides here yet</h2>
              <p className="max-w-sm text-sm text-ui-muted">
                {query || activeFilter !== 'all'
                  ? 'Try a different filter or search term.'
                  : 'When you book a ride it will show up in this list.'}
              </p>
              <Link
                to="/home"
                className="mt-2 rounded-xl bg-ui-accent px-5 py-2.5 text-sm font-semibold text-ui-onaccent transition hover:opacity-90"
              >
                Book your first ride
              </Link>
            </div>
          )}

          {filtered.map((ride) => (
            <RideCard key={ride._id} ride={ride} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default History;
