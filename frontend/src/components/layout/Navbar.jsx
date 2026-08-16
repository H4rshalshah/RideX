import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logo from '../brand/Logo';
import Button from '../ui/Button';
import api from '../../lib/api';
import { UserDataContext } from '../../context/UserContext';
import { useContext } from 'react';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Book a Ride', to: '/home' },
  { label: 'Rides', to: '/history' },
  { label: 'About', to: '/#about' },
  { label: 'Contact', to: '/#contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);

  const loggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close the user dropdown on outside click / Escape
  useEffect(() => {
    const onPointerDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await api.get('/users/logout');
    } catch {
      // even if the request fails, clear local state and return to landing
    }
    localStorage.removeItem('token');
    setUser({ email: '', fullName: { firstName: '', lastName: '' } });
    setMenuOpen(false);
    setMobileOpen(false);
    setLoggingOut(false);
    navigate('/');
  };

  const initials = (user?.fullname?.firstname?.[0] || user?.fullName?.firstName?.[0] || 'R').toUpperCase();

  const desktopLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
      isActive && scrolled
        ? 'text-brand-600'
        : isActive
          ? 'text-brand-300'
          : scrolled
            ? 'text-ink-700 hover:bg-ink-100'
            : 'text-white/90 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 shadow-sm backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main">
        <Link to="/" aria-label="RideX home" onClick={() => setMobileOpen(false)}>
          <Logo light={!scrolled} size={30} />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) =>
            l.to.includes('#') ? (
              <Link
                key={l.label}
                to={l.to}
                className={scrolled ? 'text-ink-700 hover:bg-ink-100 rounded-lg px-3 py-2 text-sm font-semibold' : 'text-white/90 hover:bg-white/10 hover:text-white rounded-lg px-3 py-2 text-sm font-semibold'}
              >
                {l.label}
              </Link>
            ) : (
              <NavLink key={l.label} to={l.to} end={l.to === '/'} className={desktopLinkClass}>
                {l.label}
              </NavLink>
            )
          )}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          {loggedIn ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition ${
                  scrolled ? 'bg-brand-600 text-white hover:bg-brand-700' : 'bg-white text-brand-700 hover:bg-brand-50'
                }`}
              >
                {initials}
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-ink-100 bg-white py-1.5 shadow-lift"
                >
                  <div className="border-b border-ink-100 px-4 py-2.5">
                    <p className="truncate text-sm font-semibold text-ink-900">
                      {user?.fullname?.firstname || user?.fullName?.firstName || 'Rider'}
                    </p>
                    <p className="truncate text-xs text-ink-400">{user?.email}</p>
                  </div>
                  <Link to="/home" role="menuitem" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50">
                    <i className="ri-taxi-line" /> Book a ride
                  </Link>
                  <Link to="/history" role="menuitem" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50">
                    <i className="ri-history-line" /> Ride history
                  </Link>
                  <Link to="/profile" role="menuitem" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50">
                    <i className="ri-user-settings-line" /> Profile
                  </Link>
                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    <i className="ri-logout-box-r-line" /> {loggingOut ? 'Signing out…' : 'Sign out'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className={scrolled ? 'text-ink-700 hover:text-brand-600 text-sm font-semibold' : 'text-white hover:text-brand-200 text-sm font-semibold'}>
                Log in
              </Link>
              <Button size="sm" onClick={() => navigate('/signup')}>
                Sign up
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className={`md:hidden flex h-10 w-10 items-center justify-center rounded-lg transition ${
            scrolled ? 'text-ink-800 hover:bg-ink-100' : 'text-white hover:bg-white/10'
          }`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <i className={`${mobileOpen ? 'ri-close-line' : 'ri-menu-line'} text-2xl`} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 top-16 z-40 flex flex-col bg-ink-950 transition-all duration-300 md:hidden ${
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!mobileOpen}
      >
        <nav className="flex flex-1 flex-col gap-1 px-6 pt-6" aria-label="Mobile">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3.5 text-lg font-semibold text-white hover:bg-white/10"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 px-6 py-6">
          {loggedIn ? (
            <Button variant="primary" className="w-full" onClick={() => { setMobileOpen(false); navigate('/home'); }}>
              Book a ride
            </Button>
          ) : (
            <div className="flex flex-col gap-3">
              <Button variant="primary" className="w-full" onClick={() => { setMobileOpen(false); navigate('/login'); }}>
                Log in
              </Button>
              <Button variant="secondary" className="w-full" onClick={() => { setMobileOpen(false); navigate('/signup'); }}>
                Create account
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
