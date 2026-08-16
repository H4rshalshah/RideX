import { useEffect, useRef } from 'react';
import { CAR_PATH } from './carIcon';
import { useTheme } from '../../context/ThemeContext';

/**
 * Multi-car traffic simulation for the NetworkArt grid.
 *
 * Cars move strictly along the grid lines (horizontal + vertical), turn 90° at
 * intersections and follow varied multi-segment routes instead of a single
 * repeating path. Each car is oriented to face its direction of travel and
 * rotates smoothly when it turns.
 *
 * Coordinates live in the parent SVG's viewBox space (400×400 — the same space
 * the NetworkArt grid lines are drawn in), so cars are guaranteed to ride the
 * grid. Hidden under prefers-reduced-motion via .ridex-traffic-car.
 */

// Grid lines in the NetworkArt viewBox
const NODES_X = [80, 160, 240, 320];
const NODES_Y = [80, 160, 240, 320];
const INNER = [160, 240]; // always-visible band on every screen size

const SCALES = [0.65, 0.78, 0.7, 0.85];
const OPACITIES = [0.55, 0.72, 0.88, 1];

// Theme-based traffic colors — vibrant orange in dark mode, electric blue in light
const DARK_COLOR = '#FF6B00';
const LIGHT_COLOR = '#2563EB';

const pick = (arr) => arr[ Math.floor(Math.random() * arr.length) ];

// Weighted node pick — mostly the inner block so traffic stays visible
const pickNode = (axis) =>
  Math.random() < 0.6 ? pick(INNER) : pick(axis === 'x' ? NODES_X : NODES_Y);

const clamp80 = (v) => Math.min(320, Math.max(80, v));

const segLen = (a, b) => Math.abs(b.x - a.x) + Math.abs(b.y - a.y);

// Facing angle for a travel direction (SVG y grows downward, rotate() is clockwise)
const dirAngle = (dx, dy) => {
  if (dx > 0) return 0;   // right
  if (dx < 0) return 180; // left
  if (dy > 0) return 90;  // down
  return 270;             // up
};

// Shortest-path angular interpolation
const lerpAngle = (from, to, t) => {
  let diff = (to - from) % 360;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return from + diff * t;
};

/**
 * Random multi-segment route between two nodes: axis-aligned segments along
 * grid lines with 90° turns at intersections. Occasional overshoots create
 * S-shaped detours so no two routes look alike.
 */
function buildRoute(sx, sy, tx, ty) {
  const pts = [ { x: sx, y: sy } ];
  let x = sx;
  let y = sy;
  let horiz = Math.random() < 0.5;
  let guard = 0;

  while ((x !== tx || y !== ty) && guard++ < 8) {
    if (horiz && x !== tx) {
      if (Math.random() < 0.3) {
        const nx = clamp80(x + (Math.random() < 0.5 ? 80 : -80));
        if (nx !== x) { x = nx; pts.push({ x, y }); }
      } else {
        x = tx;
        pts.push({ x, y });
      }
    } else if (!horiz && y !== ty) {
      if (Math.random() < 0.3) {
        const ny = clamp80(y + (Math.random() < 0.5 ? 80 : -80));
        if (ny !== y) { y = ny; pts.push({ x, y }); }
      } else {
        y = ty;
        pts.push({ x, y });
      }
    } else {
      horiz = !horiz;
    }
  }

  // Finish whatever axis is still pending
  if (x !== tx || y !== ty) {
    if (x !== tx) { x = tx; pts.push({ x, y }); }
    if (y !== ty) { y = ty; pts.push({ x, y }); }
  }
  return pts;
}

function newRoute(car) {
  let tx;
  let ty;
  do {
    tx = pickNode('x');
    ty = pickNode('y');
  } while (tx === car.x && ty === car.y);

  car.route = buildRoute(car.x, car.y, tx, ty);
  car.seg = 0;
  car.segLen = segLen(car.route[ 0 ], car.route[ 1 ]);
  car.traveled = 0;
}

function stepCar(car, dt) {
  if (!car.route || car.seg >= car.route.length - 1) newRoute(car);

  const a = car.route[ car.seg ];
  const b = car.route[ car.seg + 1 ];
  const dx = Math.sign(b.x - a.x);
  const dy = Math.sign(b.y - a.y);
  car.targetAngle = dirAngle(dx, dy);

  // Move along the current segment
  car.traveled += car.speed * dt;
  const t = Math.min(1, car.traveled / car.segLen);
  car.x = a.x + (b.x - a.x) * t;
  car.y = a.y + (b.y - a.y) * t;

  // Advance to the next segment when this one is done
  if (t >= 1) {
    if (car.seg + 2 <= car.route.length - 1) {
      car.seg += 1;
      car.segLen = segLen(car.route[ car.seg ], car.route[ car.seg + 1 ]);
      car.traveled = 0;
    } else {
      car.route = null; // arrived → a fresh route is picked next frame
    }
  }

  // Smoothly rotate to face the direction of travel
  car.angle = lerpAngle(car.angle, car.targetAngle, Math.min(1, dt * 8));
}

const makeCar = (i) => ({
  x: pickNode('x'),
  y: pickNode('y'),
  angle: 0,
  targetAngle: 0,
  speed: 55 + Math.random() * 40,
  scale: SCALES[ i % SCALES.length ],
  opacity: OPACITIES[ i % OPACITIES.length ],
  route: null,
  seg: 0,
  segLen: 0,
  traveled: 0,
});

const GridTraffic = ({ carCount = 4 }) => {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const carColor = dark ? DARK_COLOR : LIGHT_COLOR;
  const stateRef = useRef(null);
  const groupsRef = useRef([]);

  // Build the cars once per mount (before first paint, so initial positions are correct)
  if (!stateRef.current) {
    stateRef.current = {
      cars: Array.from({ length: carCount }, (_, i) => {
        const car = makeCar(i);
        newRoute(car);
        return car;
      }),
    };
  }
  const { cars } = stateRef.current;

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) return undefined; // cars are hidden via CSS anyway

    let raf;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); // clamp big gaps (tab switches)
      last = now;
      cars.forEach((car, i) => {
        stepCar(car, dt);
        const el = groupsRef.current[ i ];
        if (el) {
          el.setAttribute('transform', `translate(${car.x} ${car.y}) rotate(${car.angle})`);
        }
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ cars, carCount ]);

  return (
    <>
      {cars.map((car, i) => (
        <g
          key={i}
          className="ridex-traffic-car"
          ref={(el) => {
            groupsRef.current[ i ] = el;
          }}
        >
          <g transform={`translate(${-12 * car.scale} ${-12 * car.scale}) scale(${car.scale})`}>
            <path d={CAR_PATH} fill={carColor} fillOpacity={car.opacity} />
          </g>
        </g>
      ))}
    </>
  );
};

export default GridTraffic;
