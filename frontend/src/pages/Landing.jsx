import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Reveal from '../components/ui/Reveal';
import Button from '../components/ui/Button';
import HeroMap from '../components/map/HeroMap';

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

  const heroRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      /* Subtle map zoom-in so the background feels alive */
      gsap.fromTo(
        mapRef.current,
        { scale: 1.15, opacity: 0.4 },
        { scale: 1, opacity: 1, duration: 2.2, ease: 'power3.out' },
      );

      /* Badge */
      gsap.fromTo(
        '.hero-badge',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.15, ease: 'power2.out' },
      );

      /* Title — each line staggers in */
      gsap.fromTo(
        '.hero-title-line',
        { opacity: 0, y: 28, clipPath: 'inset(0 0 100% 0)' },
        { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.7, stagger: 0.15, delay: 0.3, ease: 'power3.out' },
      );

      /* Subtitle */
      gsap.fromTo(
        '.hero-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.7, ease: 'power2.out' },
      );

      /* Buttons */
      gsap.fromTo(
        '.hero-buttons',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.9, ease: 'power2.out' },
      );

      /* Trust badges */
      gsap.fromTo(
        '.hero-trust',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, delay: 1.1, ease: 'power2.out' },
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen bg-ui-canvas">
      <Navbar />

      {/* ── Hero (real map background) ─────────────────────── */}
      <section ref={heroRef} className="relative w-full min-h-screen overflow-hidden border-b border-ui-line">
        {/* Full-bleed map behind everything */}
        <div ref={mapRef} className="absolute inset-0 z-0">
          <HeroMap />
        </div>

        {/* Readability overlays — light enough to keep the map vivid */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24 bg-gradient-to-b from-ui-canvas/40 to-transparent" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-ui-canvas/40 via-ui-canvas/15 to-transparent lg:from-ui-canvas/30 lg:via-ui-canvas/10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-28 bg-gradient-to-t from-ui-canvas/50 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4 pb-16 pt-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="hero-badge inline-flex items-center gap-2 rounded-full border border-ui-line bg-ui-card/90 px-3.5 py-1.5 text-xs font-semibold text-ui-muted shadow-card backdrop-blur-sm" style={{ opacity: 0 }}>
              <i className="ri-flashlight-fill text-ui-ink" />
              Your ride, in minutes
            </div>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-ui-ink sm:text-5xl lg:text-6xl">
              <span className="hero-title-line block" style={{ opacity: 0 }}>Ride smarter.</span>
              <span className="hero-title-line block" style={{ opacity: 0 }}>Arrive faster.</span>
            </h1>
            <p className="hero-subtitle mt-5 max-w-md font-serif text-lg leading-relaxed text-ui-muted" style={{ opacity: 0 }}>
              Verified captains nearby. Upfront fares. Live tracking from pickup to drop-off.
            </p>
            <div className="hero-buttons mt-8 flex flex-wrap items-center gap-4" style={{ opacity: 0 }}>
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
            <div className="hero-trust mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-ui-muted" style={{ opacity: 0 }}>
              {[
                { icon: 'ri-shield-check-line', label: 'Verified captains' },
                { icon: 'ri-radar-line', label: 'Live tracking' },
                { icon: 'ri-bank-card-line', label: 'Cash on arrival' },
              ].map((item) => (
                <span key={item.label} className="inline-flex items-center gap-2">
                  <i className={`${item.icon} text-ui-faint`} />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
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
          <Reveal className="relative overflow-hidden rounded-3xl border border-ui-line bg-ui-card px-6 py-14 text-center shadow-card sm:px-12">
            <h2 className="relative text-3xl font-extrabold tracking-tight text-ui-ink sm:text-4xl">
              Ready to get moving?
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-lg text-ui-muted">
              Join RideX today — book your first ride in under a minute, or become a captain and
              start earning.
            </p>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to={bookHref}>
                <Button size="lg" className="w-full sm:w-auto">
                  Book a Ride
                </Button>
              </Link>
              <Link to="/captain-signup">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Become a Captain
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Contact ─────────────────────────────────────── */}
      <section id="contact-landing" className="border-y border-ui-line bg-ui-card2/50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-ui-faint">Get in touch</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ui-ink sm:text-4xl">
              We'd love to hear from you
            </h2>
            <p className="mt-4 text-lg text-ui-muted">
              Have a question, feedback, or want to partner with us? Reach out anytime — we respond within 24 hours.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal delay={0} className="rounded-2xl border border-ui-line bg-ui-card p-6 shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-ui-line bg-ui-card2 text-xl text-ui-ink">
                <i className="ri-mail-send-line" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-ui-ink">Email us</h3>
              <p className="mt-2 text-sm leading-relaxed text-ui-muted">
                For general inquiries, support, or partnership opportunities.
              </p>
              <a
                href="mailto:h4rshal.workspace@gmail.com"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-ui-ink transition hover:opacity-70"
              >
                <i className="ri-arrow-right-up-line" /> h4rshal.workspace@gmail.com
              </a>
            </Reveal>

            <Reveal delay={90} className="rounded-2xl border border-ui-line bg-ui-card p-6 shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-ui-line bg-ui-card2 text-xl text-ui-ink">
                <i className="ri-customer-service-2-line" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-ui-ink">24/7 Support</h3>
              <p className="mt-2 text-sm leading-relaxed text-ui-muted">
                Our support team is available around the clock for riders and captains alike.
              </p>
              <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-ui-ink">
                <i className="ri-checkbox-circle-line text-green-500" /> Available now
              </span>
            </Reveal>

            <Reveal delay={180} className="rounded-2xl border border-ui-line bg-ui-card p-6 shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-ui-line bg-ui-card2 text-xl text-ui-ink">
                <i className="ri-share-line" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-ui-ink">Follow us</h3>
              <p className="mt-2 text-sm leading-relaxed text-ui-muted">
                Stay updated with the latest features, tips and announcements.
              </p>
              <div className="mt-3 flex gap-2">
                {[
                  { icon: 'ri-github-fill', href: 'https://github.com/H4rshalshah', label: 'GitHub' },
                  { icon: 'ri-linkedin-fill', href: 'https://www.linkedin.com/in/h4rshal/', label: 'LinkedIn' },
                  { icon: 'ri-instagram-line', href: 'https://www.instagram.com/itz_harsh047/', label: 'Instagram' },
                  { icon: 'ri-twitter-x-fill', href: 'https://twitter.com/h4rshalshah', label: 'Twitter' },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-ui-line bg-ui-card2 text-ui-muted transition hover:bg-ui-accent hover:text-ui-onaccent"
                  >
                    <i className={`${s.icon} text-lg`} />
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
