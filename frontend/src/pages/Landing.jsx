import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Reveal from '../components/ui/Reveal';
import Button from '../components/ui/Button';
import NetworkArt from '../components/ui/NetworkArt';
import GridTraffic from '../components/ui/GridTraffic';
import PreviewRoute from '../components/ui/PreviewRoute';
import { useTheme } from '../context/ThemeContext';
// Real-world map pin glyph (same shape as fa-solid fa-location-dot)
const PIN_PATH =
  'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 4.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5z';

const features = [
  {
    icon: 'ri-flashlight-line',
    title: 'Quick Booking',
    text: 'Set a pickup and destination, pick a ride, and confirm in under a minute — no phone calls, no waiting on hold.',
  },
  {
    icon: 'ri-map-pin-user-line',
    title: 'Live Location',
    text: 'Your captain is always visible on the map from the moment the ride is confirmed to the moment you arrive.',
  },
  {
    icon: 'ri-car-line',
    title: 'Multiple Ride Options',
    text: 'Economy, Comfort and Premium rides with upfront fares and estimated arrival times for every option.',
  },
  {
    icon: 'ri-shield-check-line',
    title: 'Secure Payments',
    text: 'Clear, upfront pricing with no surprises at the end of the trip. Pay by cash on arrival, card support coming soon.',
  },
  {
    icon: 'ri-history-line',
    title: 'Ride History',
    text: 'Every trip you take is stored in your profile with fares, routes and statuses so you always know where you have been.',
  },
  {
    icon: 'ri-radar-line',
    title: 'Driver Tracking',
    text: 'Follow your captain in real time with live location updates shared over a secure connection.',
  },
];

const steps = [
  {
    icon: 'ri-map-pin-line',
    title: 'Enter your destination',
    text: 'Tell us where you are and where you need to go. Pickup can be your current location or any address.',
  },
  {
    icon: 'ri-taxi-line',
    title: 'Select your ride',
    text: 'Compare Economy, Comfort and Premium options with live fares and estimated arrival times.',
  },
  {
    icon: 'ri-bank-card-line',
    title: 'Confirm your booking',
    text: 'Review the fare and route, then confirm. A nearby captain accepts your ride instantly.',
  },
  {
    icon: 'ri-roadster-line',
    title: 'Enjoy your ride',
    text: 'Track your captain live, share the trip, and pay when you reach your destination.',
  },
];

