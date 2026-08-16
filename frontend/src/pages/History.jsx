import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/brand/Logo';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import api, { getErrorMessage } from '../lib/api';

const vehicleNames = { car: 'Premium', auto: 'Comfort', moto: 'Economy' };
const vehicleIcons = { car: 'ri-car-fill', auto: 'ri-taxi-fill', moto: 'ri-motorbike-fill' };

const statusMeta = {
  completed: { label: 'Completed', className: 'bg-green-50 text-green-700 border-green-200' },
  cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-700 border-red-200' },
  pending: { label: 'Upcoming', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  accepted: { label: 'Upcoming', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  ongoing: { label: 'Upcoming', className: 'bg-amber-50 text-amber-700 border-amber-200' },
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
    <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-card transition hover:shadow-lift sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-xl text-brand-600">
            <i className={vehicleIcons[ride.vehicleType] || 'ri-taxi-fill'} />
          </span>
          <div>
            <p className="text-sm font-bold capitalize text-ink-900">
              {vehicleNames[ride.vehicleType] || 'Ride'} · ₹{ride.fare}
            </p>
            <p className="text-xs text-ink-400">{formatDate(ride.createdAt)}</p>
          </div>
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold ${meta.className}`}>
          {meta.label}
        </span>
      </div>

      <div className="mt-4 space-y-2.5">
        <div className="flex items-center gap-3">
          <i className="ri-map-pin-user-line text-ink-400" />
          <p className="min-w-0 flex-1 truncate text-sm text-ink-700">{ride.pickup}</p>
        </div>
        <div className="flex items-center gap-3">
          <i className="ri-map-pin-2-fill text-ink-400" />
          <p className="min-w-0 flex-1 truncate text-sm text-ink-700">{ride.destination}</p>
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
    <div className="min-h-screen bg-ink-50/60">
      <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link to="/" aria-label="RideX home">
            <Logo size={28} />
          </Link>
          <nav className="flex items-center gap-1 text-sm font-semibold" aria-label="Account">
            <Link to="/home" className="rounded-lg px-3 py-2 text-ink-600 transition hover:bg-ink-100">
              Book a ride
            </Link>
            <Link to="/profile" className="rounded-lg px-3 py-2 text-ink-600 transition hover:bg-ink-100">
              Profile
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Ride history</h1>
        <p className="mt-1 text-sm text-ink-500">Every trip you have taken with RideX, in one place.</p>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter rides">
            {filters.map((f) => (
              <button
                key={f.key}
                role="tab"
                aria-selected={activeFilter === f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeFilter === f.key
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white text-ink-600 hover:bg-ink-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pickup or destination"
              aria-label="Search rides"
              className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 sm:w-72"
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {rides === null &&
            [0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-36 w-full rounded-2xl" />
            ))}

          {rides !== null && filtered.length === 0 && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-14 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-100 text-2xl text-ink-400">
                <i className="ri-roadster-line" />
              </span>
              <h2 className="text-lg font-bold text-ink-900">No rides here yet</h2>
              <p className="max-w-sm text-sm text-ink-500">
                {query || activeFilter !== 'all'
                  ? 'Try a different filter or search term.'
                  : 'When you book a ride it will show up in this list.'}
              </p>
              <Link
                to="/home"
                className="mt-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
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
