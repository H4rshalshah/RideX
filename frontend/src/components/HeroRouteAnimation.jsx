/**
 * Decorative animated route for the landing hero: a pickup pin (green) and a
 * destination pin (amber) joined by a roller-coaster dashed path (three big
 * hills), with a small paper plane flying from pickup to drop-off. The pins
 * are drawn with their tip at (0,0) so the line connects exactly to the
 * location point. Pure SVG (SMIL) — no JS timer.
 */
const ROUTE_PATH =
  'M 52 292 C 85 292, 95 120, 135 120 C 175 120, 175 245, 200 245 C 225 245, 235 85, 270 85 C 305 85, 305 170, 325 170 C 345 170, 350 50, 382 50';

const Pin = ({ x, y, color }) => (
  <g transform={`translate(${x} ${y})`}>
    {/* Teardrop pin with the tip exactly at (0,0) — the route line meets the tip */}
    <path
      d="M0 0 C -2.5 -4, -6 -6.5, -8 -10.5 C -11 -15.5, -12 -20.5, -10.5 -24.5 C -9 -28.5, -4.5 -31, 0 -31 C 4.5 -31, 9 -28.5, 10.5 -24.5 C 12 -20.5, 11 -15.5, 8 -10.5 C 6 -6.5, 2.5 -4, 0 0 Z"
      fill={color}
    />
    <circle cx="0" cy="-20" r="7.5" fill="#fff" />
    <circle cx="0" cy="-20" r="4.5" fill={color} />
  </g>
);

const HeroRouteAnimation = () => (
  <div className="mx-auto w-full max-w-[460px]">
    <svg viewBox="0 0 440 340" fill="none" aria-hidden="true" className="h-auto w-full">
      <defs>
        <path id="ridex-hero-route" d={ROUTE_PATH} />
      </defs>

      {/* Winding route with a loop — dashed line that flows forward */}
      <path
        d={ROUTE_PATH}
        fill="none"
        className="stroke-ui-faint/60"
        style={{
          strokeWidth: 3.5,
          strokeLinecap: 'round',
          strokeDasharray: '9 9',
          animation: 'ridex-dash 1.6s linear infinite',
        }}
      />

      {/* Paper plane flying from pickup to destination */}
      <g>
        <animateMotion
          dur="8s"
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

      {/* Pickup pin (start) — tip on the route start */}
      <Pin x={52} y={292} color="#22c55e" />
      {/* Destination pin (end) — tip on the route end */}
      <Pin x={382} y={50} color="#f59e0b" />
    </svg>
  </div>
);

export default HeroRouteAnimation;
