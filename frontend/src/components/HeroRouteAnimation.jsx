/**
 * Decorative animated route for the landing hero: a pickup pin (green) and a
 * destination pin (amber) joined by a winding dashed path, with a small paper
 * plane flying from pickup to drop-off. Pure SVG (SMIL) — no JS timer.
 */
const ROUTE_PATH =
  'M 48 272 C 120 238, 60 190, 150 164 C 230 140, 176 100, 262 92 C 318 86, 300 60, 372 44';

const Pin = ({ x, y, color }) => (
  <g transform={`translate(${x} ${y}) scale(0.06)`}>
    {/* Classic map pin, tip at the path end */}
    <path
      d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0z"
      fill={color}
    />
    <circle cx="192" cy="192" r="60" fill="#fff" />
    <circle cx="192" cy="192" r="38" fill={color} />
  </g>
);

const HeroRouteAnimation = () => (
  <div className="mx-auto w-full max-w-[420px]">
    <svg viewBox="0 0 420 320" fill="none" aria-hidden="true" className="h-auto w-full">
      <defs>
        <path id="ridex-hero-route" d={ROUTE_PATH} />
      </defs>

      {/* Winding route — dashed line that flows forward */}
      <path
        d={ROUTE_PATH}
        fill="none"
        className="stroke-ui-faint/60"
        style={{
          strokeWidth: 3,
          strokeLinecap: 'round',
          strokeDasharray: '8 8',
          animation: 'ridex-dash 1.6s linear infinite',
        }}
      />

      {/* Paper plane flying from pickup to destination */}
      <g>
        <animateMotion
          dur="5.5s"
          repeatCount="indefinite"
          rotate="auto"
          calcMode="spline"
          keySplines="0.4 0 0.6 1"
          keyPoints="0;1"
          keyTimes="0;1"
        >
          <mpath href="#ridex-hero-route" />
        </animateMotion>
        <g transform="translate(-12 -10.5) scale(1.15)">
          <path d="M0 1.5 L24 12 L0 20 L4.5 12 Z" fill="rgb(var(--color-ink))" />
        </g>
      </g>

      {/* Pickup pin (start) */}
      <Pin x={48} y={272} color="#22c55e" />
      {/* Destination pin (end) */}
      <Pin x={372} y={44} color="#f59e0b" />
    </svg>
  </div>
);

export default HeroRouteAnimation;
