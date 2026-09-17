# dn-fe

npm workspaces monorepo for SvelteKit admin applications. Each app is an independent admin panel that communicates with a backend microservice via a gateway (`localhost:6001`) and shares OAuth authentication through `auth-server`.

## Architecture

```
dn-fe/
├── apps/
│   ├── auth-server/           # OAuth server — login, register, token issuance
│   ├── lookup-admin/          # Manage lookup data (categories, options)
│   ├── profile-admin/         # Manage user profiles
│   ├── email-template-admin/  # Manage email templates & placeholders
│   ├── event-admin/           # Manage events
│   ├── translation-admin/     # Manage i18n translations
│   ├── booking-admin/         # Manage bookings, booking items, history
│   ├── url-shortener-admin/   # Manage short URLs
│   └── tagging-admin/         # Manage tags, tag groups, entity tags
└── packages/
    ├── ui/                    # Shared component library (CrudTable, SidebarFooter, etc.)
    └── otel/                  # OpenTelemetry instrumentation
```

### How it works

- All admin apps authenticate via `auth-server` using an OAuth authorization code flow
- After login, permissions are stored in cookies and control which resources are visible per app
- API calls are proxied through SvelteKit server routes (`/api/<service>/...`) which attach the auth token before forwarding to the backend gateway at `http://localhost:6001`
- Shared UI components and styles live in `packages/ui`
- OpenTelemetry tracing is provided by `packages/otel`

## Apps

| App | Port | Description |
|-----|------|-------------|
| `auth-server` | 5173 | OAuth server — handles login, registration, token verification |
| `lookup-admin` | 5174 | Manage lookup values used across services |
| `profile-admin` | 5175 | Manage user profile data |
| `email-template-admin` | 5176 | Manage email templates, placeholders, and translations |
| `event-admin` | 5177 | Manage events |
| `booking-admin` | 5178 | Manage bookings, booking items, and lifecycle history |
| `translation-admin` | 5179 | Manage i18n translation keys and values |
| `url-shortener-admin` | 5120 | Manage short URL mappings |
| `tagging-admin` | 5180 | Manage tag groups, tags, and entity tag associations |

## Getting Started

Install all dependencies from the root:

```sh
npm install
```

Copy `.env` for each app you want to run (each app has its own `.env` file in its directory) and configure the required variables.

## Development

```sh
# Run a specific app
npm run dev:auth
npm run dev:lookup
npm run dev:profile
npm run dev:email-template
npm run dev:event
npm run dev:booking
npm run dev:translation
npm run dev:url-shortener
npm run dev:tagging

# Run all apps simultaneously
npm run dev:all
```

## Building

```sh
# Build a specific app
npm run build:auth
npm run build:lookup
npm run build:profile
npm run build:email-template
npm run build:event
npm run build:booking
npm run build:translation
npm run build:url-shortener
npm run build:tagging

# Build all apps
npm run build:all
```

## Running in Production

Each app is built with `@sveltejs/adapter-node` and started with Node, loading its own `.env`:

```sh
npm run start:auth
npm run start:lookup
npm run start:profile
npm run start:email-template
npm run start:event
npm run start:booking
npm run start:translation
npm run start:url-shortener
npm run start:tagging
```

## Type Checking

```sh
# Check all apps
npm run check:all

# Check a specific app
npm run check --workspace=apps/tagging-admin
```

## Environment Variables

Each app requires its own `.env` file. Common variables across admin apps:

| Variable | Description |
|----------|-------------|
| `*_API_URL` | Backend service URL (via gateway, e.g. `http://localhost:6001/api/<service>`) |
| `AUTH_API_URL` | Auth service URL for token verification |
| `AUTH_SERVER_URL` | Base URL of `auth-server` for OAuth redirects |
| `AUTH_CLIENT_ID` | OAuth client ID registered in `auth-server` |
| `AUTH_CALLBACK_URL` | OAuth redirect callback URL |
| `AUTH_SCOPES` | OAuth scopes to request (comma-separated) |
| `PUBLIC_BASE_URL` | Public base URL of this app |
| `PORT` | HTTP port to listen on |
| `ORIGIN` | Required by adapter-node for CSRF validation |
| `OTEL_SERVICE_NAME` | Service name for OpenTelemetry traces |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP collector endpoint |

## Adding a New App

```sh
cd apps
npx sv create my-new-app
```

Then from the root:

```sh
npm install
```

Add `dev`, `build`, and `start` scripts to the root `package.json` following the existing pattern, and create a `.env` file in the new app's directory.
