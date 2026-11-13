# Browser Fingerprint

## Purpose

The auth server collects a browser fingerprint to support the gateway's anomaly detection system. The fingerprint is sent as `X-Client-Fingerprint` header with every request, allowing the gateway to identify clients beyond IP address.

## Implementation

**Library:** `@fingerprintjs/fingerprintjs` (open-source)

**Client-side (`src/lib/fingerprint.ts`):**
- Loads FingerprintJS on page mount (root `+layout.svelte`)
- Generates a `visitorId` (hex string, 32+ chars)
- Stores in a Svelte writable store

**Request flow:**
1. Browser generates fingerprint on first page load
2. Every fetch request includes `X-Client-Fingerprint: {visitorId}` header
3. BFF server routes forward the header to the backend API
4. Gateway's anomaly detector uses it as primary client identity (`cfp:` prefix)

## Identity Priority (gateway side)

| Priority | Source | Key Prefix |
|----------|--------|------------|
| 1 | `X-Client-Fingerprint` header | `cfp:` |
| 2 | `Authorization: Bearer <token>` | `user:` |
| 3 | IP + User-Agent + Accept-Language | `fp:` |
| 4 | Client IP address | `ip:` |

## Files

- `src/lib/fingerprint.ts` — store + init function
- `src/routes/+layout.svelte` — calls `initFingerprint()` on mount
- `src/lib/components/CrudTable.svelte` — attaches header to all admin requests
- `src/routes/login/+page.svelte` — attaches header to login request
- `src/routes/register/+page.svelte` — attaches header to register request
