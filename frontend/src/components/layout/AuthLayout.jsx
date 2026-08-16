import { Link } from 'react-router-dom';
import Logo from '../brand/Logo';
import ThemeToggle from '../ui/ThemeToggle';
import NetworkArt from '../ui/NetworkArt';

const AuthLayout = ({ title, subtitle, caption = 'Rider portal', children, footer }) => (
  <div className="flex min-h-screen bg-ui-canvas">
    {/* Brand panel (desktop) */}
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-ui-line bg-ui-canvas p-12 lg:flex">
      <NetworkArt />
      <Link to="/" className="relative">
        <Logo size={34} />
      </Link>
      <div className="relative max-w-md">
        <span className="inline-flex items-center gap-2 rounded-full border border-ui-line bg-ui-card px-3.5 py-1.5 text-xs font-semibold text-ui-muted">
          <i className="ri-shield-star-line text-ui-faint" /> {caption}
        </span>
        <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-ui-ink">
          The fastest way to get where you are going.
        </h2>
        <p className="mt-3 text-ui-muted">
          Upfront fares, verified captains and live tracking on every single ride.
        </p>
      </div>
      <p className="relative text-xs text-ui-faint">
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
