const Logo = ({ light = false, size = 32, className = '' }) => (
  <span className={`inline-flex items-center gap-2 select-none ${className}`}>
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#6d28f0" />
      <path
        d="M21 21 L43 43 M43 21 L21 43"
        stroke="#ffffff"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
    <span
      className={`text-xl font-extrabold tracking-tight ${
        light ? 'text-white' : 'text-ink-900'
      }`}
    >
      Ride<span className={light ? 'text-brand-300' : 'text-brand-600'}>X</span>
    </span>
  </span>
);

export default Logo;
