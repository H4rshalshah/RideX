import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/brand/Logo';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import { UserDataContext } from '../context/UserContext';
import api, { getErrorMessage } from '../lib/api';

const Profile = () => {
  const { user, setUser } = useContext(UserDataContext);
  const [stats, setStats] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;
    api
      .get('/rides/history')
      .then((res) => {
        if (cancelled) return;
        const rides = res.data;
        const completed = rides.filter((r) => r.status === 'completed');
        setStats({
          total: rides.length,
          completed: completed.length,
          spent: completed.reduce((sum, r) => sum + (r.fare || 0), 0),
        });
      })
      .catch((err) => {
        if (!cancelled) toast(getErrorMessage(err, 'Could not load your ride stats.'), 'error');
      });
    return () => {
      cancelled = true;
    };
  }, [toast]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await api.get('/users/logout');
    } catch {
      // clear local state regardless
    }
    localStorage.removeItem('token');
    setUser({ email: '', fullName: { firstName: '', lastName: '' } });
    navigate('/');
  };

  const name = `${user?.fullname?.firstname || ''} ${user?.fullname?.lastname || ''}`.trim() || 'Rider';
  const initials = (user?.fullname?.firstname?.[0] || 'R').toUpperCase();

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
            <Link to="/history" className="rounded-lg px-3 py-2 text-ink-600 transition hover:bg-ink-100">
              Ride history
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-2xl font-extrabold text-white shadow-card">
            {initials}
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-extrabold tracking-tight text-ink-900">{name}</h1>
            <p className="truncate text-sm text-ink-500">{user?.email}</p>
          </div>
        </div>

        {/* Stats */}
        <section aria-label="Ride statistics" className="mt-8 grid grid-cols-3 gap-4">
          {stats === null
            ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
            : [
                { label: 'Total rides', value: stats.total, icon: 'ri-roadster-line' },
                { label: 'Completed', value: stats.completed, icon: 'ri-check-double-line' },
                { label: 'Total spent', value: `₹${stats.spent}`, icon: 'ri-wallet-3-line' },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-ink-100 bg-white p-4 shadow-card">
                  <i className={`${s.icon} text-xl text-brand-600`} />
                  <p className="mt-2 text-2xl font-extrabold text-ink-900">{s.value}</p>
                  <p className="text-xs font-medium text-ink-400">{s.label}</p>
                </div>
              ))}
        </section>

        {/* Account */}
        <section aria-label="Account details" className="mt-8 rounded-2xl border border-ink-100 bg-white shadow-card">
          <h2 className="border-b border-ink-100 px-5 py-4 text-sm font-bold uppercase tracking-wide text-ink-400">
            Account
          </h2>
          <div className="divide-y divide-ink-100 px-5">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <i className="ri-mail-line text-ink-400" />
                <div>
                  <p className="text-sm font-semibold text-ink-900">Email</p>
                  <p className="text-xs text-ink-400">Used to log in to RideX</p>
                </div>
              </div>
              <p className="max-w-[55%] truncate text-sm text-ink-600">{user?.email}</p>
            </div>
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <i className="ri-wallet-3-line text-ink-400" />
                <div>
                  <p className="text-sm font-semibold text-ink-900">Payment</p>
                  <p className="text-xs text-ink-400">Default method for your rides</p>
                </div>
              </div>
              <p className="text-sm text-ink-600">Cash on arrival</p>
            </div>
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <i className="ri-shield-check-line text-ink-400" />
                <div>
                  <p className="text-sm font-semibold text-ink-900">Security</p>
                  <p className="text-xs text-ink-400">OTP-verified ride starts</p>
                </div>
              </div>
              <p className="text-sm text-ink-600">Enabled</p>
            </div>
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/home" className="flex-1">
            <Button size="lg" className="w-full">
              <i className="ri-taxi-line" /> Book a ride
            </Button>
          </Link>
          <Button variant="danger" size="lg" className="flex-1" loading={loggingOut} onClick={handleLogout}>
            <i className="ri-logout-box-r-line" /> Log out
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Profile;
