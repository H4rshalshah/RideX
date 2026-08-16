// Line-art car glyph (remixicon "car-line", 24x24 box)
const CAR_PATH =
  'M19 20H5V21C5 21.5523 4.55228 22 4 22H3C2.44772 22 2 21.5523 2 21V11L4.4805 5.21216C4.79566 4.47679 5.51874 4 6.31879 4H17.6812C18.4813 4 19.2043 4.47679 19.5195 5.21216L22 11V21C22 21.5523 21.5523 22 21 22H20C19.4477 22 19 21.5523 19 21V20ZM20 13H4V18H20V13ZM4.17594 11H19.8241L17.6812 6H6.31879L4.17594 11ZM6.5 17C5.67157 17 5 16.3284 5 15.5C5 14.6716 5.67157 14 6.5 14C7.32843 14 8 14.6716 8 15.5C8 16.3284 7.32843 17 6.5 17ZM17.5 17C16.6716 17 16 16.3284 16 15.5C16 14.6716 16.6716 14 17.5 14C18.3284 14 19 14.6716 19 15.5C19 16.3284 18.3284 17 17.5 17Z';

/**
 * A line-art car that drives along an SVG path.
 *
 * Uses SMIL <animateMotion>, so the route coordinates live in the SVG's
 * viewBox space (easy for full-bleed backgrounds). The element is hidden
 * when prefers-reduced-motion is active (see index.css).
 *
 * @param {string} path      SVG path the car follows
 * @param {string} viewBox   viewBox of the stage (e.g. "0 0 1440 600")
 * @param {string} duration  e.g. "16s"
 * @param {number} carScale  size multiplier for the 24-unit car glyph
 * @param {boolean} showRoute draws a faint dashed line under the car
 * @param {string} colorClass Tailwind text color, e.g. "text-ui-ink/60"
 */
const MovingCar = ({
  path,
  viewBox = '0 0 1440 600',
  duration = '16s',
  carScale = 2.4,
  showRoute = true,
  colorClass = 'text-ui-ink/60',
  className = '',
}) => (
  <svg
    aria-hidden="true"
    className={`ridex-moving-car pointer-events-none absolute inset-0 h-full w-full ${colorClass} ${className}`}
    viewBox={viewBox}
    fill="none"
    preserveAspectRatio="xMidYMid slice"
  >
    {showRoute && (
      <path
        d={path}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 10"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    )}
    <g>
      <animateMotion dur={duration} repeatCount="indefinite" rotate="auto" path={path} />
      {/* Center the 24x24 glyph on the path and scale it */}
      <g transform="translate(-12,-12)">
        <g transform={`scale(${carScale})`}>
          <path d={CAR_PATH} fill="currentColor" />
        </g>
      </g>
    </g>
  </svg>
);

export default MovingCar;
