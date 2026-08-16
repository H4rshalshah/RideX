import { Link } from 'react-router-dom';
import Logo from '../brand/Logo';
import ThemeToggle from '../ui/ThemeToggle';
import HeroMap from '../map/HeroMap';

const AuthLayout = ({ title, subtitle, caption = 'Rider portal', children, footer }) => (
  <div className="flex min-h-screen bg-ui-canvas">
    {/* Brand panel (desktop) — real India map background, same style as the landing hero */}
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-ui-line bg-ui-canvas p-12 lg:flex">
      {/* Full-bleed map behind the branding */}
      <div className="absolute inset-0 z-0">
        <HeroMap showControls={false} />
      </div>

      {/* Readability overlays — subtle, map stays visible */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-ui-canvas/85 via-ui-canvas/50 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-ui-canvas/90 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28 bg-gradient-to-b from-ui-canvas/80 to-transparent" />

      <Link to="/" className="relative z-10">
        <Logo size={34} />
      </Link>
      <div className="relative z-10 max-w-md">
        <span className="inline-flex items-center gap-2 rounded-full border border-ui-line bg-ui-card/90 px-3.5 py-1.5 text-xs font-semibold text-ui-muted shadow-card backdrop-blur-sm">
          <i className="ri-shield-star-line text-ui-faint" /> {caption}
        </span>
        <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-ui-ink">
          The fastest way to get where you are going.
        </h2>
        <p className="mt-3 text-ui-muted">
          Upfront fares, verified captains and live tracking on every single ride.
        </p>
      </div>
      <p className="relative z-10 text-xs text-ui-faint">
        © {new Date().getFullYear()} RideX — an independent ride-booking application.
      </p>
    </div>

    {/* Form panel */}
    <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-between lg:justify-end">
          <Link to="/" className="inline-block lg:hidden" aria-label="RideX home">
            <Logo size={30} />
          </Link>
          <ThemeToggle className="h-9 w-9" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ui-ink sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-ui-muted">{subtitle}</p>
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </div>
  </div>
);

export default AuthLayout;
