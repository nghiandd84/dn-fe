# Implementation Plan — `event-booking` (guest event-booking app)

> Source spec: `\\wsl$\Ubuntu\home\nddnghia\Training\dn-ms\.kiro\plans\sveltekit-event-booking-app.md`
> Backend verified live: Event API `:5071`, Booking API `:5091` (both via gateway `http://localhost:6001/api`).

## 1. Goal

A **guest-facing** SvelteKit app where visitors browse events, pick seats, and
create a booking **without logging in**. The guest confirms via an emailed
one-time link, then authenticates with OAuth only to pay, after which the guest
booking is promoted to a real booking.

This is a **consumer storefront**, not an admin panel — so it does **not** use the
navy sidebar/admin layout or the route-gating `hooks.server.ts` pattern used by
the `*-admin` apps. It reuses the monorepo plumbing (`createApi`, proxy routes,
`session`/`fingerprint` helpers, DESIGN.md tokens, otel) where it fits.

## 2. Placement & scaffold

New workspace app: **`apps/event-booking/`** (npm workspace, already globbed by
root `package.json` `workspaces: ["apps/*"]`).

Mirror the config of `apps/event-admin`:
- `svelte.config.js` — `@sveltejs/adapter-node`, `$i18n` alias (optional; i18n can be dropped for v1).
- `vite.config.ts` — dev `server.port: 5181`.
- `package.json` — `dev`/`build`/`start`/`check` scripts; deps `@dn-fe/ui`, `@dn-fe/otel`, `@dn-fe/adapter-node`, `@fingerprintjs/fingerprintjs`.
- `.npmrc`, `.gitignore`, `tsconfig.json`, `src/app.html`, `src/app.d.ts`.

Chosen dev port: **5181** (5180 taken by tagging-admin). `site_origin` = `http://localhost:5181`.

### Root wiring
- Add to root `package.json`: `dev:event-booking`, `build:event-booking`, `start:event-booking` (workspace `apps/event-booking`).
- Run `npm install` at root to link workspace deps.
- Update `README.md` apps table (port 5181).

## 3. Environment (`apps/event-booking/.env`)

| Var | Value (dev) | Purpose |
|-----|-------------|---------|
| `EVENT_API_URL` | `http://localhost:6001/api/event` | Event service via gateway |
| `BOOKING_API_URL` | `http://localhost:6001/api/booking` | Booking service via gateway |
| `AUTH_API_URL` | `http://localhost:6001/api/auth` | Token exchange |
| `AUTH_SERVER_URL` | `http://localhost:5173` | OAuth login redirect |
| `AUTH_CLIENT_ID` | *(from backend `apps/gateway/test.rest`)* | OAuth client |
| `AUTH_CALLBACK_URL` | `http://localhost:5181/auth/callback` | OAuth redirect target |
| `AUTH_SCOPES` | `id,email` | OAuth scopes |
| `PUBLIC_BASE_URL` | `http://localhost:5181` | Used as `site_origin` / `Origin` header |
| `PORT` | `5181` | prod port |
| `ORIGIN` | `http://localhost:5181` | adapter-node CSRF |
| `OTEL_SERVICE_NAME` | `event-booking` | tracing |

> ⚠ Backend prerequisite: `http://localhost:5181` must be in
> `GUEST_BOOKING_ALLOWED_ORIGINS` **and** the gateway CORS localhost allowlist.
> Verify before Task 2 (create) will succeed.

## 4. Architecture (BFF proxy, no auth gate)

```
Browser  →  SvelteKit proxy routes (/api/*)  →  createApi()  →  gateway :6001
```

- `src/lib/api.ts`: `export const eventApi = createApi(EVENT_API_URL)`,
  `bookingApi = createApi(BOOKING_API_URL)`, `authApi = createApi(AUTH_API_URL)`.
- Proxy routes forward `Origin: url.origin` (must equal `PUBLIC_BASE_URL`) and
  fingerprint; token attached **only** on the promote route.
- `hooks.server.ts`: locale only (optional). **No route protection** — all pages
  are public; payment obtains its own token on demand.
- Token from OAuth stored via `@dn-fe/ui/session` (`setToken`, port-prefixed cookie),
  read server-side only for the promote proxy.

### Proxy route map (`src/routes/api/...`)
| Proxy route | Method | Backend call | Auth |
|-------------|--------|--------------|------|
| `/api/event/events` | GET | `GET /public/events` | none |
| `/api/event/events/[id]` | GET | `GET /public/events/{id}` | none |
| `/api/booking/guest-bookings` | POST | `POST /public/guest-bookings` | none |
| `/api/booking/guest-bookings/[id]` | GET | `GET /public/guest-bookings/{id}` | none |
| `/api/booking/guest-bookings/[id]/confirm` | POST | `POST /public/guest-bookings/{id}/confirm` | none |
| `/api/booking/guest-bookings/[id]/promote` | POST | `POST /guest-bookings/{id}/promote` | **Bearer** |
| `/api/booking/bookings/[id]` | GET | `GET /bookings/{id}?includes=items,capacity` | **Bearer** |

## 5. Backend contract (verified against live OpenAPI)

- **EventData** (`:5071`): `id`, `event_name`, `event_date`, `venue_name`,
  `status`, `total_seats`, `sale_start_time`, `created_at`.
  ⚠ No per-seat/price objects — the UI generates seat slots `1..total_seats`
  and assigns a client-side price (single flat price for v1).
