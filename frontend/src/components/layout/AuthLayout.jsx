import { Link } from 'react-router-dom';
import Logo from '../brand/Logo';

const AuthLayout = ({ title, subtitle, caption = 'Rider portal', children, footer }) => (
  <div className="flex min-h-screen bg-white">
    {/* Brand panel (desktop) */}
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-ink-950 p-12 lg:flex">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[560px] -translate-x-1/2 rounded-full bg-brand-700/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 translate-x-1/3 translate-y-1/3 rounded-full bg-brand-500/10 blur-3xl"
      />
      <Link to="/" className="relative">
        <Logo light size={34} />
      </Link>
      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-brand-200">
          <i className="ri-shield-star-line text-brand-400" /> {caption}
        </span>
        <h2 className="mt-5 max-w-md text-3xl font-extrabold leading-tight tracking-tight text-white">
          The fastest way to get where you are going.
        </h2>
        <p className="mt-3 max-w-md text-ink-300">
          Upfront fares, verified captains and live tracking on every single ride.
        </p>
      </div>
      <p className="relative text-xs text-ink-500">
        © {new Date().getFullYear()} RideX — an independent ride-booking application.
      </p>
    </div>

    {/* Form panel */}
    <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 inline-block lg:hidden" aria-label="RideX home">
          <Logo size={30} />
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-ink-500">{subtitle}</p>
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </div>
  </div>
);

export default AuthLayout;
