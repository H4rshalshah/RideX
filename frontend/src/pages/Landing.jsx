import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Reveal from '../components/ui/Reveal';
import Button from '../components/ui/Button';
import HeroMap from '../components/map/HeroMap';
import HeroRouteAnimation from '../components/HeroRouteAnimation';

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

const Landing = () => {
  const loggedIn = !!localStorage.getItem('token');
  const bookHref = loggedIn ? '/home' : '/login';

  return (
    <div className="relative min-h-screen bg-ui-canvas">
      <Navbar />

      {/* ── Hero (real map background) ─────────────────────── */}
      <section className="relative w-full overflow-hidden border-b border-ui-line">
        {/* Full-bleed map behind everything */}
        <div className="absolute inset-0 z-0">
          <HeroMap />
        </div>

        {/* Readability overlays — subtle, map stays visible */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28 bg-gradient-to-b from-ui-canvas/80 to-transparent" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-ui-canvas/90 via-ui-canvas/40 to-transparent lg:from-ui-canvas/80 lg:via-ui-canvas/30" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-32 bg-gradient-to-t from-ui-canvas to-transparent" />

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[1fr_420px] lg:gap-10 lg:px-8">
          <div className="max-w-2xl lg:pl-10">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-ui-line bg-ui-card/90 px-3.5 py-1.5 text-xs font-semibold text-ui-muted shadow-card backdrop-blur-sm">
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
              <p className="mt-5 max-w-lg font-serif text-lg leading-relaxed text-ui-muted">
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
                  <Button
                    size="lg"
                    variant="ghost"
                    className="w-full border border-ui-line bg-ui-card/90 backdrop-blur-sm hover:bg-ui-card sm:w-auto"
                  >
                    Explore Features <i className="ri-arrow-down-line" />
                  </Button>
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={240} className="hidden lg:block">
            <HeroRouteAnimation />
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
  );
};

export default Landing;