- **Create** `POST /public/guest-bookings` — body: required `currency`,
  `guest_email`, `seats[]`, `site_origin`; for events send `resource_type:"event"`,
  `resource_id:<event id>` (omit `booking_type`/`booking_mode` → default EVENT/CAPACITY).
  Each seat: `{ item_id (uuid), item_type:"seat", price (float), metadata }`.
  Response 201 → `OkUuidResponse { status, data: { <uuid> } }`. No token returned.
- **Get** `GET /public/guest-bookings/{id}` → `GuestBookingData`: `status`
  (PENDING|CONFIRMED|PROMOTED|CANCELLED|EXPIRED|PAYMENT_EXPIRED), `expires_at`,
  `payment_expires_at`, `promoted_booking_id`, `total_amount`, `currency`, `items[]`.
- **Confirm** `POST /public/guest-bookings/{id}/confirm` — body
  `{ confirm_token, metadata }` → `OkUuidResponse`.
- **Promote** `POST /guest-bookings/{id}/promote` (Bearer) → `OkUuidResponse` (real booking id).
- **Result** `GET /bookings/{id}` → `BookingData` (`capacity`, `items`, `total_amount`, ...).

> `item_id` per seat: generate a client-side UUID (`crypto.randomUUID()`), store
> row/seat in `metadata`. Confirm whether backend requires it to reference a real
> resource — if so, adjust in Task 2 (open question below).

## 6. Screens / routes

| Route | Screen |
|-------|--------|
| `/` | Events list (`GET /api/event/events?status=UPCOMING&order_name=event_date`) |
| `/events/[id]` | Event detail + seat grid (cap `total_seats`, max 10) + guest form → create |
| `/check-email` | "Check your email to confirm" (after create) |
| `/path/confirm_booking` | Confirm from emailed link (`?guest_booking_id=&token=`) → confirm → Pay CTA |
| `/pay/[id]` | Kick off OAuth, then payment + promote |
| `/auth/callback` | OAuth code → token exchange → back to `/pay/[id]` |
| `/result/[id]` | Final confirmation (real booking via `GET /api/booking/bookings/[id]`) |

Confirm-path note: the create request sets `confirm_path:"/path/confirm_booking"`
to match the emailed link `{site_origin}{confirm_path}?guest_booking_id=&token=`.
After POSTing the token, strip it from the URL (`replaceState`) to avoid leaking it.

## 7. UI / design

Follow `.kiro/docs/DESIGN.md` tokens (indigo `#4f46e5`, system font, spacing scale,
4px/8px radii). But this is a **public storefront**, so:
- No navy admin sidebar. Use a light top header + centered content column.
- Event cards use `rounded.lg` (8px), subtle shadow allowed on public pages.
- Status states rendered with semantic colors (CONFIRMED=success, EXPIRED/PAYMENT_EXPIRED=error, PENDING=info/warning).
- Reuse `@dn-fe/ui` `Toaster`/`toast` for feedback; `fingerprint` init in root layout.

## 8. Task breakdown (incremental, each verified with `npm run check` + vitest)

### Task 0 — Scaffold + wiring
Create app dir, config files, `.env`, `src/lib/api.ts`, root scripts, `npm install`,
verify `npm run dev:event-booking` boots and `npm run check` passes.

### Task 1 — Browse: events list + detail + seat selection
- `/` list; `/events/[id]` detail with seat grid capped at `total_seats` and 10/booking.
- Proxy routes for events. Vitest: list render, seat-select, 10-seat cap.

### Task 2 — Create guest booking + "check your email"
- Guest form (email required, name optional, currency), build one `seats[]` entry
  per selected seat with `resource_type:"event"` + `resource_id`, POST via proxy,
  store returned id in localStorage, redirect to `/check-email`.
- Handle 429 / seat-cap / per-email cap / disallowed-origin errors.
- Vitest: payload shape (one item/seat, resource fields, site_origin), error branches.

### Task 3 — Confirm from emailed link
- `/path/confirm_booking` reads `guest_booking_id`+`token`, optional GET for summary
  + countdown to `expires_at`, POST confirm, strip token from URL.
- Handle EXPIRED / invalid-token. On success show CONFIRMED + Pay CTA + payment countdown.
- Vitest: token read, confirm payload, expired/invalid branches.

### Task 4 — OAuth payment + promote
- `/pay/[id]` → OAuth (authorize → `/auth/callback` exchanges code for token via `authApi`).
- With token, (mock) payment then POST promote (Bearer) via proxy; handle PAYMENT_EXPIRED.
- On success → `/result/[id]` showing real booking (`GET /api/booking/bookings/[id]`).
- Vitest: token exchange + promote mocks; assert Bearer only on authed calls; PAYMENT_EXPIRED handled.

## 9. Testing & verification
- `vitest` + mocked `fetch` per task (add `vitest` + `@testing-library/svelte` to devDeps).
- `npm run check` (svelte-check) after every task.
- Manual E2E happy path once backend origin allowlist confirmed:
  browse → seats → create → email confirm → OAuth → pay → promote → result.

## 10. Open questions (resolve before/at the noted task)
1. **App location** — confirm `apps/event-booking/` inside this monorepo (vs standalone). *(Task 0)*
2. **OAuth client_id / redirect_uri / scopes** — pull real values from backend
   `apis/auth/test.rest` / `apps/gateway/test.rest`. *(Task 4)*
3. **Origin allowlist** — is `http://localhost:5181` already in
   `GUEST_BOOKING_ALLOWED_ORIGINS` + gateway CORS, or must it be added first? *(Task 2)*
4. **Seat `item_id` semantics** — is a client-generated UUID acceptable, or must
   it reference a real seat/resource id from the backend? *(Task 2)*
5. **Pricing** — `EventData` has no price; use a single flat dev price, or is price
   sourced elsewhere? *(Task 1/2)*
