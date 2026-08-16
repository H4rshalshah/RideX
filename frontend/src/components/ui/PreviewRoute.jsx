import { useEffect, useRef } from 'react';
import { CAR_PATH } from './carIcon';
import { useTheme } from '../../context/ThemeContext';

/**
 * Micro route simulation for the hero preview card: a mini car drives a
 * grid-aligned route between the pickup and destination pins, pauses briefly
 * at each stop point, and pops a location pin (scale + fade) when it arrives.
 * Rendered inside the parent SVG (viewBox 0 0 400 224), so coordinates match
 * the route line and static pins drawn by the caller.
 */

// Grid-aligned waypoints (axis-aligned segments only)
const START = { x: 40, y: 180 }; // pickup
const END = { x: 330, y: 55 }; // destination
const STOPS = [
  { x: 150, y: 180 },
  { x: 150, y: 110 },
  { x: 270, y: 110 },
];
const S1 = STOPS[0];
const S2 = STOPS[1];
const S3 = STOPS[2];

// START → S1 → S2 → S3 → END → S3 → S2 → S1 → START (continuous loop, no jumps)
const ROUTE = [ START, S1, S2, S3, END, S3, S2, S1, START ];

const CAR_SPEED = 95; // units/second
const PAUSE_MS = 1000;

// stop index lookup by point coordinates
const STOP_INDEX = {
  [ `${S1.x},${S1.y}` ]: 0,
  [ `${S2.x},${S2.y}` ]: 1,
  [ `${S3.x},${S3.y}` ]: 2,
};

// Real-world map pin (like fa-solid fa-location-dot — teardrop with a hole)
const PIN_PATH =
  'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 4.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5z';

const dirAngle = (dx, dy) => {
  if (dx > 0) return 0;   // right
  if (dx < 0) return 180; // left
  if (dy > 0) return 90;  // down
  return 270;             // up
};

const lerpAngle = (from, to, t) => {
  let diff = (to - from) % 360;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return from + diff * t;
};

const PreviewRoute = () => {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const accent = dark ? '#FF6B00' : '#2563EB';

  const carRef = useRef(null);
  const pinRefs = useRef([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) return undefined; // car hidden via CSS, pins stay static

    let raf;
    let last = performance.now();
    const state = { seg: 0, traveled: 0, paused: false, pauseUntil: 0 };
    let angle = 0;

    const popPin = (stopIdx) => {
      const el = pinRefs.current[ stopIdx ];
      if (!el) return;
      el.classList.remove('ridex-stop-pop');
      void el.getBoundingClientRect(); // restart the CSS animation
      el.classList.add('ridex-stop-pop');
    };

    const clearPins = () => {
      pinRefs.current.forEach((el) => el && el.classList.remove('ridex-stop-pop'));
    };

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (state.paused) {
        if (now >= state.pauseUntil) {
          state.paused = false;
          state.seg += 1;
          state.traveled = 0;
        }
      } else {
        const a = ROUTE[ state.seg ];
        const b = ROUTE[ state.seg + 1 ];
        const len = Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
        state.traveled += CAR_SPEED * dt;
        const t = Math.min(1, state.traveled / len);

        const x = a.x + (b.x - a.x) * t;
        const y = a.y + (b.y - a.y) * t;
        const dx = Math.sign(b.x - a.x);
        const dy = Math.sign(b.y - a.y);
        angle = lerpAngle(angle, dirAngle(dx, dy), Math.min(1, dt * 8));
        carRef.current?.setAttribute('transform', `translate(${x} ${y}) rotate(${angle})`);

        if (t >= 1) {
          const arrivedAt = ROUTE[ state.seg + 1 ];
          if (arrivedAt === ROUTE[ ROUTE.length - 1 ]) {
            // Back at START → restart the cycle and clear popped pins
            state.seg = 0;
            state.traveled = 0;
            clearPins();
          } else {
            const stopIdx = STOP_INDEX[ `${arrivedAt.x},${arrivedAt.y}` ];
            state.paused = true;
            state.pauseUntil = now + PAUSE_MS;
            if (stopIdx !== undefined) popPin(stopIdx);
          }
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      {/* Route line */}
      <polyline
        points={ROUTE.slice(0, 5).map((p) => `${p.x},${p.y}`).join(' ')}
        stroke={accent}
        strokeWidth="2"
        strokeDasharray="3 9"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />

      {/* Popping stop pins */}
      {STOPS.map((p, i) => (
        <g
          key={i}
          ref={(el) => {
            pinRefs.current[ i ] = el;
          }}
          className="opacity-0"
          transform={`translate(${p.x} ${p.y})`}
        >
          <path d={PIN_PATH} fill={accent} transform="scale(1.15)" />
        </g>
      ))}

      {/* Mini car */}
      <g ref={carRef} className="ridex-preview-car" transform={`translate(${START.x} ${START.y})`}>
        <g transform="translate(-16.8 -16.8) scale(1.4)">
          <path d={CAR_PATH} fill={accent} />
        </g>
      </g>
    </>
  );
};

export default PreviewRoute;
