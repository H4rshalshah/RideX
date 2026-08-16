# Presenting RideX — 10-minute walkthrough

A suggested flow for demoing the project. Adapt to your time.

## Before you present

1. Make sure MongoDB is running and `Backend/.env` + `frontend/.env` are filled in
   (see the root [README](README.md#environment-variables)).
2. Start the stack:

   ```bash
   # Terminal 1
   cd Backend && npm run seed && npm start

   # Terminal 2
   cd frontend && npm run dev
   ```

3. Open http://localhost:5173. `npm run seed` creates the demo accounts
   (`demo@ridex.app` / `demo1234` rider, `captain@ridex.app` / `demo1234` captain).

## Demo script (recommended)

**1. Landing page (1 min)**
Open the home page. Call out the RideX identity, the hero CTA, the features grid, the
4-step "How it works" and the footer. Scroll slowly so the reveal animations show.

**2. Sign up / log in (1 min)**
Click **Log in** and use the demo rider account. Point out the split-screen design and the
form validation (try submitting an empty form first).

**3. Book a ride (2 min)**
On `/home` use **Current location** for pickup and type a destination near Mumbai
(e.g. `Gateway of India, Mumbai` → `Bandra West, Mumbai`). **Find rides** shows the
Economy / Comfort / Premium cards with fares and ETAs — confirm one to see the booking
summary and the "Looking for a captain" state.

**4. Captain accepts (2 min)**
In a second browser/profile, log in as the captain. Turn **Go online** on (allow location).
The ride request pops up → **Accept** → enter the rider's OTP (shown on the rider's
"Your captain is on the way" panel) → **Confirm & start ride**.

**5. Complete the ride (1 min)**
The rider's screen switches to the live in-ride view. On the captain side press
**Complete ride** → the rider sees the ride-ended toast and both return to their dashboards.

**6. History & stats (1 min)**
As the rider, open **Ride history** (filter tabs + search) and **Profile** (stats). As the
captain, show the earnings/trips from the seeded data.

## Talking points

- **Real-time, not mocked**: Socket.io pushes ride requests to online captains within a
  radius of the pickup — no polling.
- **Security**: JWT auth with token blacklisting on logout; API keys stay on the server;
  OTP-verified ride starts.
- **UX system**: one design system (colors, type, buttons, cards), skeleton loaders, toasts,
  form validation, and `prefers-reduced-motion` support.
- **Clean code**: shared API client, reusable UI primitives, no unused dependencies.

## If something is missing

- Map shows a placeholder → no internet connection (the map needs to fetch OSM tiles).
- Fares/geocoding fail → no internet connection (the backend uses free keyless providers).
- Captain never receives the request → the captain is not online, or the pickup is farther
  than 2 km from the captain's seeded location near Mumbai.
