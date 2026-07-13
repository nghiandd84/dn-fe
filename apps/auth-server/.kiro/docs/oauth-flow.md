# OAuth Flow

## Overview

The auth server implements an OAuth authorization code flow for both login and signup, using a series of page routes that exchange credentials for tokens.

## Routes

| Route | Purpose |
|-------|---------|
| `/authenticate` | Login / signup entry point; requires `client_id` query param |
| `/login-verify` | Email login code verification (step 2 of login) |
| `/activate` | Email activation code verification (step 2 of signup) |
| `/authenticate-result` | Exchanges `auth_code` for `access_token` + `refresh_token` |

## Login Flow

```
/authenticate?client_id=xxx
  → POST /public/requests/login  { email, password, state }
  → redirect /login-verify?user_id=xxx&client_id=xxx

/login-verify
  → POST /public/login/code  { user_id, login_code }
  → returns { auth_code, redirect_uri }
  → redirect {redirect_uri}?auth_code=xxx&client_id=xxx

/authenticate-result?auth_code=xxx&client_id=xxx
  → POST /public/tokens/oauth  { client_id, code: auth_code, grant_type: "authorization_code" }
  → stores tokens, displays result
```

## Signup Flow

```
/authenticate?client_id=xxx
  → saves client_id to sessionStorage on submit
  → POST /public/requests/register  { email, password, language, state }
  → redirect /activate?user_id=xxx

/activate
  → reads client_id from sessionStorage (hidden form input)
  → POST /public/signup/active  { user_id, code }
  → returns { auth_code, redirect_uri }
  → redirect {redirect_uri}?auth_code=xxx&client_id=xxx

/authenticate-result?auth_code=xxx&client_id=xxx
  → POST /public/tokens/oauth  { client_id, code: auth_code, grant_type: "authorization_code" }
  → stores tokens, displays result
```

## Token Exchange (`/authenticate-result`)

1. Calls `POST /public/tokens/oauth` with `auth_code` and `client_id`
2. Stores `access_token` in HTTP-only cookie (`auth_token`, 7-day expiry)
3. Stores `refresh_token` in HTTP-only cookie (`refresh_token`, 30-day expiry)
4. Saves both to `sessionStorage` for client-side JS access
5. Decodes JWT payload (`dn_data`) to extract role names
6. Calls `GET /api/auth/roles?name=in|{roles}&includes=permissions` to fetch all permissions
7. Displays tokens and permissions table on the page

## JWT Payload Structure

```json
{
  "dn_data": {
    "user_id": "...",
    "client_id": "...",
    "accesses": [{ "role_name": "ADMIN_AUTH", "key": "" }]
  },
  "exp": 0,
  "iat": 0,
  "jti": "..."
}
```

## Permission Structure

```ts
{ id: string, resource: string, description: string, mask: number }
```

## client_id Propagation

- **Login:** passed as hidden form field from `/authenticate` → server action reads `form.get('client_id')` → appended to `/login-verify` redirect URL → hidden form field in login-verify form → appended to final `redirect_uri`
- **Signup:** saved to `sessionStorage` on form submit → read in `/activate` via `$effect` → hidden form field → appended to final `redirect_uri`

## Redirect URI Handling

All redirects to external `redirect_uri` values use `new URL(redirect_uri)` + `searchParams.set()` to safely append params regardless of whether the URI already contains query parameters.
