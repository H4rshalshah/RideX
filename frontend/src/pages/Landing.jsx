import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Reveal from '../components/ui/Reveal';
import Button from '../components/ui/Button';

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
  <div className="relative mx-auto w-full max-w-md">
    {/* Glow behind the card */}
    <div aria-hidden="true" className="absolute -inset-6 rounded-[2.5rem] bg-brand-600/25 blur-3xl" />

    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900 shadow-lift">
      {/* Map-style background */}
      <div aria-hidden="true" className="relative h-56 bg-gradient-to-br from-ink-800 via-brand-950 to-ink-900">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(#ffffff22_1px,transparent_1px),linear-gradient(90deg,#ffffff22_1px,transparent_1px)] [background-size:32px_32px]" />
        {/* Route line */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 224" fill="none" preserveAspectRatio="none">
          <path
            d="M30 190 C 130 190, 90 90, 210 96 S 350 40, 372 34"
            stroke="#9d74ff"
            strokeWidth="3"
            strokeDasharray="2 10"
            strokeLinecap="round"
          />
          <circle cx="30" cy="190" r="9" fill="#6d28f0" stroke="#fff" strokeWidth="3" />
          <circle cx="372" cy="34" r="9" fill="#f59e0b" stroke="#fff" strokeWidth="3" />
        </svg>
        <span className="absolute bottom-3 left-3 rounded-lg bg-black/40 px-2.5 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm">
          <i className="ri-navigation-fill mr-1 text-brand-300" /> Live tracking
        </span>
      </div>

      {/* Trip card */}
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-ink-800/80 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600/20 text-brand-300">
            <i className="ri-map-pin-2-fill text-lg" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Pickup</p>
            <p className="truncate text-sm font-medium text-white">Current location</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-ink-800/80 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
            <i className="ri-map-pin-2-fill text-lg" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Destination</p>
            <p className="truncate text-sm font-medium text-white">Central Station</p>
          </div>
        </div>

        <div className="space-y-2 border-t border-white/10 pt-3">
          {[
            { name: 'Economy', eta: '2 min', price: '₹49', seats: 1 },
            { name: 'Comfort', eta: '4 min', price: '₹89', seats: 3 },
            { name: 'Premium', eta: '6 min', price: '₹129', seats: 4 },
          ].map((ride) => (
            <div key={ride.name} className="flex items-center justify-between rounded-xl px-3 py-2 transition hover:bg-ink-800/80">
              <div className="flex items-center gap-2.5">
                <i className="ri-taxi-line text-lg text-ink-300" />
                <span className="text-sm font-semibold text-white">{ride.name}</span>
                <span className="text-xs text-ink-400">{ride.eta} away</span>
              </div>
              <span className="text-sm font-bold text-brand-300">{ride.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Landing = () => {
  const loggedIn = !!localStorage.getItem('token');
  const bookHref = loggedIn ? '/home' : '/login';

  return (
    <div className="bg-white">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink-950 pb-20 pt-28 sm:pt-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-brand-700/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 translate-x-1/3 translate-y-1/3 rounded-full bg-brand-500/10 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-brand-200">
                <i className="ri-flashlight-fill text-brand-400" />
                Your ride, in minutes
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Ride smarter.
                <br />
                <span className="text-gradient">Arrive faster.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-300">
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
                  <Button size="lg" variant="ghost" className="w-full border border-white/15 text-white hover:bg-white/10 sm:w-auto">
                    Explore Features <i className="ri-arrow-down-line" />
                  </Button>
                </a>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <div className="mt-10 grid max-w-md grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/5 py-4 text-center backdrop-blur-sm">
                {[
                  ['4.9★', 'Average rating'],
                  ['25k+', 'Rides completed'],
                  ['< 10 min', 'Avg. pickup'],
                ].map(([value, label]) => (
                  <div key={label} className="px-2">
                    <p className="text-lg font-extrabold text-white">{value}</p>
                    <p className="text-[11px] font-medium text-ink-400">{label}</p>
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
            <span className="text-sm font-bold uppercase tracking-widest text-brand-600">Features</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Everything you need for a smooth ride
            </h2>
            <p className="mt-4 text-lg text-ink-500">
              Built for riders and captains alike — simple, transparent and reliable at every step.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal
                key={f.title}
                delay={(i % 3) * 90}
                className="group rounded-2xl border border-ink-100 bg-white p-6 shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                  <i className={f.icon} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{f.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section id="how-it-works" className="scroll-mt-20 bg-ink-50/60 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-brand-600">How it works</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              From point A to point B in four steps
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 100} className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-2xl text-white shadow-card">
                  <i className={s.icon} />
                </div>
                <span className="absolute left-16 top-3 text-sm font-extrabold text-brand-300">0{i + 1}</span>
                <h3 className="mt-4 text-lg font-bold text-ink-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.text}</p>
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
              <span className="text-sm font-bold uppercase tracking-widest text-brand-600">Why RideX</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                Built different, on purpose
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-500">
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
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-xl text-brand-600">
                      <i className={icon} />
                    </div>
                    <div>
                      <h3 className="font-bold text-ink-900">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-500">{text}</p>
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
                    className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card"
                  >
                    <i className={`${icon} text-2xl text-brand-600`} />
                    <h3 className="mt-3 font-bold text-ink-900">{title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{text}</p>
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
          <Reveal className="relative overflow-hidden rounded-3xl bg-ink-950 px-6 py-14 text-center sm:px-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[520px] -translate-x-1/2 rounded-full bg-brand-600/30 blur-3xl"
            />
            <h2 className="relative text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ready to get moving?
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-lg text-ink-300">
              Join RideX today — book your first ride in under a minute, or become a captain and
              start earning.
            </p>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to={bookHref}>
                <Button size="lg">Book a Ride</Button>
              </Link>
              <Link to="/captain-signup">
                <Button size="lg" variant="secondary">
                  Become a Captain
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
