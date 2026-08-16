/**
 * Decorative line-art node/network illustration used behind hero and
 * auth sections. Renders in the current text color at low opacity.
 */
const NetworkArt = ({ className = '', children }) => (
  <svg
    aria-hidden="true"
    className={`pointer-events-none absolute inset-0 h-full w-full text-ui-ink/10 ${className}`}
    viewBox="0 0 400 400"
    fill="none"
    preserveAspectRatio="xMidYMid slice"
  >
    <path
      d="M0 80 H400 M0 160 H400 M0 240 H400 M0 320 H400 M80 0 V400 M160 0 V400 M240 0 V400 M320 0 V400"
      stroke="currentColor"
      strokeWidth="1"
    />
    {[
      [80, 80], [160, 160], [240, 80], [320, 240], [80, 320], [240, 320], [160, 240], [320, 80],
    ].map(([cx, cy], i) => (
      <circle key={i} cx={cx} cy={cy} r="3" fill="currentColor" />
    ))}
    <path
      d="M80 80 L160 160 L240 80 L320 240 M80 320 L160 240 L240 320 M160 160 L160 240 M240 80 L320 80"
      stroke="currentColor"
      strokeWidth="1"
    />
    {children}
  </svg>
);

export default NetworkArt;
