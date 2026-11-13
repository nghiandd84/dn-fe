# API Calling Convention

## Rule: Always use `createApi` — never raw `fetch`

All API calls in this project **must** use the `createApi` utility from `@dn-fe/ui/api`.  
Never use the native `fetch()` function directly for backend API calls.

---

## Setup

Each app has a pre-configured `api` instance in `src/lib/api.ts`:

```ts
import { createApi } from '@dn-fe/ui/api';
import { LOOKUP_API_URL } from '$env/static/private';

export const api = createApi(LOOKUP_API_URL);
```

Import and use this instance — do not call `createApi` again inline.

---

## Usage

```ts
import { api } from '$lib/api';

// GET with query params
const res = await api('/lookup-types', {
  params: url.searchParams,
  token: locals.token,
  origin: url.origin
});

// POST with body
const res = await api('/lookup-types', {
  method: 'POST',
  body: { code: 'USD', name: 'US Dollar' },
  token: locals.token,
  origin: url.origin
});

// PATCH
const res = await api(`/lookup-types/${id}`, {
  method: 'PATCH',
  body: { name: 'Updated' },
  token: locals.token,
  origin: url.origin
});

// DELETE
const res = await api(`/lookup-types/${id}`, {
  method: 'DELETE',
  token: locals.token,
  origin: url.origin
});
```

---

## Options reference (`ApiOptions`)

| Option        | Type              | Description                              |
|---------------|-------------------|------------------------------------------|
| `method`      | `string`          | HTTP verb. Defaults to `'GET'`           |
| `body`        | `unknown`         | Request body — serialized to JSON        |
| `token`       | `string`          | Sets `Authorization: Bearer <token>`     |
| `fingerprint` | `string`          | Sets `X-Client-Fingerprint` header       |
| `params`      | `URLSearchParams` | Appended to the URL as query string      |
| `origin`      | `string`          | Sets `Origin` header                     |

---

## Always include these options in server routes (`+server.ts`)

```ts
{
  token: locals.token,       // forward auth token
  origin: url.origin,        // forward origin header
  fingerprint: request.headers.get('x-client-fingerprint') || undefined
}
```

---

## Client-side (Svelte components)

On the client, API calls go through the SvelteKit proxy routes (`/api/...`),  
not directly to the backend. Use `fetch()` **only** for these internal proxy calls:

```ts
// ✅ OK — calling SvelteKit proxy route from browser
const res = await fetch(`/api/lookup/lookup-types?${params}`, {
  headers: { 'X-Client-Fingerprint': get(fingerprint) }
});

// ❌ Never — calling backend directly from browser
const res = await fetch('http://localhost:6001/api/lookup/lookup-types');
```

The proxy routes (`src/routes/api/...`) then use `api()` internally to forward to the backend.
