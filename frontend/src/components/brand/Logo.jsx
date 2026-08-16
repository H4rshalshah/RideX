const Logo = ({ light = false, size = 32, className = '' }) => (
  <span className={`inline-flex items-center gap-2 select-none ${className}`}>
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect
        width="64"
        height="64"
        rx="16"
        className={light ? 'fill-white' : 'fill-ui-accent'}
      />
      <path
        d="M21 21 L43 43 M43 21 L21 43"
        strokeWidth="8"
        strokeLinecap="round"
        className={light ? 'stroke-black' : 'stroke-ui-onaccent'}
      />
    </svg>
    <span
      className={`text-xl font-extrabold tracking-tight ${
        light ? 'text-white' : 'text-ui-ink'
      }`}
    >
      RideX
    </span>
  </span>
);

export default Logo;