const HeroVisual = () => (
  <div className="relative mx-auto w-full max-w-sm">
    <div className="relative overflow-hidden rounded-3xl border border-ui-line bg-ui-card shadow-lift">
      {/* Live route preview with stop-and-go car animation */}
      <div aria-hidden="true" className="relative h-44 overflow-hidden bg-ui-card2">
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgb(var(--color-line))_1px,transparent_1px),linear-gradient(90deg,rgb(var(--color-line))_1px,transparent_1px)] [background-size:32px_32px]" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 224" fill="none" preserveAspectRatio="none">
          {/* Pickup + destination pins */}
          <g transform="translate(40 180)">
            <path d={PIN_PATH} fill="#10b981" stroke="rgb(var(--color-card))" strokeWidth="2.5" />
          </g>
          <g transform="translate(330 55)">
            <path d={PIN_PATH} fill="#f59e0b" stroke="rgb(var(--color-card))" strokeWidth="2.5" />
          </g>
          <PreviewRoute />
        </svg>
        <span className="absolute bottom-2.5 left-2.5 rounded-lg border border-ui-line bg-ui-card px-2 py-0.5 text-[11px] font-semibold text-ui-muted">
          <i className="ri-navigation-fill mr-1 text-ui-ink" /> Live tracking
        </span>
      </div>

      {/* Compact trip card */}
      <div className="space-y-2.5 p-3">
        <div className="flex items-center gap-2.5 rounded-xl border border-ui-line bg-ui-card2 p-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ui-line bg-ui-card text-ui-ink">
            <i className="ri-map-pin-fill text-base" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ui-faint">Pickup</p>
            <p className="truncate text-sm font-medium text-ui-ink">Current location</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl border border-ui-line bg-ui-card2 p-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ui-line bg-ui-card text-ui-ink">
            <i className="ri-map-pin-fill text-base" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ui-faint">Destination</p>
            <p className="truncate text-sm font-medium text-ui-ink">Central Station</p>
          </div>
        </div>

        <div className="space-y-0.5 border-t border-ui-line pt-1.5">
          {[
            { name: 'Economy', eta: '2 min', price: '₹49' },
            { name: 'Comfort', eta: '4 min', price: '₹89' },
            { name: 'Premium', eta: '6 min', price: '₹129' },
          ].map((ride) => (
            <div key={ride.name} className="flex items-center justify-between rounded-lg px-2.5 py-1.5 transition hover:bg-ui-card2">
              <div className="flex items-center gap-2">
                <i className="ri-taxi-line text-base text-ui-faint" />
                <span className="text-xs font-semibold text-ui-ink">{ride.name}</span>
                <span className="text-[11px] text-ui-faint">{ride.eta} away</span>
              </div>
              <span className="text-xs font-bold text-ui-ink">{ride.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Full-viewport animated grid backdrop — deep #0B0B0F in dark mode, off-white in light
const GridBackdrop = () => {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ backgroundColor: dark ? '#0B0B0F' : '#FAFAFA' }}
    >
      <NetworkArt className="opacity-70">
        <GridTraffic carCount={4} />
      </NetworkArt>
    </div>
  );
};

const Landing = () => {
  const loggedIn = !!localStorage.getItem('token');
  const bookHref = loggedIn ? '/home' : '/login';

  return (
    <div className="relative min-h-screen bg-ui-canvas">
      <GridBackdrop />

      <div className="relative z-10">
        <Navbar />

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-ui-line pb-20 pt-28 sm:pt-32">
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-ui-line bg-ui-card px-3.5 py-1.5 text-xs font-semibold text-ui-muted">
                <i className="ri-flashlight-fill text-ui-ink" />
                Your ride, in minutes
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-ui-ink sm:text-5xl lg:text-6xl">
                Ride smarter.
                <br />
                Arrive faster.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-ui-muted">
                RideX connects you with verified captains nearby. Book an Economy, Comfort or
                Premium ride with upfront fares and live tracking from pickup to drop-off.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link to={bookHref}>
                  <Button size="lg" className="w-full sm:w-auto">
                    <i className="ri-taxi-line" /> Book a Ride
                  </Button>
                </Link>
                <a href="#features">
                  <Button size="lg" variant="ghost" className="w-full border border-ui-line bg-ui-card hover:bg-ui-card2 sm:w-auto">
                    Explore Features <i className="ri-arrow-down-line" />
                  </Button>
                </a>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <div className="mt-10 grid max-w-md grid-cols-3 divide-x divide-ui-line rounded-2xl border border-ui-line bg-ui-card py-4 text-center">
                {[
                  ['4.9★', 'Average rating'],
                  ['25k+', 'Rides completed'],
                  ['< 10 min', 'Avg. pickup'],
                ].map(([value, label]) => (
                  <div key={label} className="px-2">
                    <p className="text-lg font-extrabold text-ui-ink">{value}</p>
                    <p className="text-[11px] font-medium text-ui-faint">{label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={200} className="lg:pl-6">
            <HeroVisual />
          </Reveal>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section id="features" className="scroll-mt-20 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-ui-faint">Features</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ui-ink sm:text-4xl">
              Everything you need for a smooth ride
            </h2>
            <p className="mt-4 text-lg text-ui-muted">
              Built for riders and captains alike — simple, transparent and reliable at every step.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal
                key={f.title}
                delay={(i % 3) * 90}
                className="group rounded-2xl border border-ui-line bg-ui-card p-6 shadow-card transition duration-200 hover:-translate-y-1 hover:border-ui-faint hover:shadow-lift"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-ui-line bg-ui-card2 text-xl text-ui-ink transition group-hover:bg-ui-accent group-hover:text-ui-onaccent">
                  <i className={f.icon} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-ui-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ui-muted">{f.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section id="how-it-works" className="scroll-mt-20 border-y border-ui-line bg-ui-card2/50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-ui-faint">How it works</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ui-ink sm:text-4xl">
              From point A to point B in four steps
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 100} className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ui-accent text-2xl text-ui-onaccent shadow-card">
                  <i className={s.icon} />
                </div>
                <span className="absolute left-16 top-3 text-sm font-extrabold text-ui-faint">0{i + 1}</span>
                <h3 className="mt-4 text-lg font-bold text-ui-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ui-muted">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why RideX ────────────────────────────────────── */}
      <section id="about" className="scroll-mt-20 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <span className="text-sm font-bold uppercase tracking-widest text-ui-faint">Why RideX</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ui-ink sm:text-4xl">
                Built different, on purpose
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ui-muted">
                RideX started as a clean-slate take on ride-hailing: no confusing surge pricing,
                no hidden fees, no endless waiting. Just a dependable ride when you need one.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  ['ri-user-star-line', 'Verified captains', 'Every captain is onboarded with vehicle details and a verified account before they can accept rides.'],
                  ['ri-price-tag-3-line', 'Transparent pricing', 'See the exact fare for every ride option before you book. No surprises at the destination.'],
                  ['ri-timer-flash-line', 'Fast pickups', 'Ride requests go out to captains near you instantly over a live connection — no polling, no delay.'],
                ].map(([icon, title, text], i) => (
                  <Reveal key={title} delay={i * 90} className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-ui-line bg-ui-card2 text-xl text-ui-ink">
                      <i className={icon} />
                    </div>
                    <div>
                      <h3 className="font-bold text-ui-ink">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ui-muted">{text}</p>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={150}>
              <div className="grid gap-5 sm:grid-cols-2">
                {[
                  ['ri-route-line', 'Smart matching', 'Captains online near your pickup point get your request instantly.'],
                  ['ri-shield-check-line', 'Safe by design', 'OTP-verified starts mean only you can board the ride assigned to you.'],
                  ['ri-wallet-3-line', 'Ride history', 'Every trip is saved in your profile — fares, routes and receipts.'],
                  ['ri-customer-service-2-line', 'Always supported', '24/7 support for riders and captains from booking to drop-off.'],
                ].map(([icon, title, text], i) => (
                  <Reveal
                    key={title}
                    delay={i * 90}
                    className="rounded-2xl border border-ui-line bg-ui-card p-6 shadow-card"
                  >
                    <i className={`${icon} text-2xl text-ui-ink`} />
                    <h3 className="mt-3 font-bold text-ui-ink">{title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ui-muted">{text}</p>
                  </Reveal>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA band ─────────────────────────────────────── */}
      <section className="pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="relative overflow-hidden rounded-3xl bg-ui-accent px-6 py-14 text-center text-ui-onaccent sm:px-12">
            <NetworkArt className="text-ui-onaccent/10" />
            <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready to get moving?
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-lg opacity-80">
              Join RideX today — book your first ride in under a minute, or become a captain and
              start earning.
            </p>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to={bookHref}>
                <Button size="lg" variant="light">
                  Book a Ride
                </Button>
              </Link>
              <Link to="/captain-signup">
                <Button size="lg" variant="inverse">
                  Become a Captain
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

        <Footer />
      </div>
    </div>
  );
};

export default Landing;
