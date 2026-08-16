# RideX — Backend API

Express + Socket.io API for the RideX ride-booking app. See the [root README](../README.md) for
setup instructions and the full project overview.

## Conventions

- JSON request/response bodies.
- All protected endpoints require a valid JWT: `Authorization: Bearer <token>`.
- Ride request validation errors return `400` with an `errors` array.
- Google Maps calls are proxied server-side; the API key never leaves the backend.

## Environment

| Variable        | Description                                        |
| --------------- | -------------------------------------------------- |
| `DB_CONNECT`    | MongoDB connection string                          |
| `JWT_SECRET`    | Secret used to sign auth tokens                    |
| `GOOGLE_MAPS_API` | Server-side Google Maps API key                  |
| `PORT`          | Server port (default `3000`)                       |
| `CORS_ORIGIN`   | Comma-separated allowed origins (default: any)     |

## Users

| Method | Endpoint           | Auth | Description                              |
| ------ | ------------------ | ---- | ---------------------------------------- |
| POST   | `/users/register`  | –    | Create a rider account                   |
| POST   | `/users/login`     | –    | Log in, returns `{ token, user }`        |
| GET    | `/users/profile`   | JWT  | Current rider profile                    |
| GET    | `/users/logout`    | JWT  | Blacklists the token and logs out        |

## Captains

| Method | Endpoint                | Auth | Description                          |
| ------ | ----------------------- | ---- | ------------------------------------ |
| POST   | `/captains/register`    | –    | Create a captain + vehicle account   |
| POST   | `/captains/login`       | –    | Log in, returns `{ token, captain }` |
| GET    | `/captains/profile`     | JWT  | Current captain profile              |
| GET    | `/captains/logout`      | JWT  | Blacklists the token and logs out    |

## Maps (proxied to Google)

| Method | Endpoint                 | Params                      | Description                    |
| ------ | ------------------------ | --------------------------- | ------------------------------ |
| GET    | `/maps/get-coordinates`  | `address`                   | Geocode an address → `{ltd, lng}` |
| GET    | `/maps/get-distance-time`| `origin`, `destination`     | Distance + duration between two addresses |
| GET    | `/maps/get-suggestions`  | `input`                     | Autocomplete place suggestions |
| GET    | `/maps/reverse-geocode`  | `ltd`, `lng`                | Address for a coordinate pair  |

## Rides

| Method | Endpoint               | Auth   | Description                                   |
| ------ | ---------------------- | ------ | --------------------------------------------- |
| POST   | `/rides/create`        | Rider  | Create a ride, notify nearby online captains  |
| GET    | `/rides/get-fare`      | Rider  | Fare estimate for `pickup` + `destination` (auto/car/moto) |
| POST   | `/rides/confirm`       | Captain| Accept a pending ride                          |
| GET    | `/rides/start-ride`    | Captain| Start a ride with the rider's 6-digit OTP     |
| POST   | `/rides/end-ride`      | Captain| Mark an ongoing ride as completed             |
| POST   | `/rides/cancel`        | Rider  | Cancel a pending/accepted ride                |
| GET    | `/rides/history`       | Rider  | Rider's rides, newest first                   |
| GET    | `/rides/captain-history` | Captain | Captain's rides, newest first               |

## Demo data

`npm run seed` creates a demo rider (`demo@ridex.app` / `demo1234`), an online demo captain
(`captain@ridex.app` / `demo1234`) near Mumbai, and a few completed rides. Re-running the seed
replaces only the demo accounts.

## Socket.io events

Client → server:

- `join` — register socket for a user/captain (`{ userId, userType }`).
- `update-location-captain` — stream captain location (`{ userId, location: { ltd, lng } }`).
- `set-status` — go online/offline (`{ userId, status: 'active' | 'inactive' }`).

Server → client:

- `new-ride` — sent to online captains within radius of the pickup.
- `ride-confirmed` — sent to the rider when a captain accepts.
- `ride-started` — sent to the rider when the captain starts the ride.
- `ride-ended` — sent to the rider when the ride is completed.

## Ride statuses

`pending → accepted → ongoing → completed` (or `cancelled` at any point before `ongoing`).
