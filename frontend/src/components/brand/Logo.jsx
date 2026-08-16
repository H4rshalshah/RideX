const Logo = ({ light = false, size = 32, className = '' }) => (
  <span className={`inline-flex items-center gap-2 select-none ${className}`}>
    <span
      className={`flex items-center justify-center rounded-lg ${
        light ? 'bg-white' : 'bg-ui-accent'
      }`}
      style={{ width: size, height: size }}
    >
      <i
        className={`ri-map-pin-2-fill ${light ? 'text-black' : 'text-ui-onaccent'}`}
        style={{ fontSize: Math.round(size * 0.62), lineHeight: 1 }}
        aria-hidden="true"
      />
    </span>
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
