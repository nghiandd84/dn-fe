# Auth Server Architecture

## Overview

SvelteKit-based auth server acting as a BFF (Backend-For-Frontend) for the backend Auth API at `localhost:6001/auth`.

## Tech Stack

- **Framework:** SvelteKit (Svelte 5) with TypeScript
- **Adapter:** `@sveltejs/adapter-node`
- **Fingerprint:** `@fingerprintjs/fingerprintjs`
- **Backend API:** `http://localhost:6001/auth` (configurable via `AUTH_API_URL` env var)

## Architecture Diagram

```
Browser (Fingerprint + UI)
    │
    ▼
SvelteKit BFF (localhost:5173)
├── hooks.server.ts (locale resolution + route protection)
├── /api/auth/*     (public: login, register, logout)
├── /api/oauth/*    (public: authorize, token, verify)
└── /api/admin/*    (protected: CRUD for all resources)
    │
    ▼
Backend Auth API (localhost:6001/auth)
```

## Session Management

- Token stored in HTTP-only cookie (`auth_token`)
- Cookie config: `httpOnly`, `sameSite: lax`, `path: /`, 7-day expiry
- Token never exposed to client-side JavaScript
- BFF reads cookie and forwards as `Authorization: Bearer <token>` to backend

## Route Protection

- `hooks.server.ts` intercepts all `/api/admin/*` requests
- Extracts token from cookie, verifies via backend `/public/tokens/verify`
- If invalid/missing → returns 401
- Attaches `user_id` and `client_id` to `event.locals`

## Fingerprint

- `@fingerprintjs/fingerprintjs` loaded on page mount (root layout)
- `visitorId` stored in Svelte store
- Sent as `X-Client-Fingerprint` header with every request
- BFF forwards header to backend for anomaly detection
