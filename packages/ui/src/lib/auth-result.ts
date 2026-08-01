import { redirect } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import { setToken, clearToken, cookiePrefix } from './session.js';
import type { ApiFn } from './api.js';

// ── Types ────────────────────────────────────────────────────────────────────

export interface Permission {
	id: string;
	resource: string;
	description: string;
	mask: number;
}

export interface AuthResultData {
	error: string | null;
	access_token: string | null;
	refresh_token: string | null;
	permissions: Permission[];
}

// ── Token helpers ────────────────────────────────────────────────────────────

export function saveTokens(
	cookies: Cookies,
	access_token: string,
	refresh_token: string,
	port: string | URL = ''
) {
	const prefix = cookiePrefix(port);
	setToken(cookies, access_token, port);
	cookies.set(`${prefix}refresh_token`, refresh_token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: false,
		maxAge: 60 * 60 * 24 * 30
	});
}

export function clearTokens(cookies: Cookies, port: string | URL = '') {
	const prefix = cookiePrefix(port);
	clearToken(cookies, port);
	cookies.delete(`${prefix}refresh_token`, { path: '/' });
}

// ── Token exchange ───────────────────────────────────────────────────────────

export async function exchangeAuthCode(api: ApiFn, clientId: string, authCode: string, origin?: string) {
	return api('/public/tokens/oauth', {
		method: 'POST',
		body: { client_id: clientId, code: authCode, grant_type: 'authorization_code' },
		origin
	});
}

export async function refreshAccessToken(api: ApiFn, clientId: string, refreshToken: string) {
	return api('/public/tokens/oauth', {
		method: 'POST',
		body: { client_id: clientId, refresh_token: refreshToken, grant_type: 'refresh_token' }
	});
}

// ── Permissions ──────────────────────────────────────────────────────────────

function decodeJwtPayload(token: string) {
	const payload = token.split('.')[1];
	return JSON.parse(Buffer.from(payload, 'base64url').toString());
}

export async function fetchPermissions(
	api: ApiFn,
	access_token: string,
	origin: string
): Promise<Permission[]> {
	const payload = decodeJwtPayload(access_token);
	const roleNames: string[] = (payload.dn_data?.accesses ?? []).map(
		(a: { role_name: string }) => a.role_name
	);

	if (!roleNames.length) return [];

	const res = await api('/roles', {
		params: new URLSearchParams({ name: `in|${roleNames.join(',')}`, includes: 'permissions' }),
		token: access_token,
		origin
	});

	if (res.status !== 200) return [];

	const roles = res.data.data?.result ?? [];
	const seen = new Set<string>();
	const permissions: Permission[] = [];

	for (const role of roles) {
		for (const p of role.permissions ?? []) {
			if (!seen.has(p.id)) {
				seen.add(p.id);
				permissions.push(p);
			}
		}
	}

	return permissions;
}

// ── Main load handler ────────────────────────────────────────────────────────

export interface AuthResultOptions {
	/** Pre-configured api function from the app's $lib/api */
	api: ApiFn;
	/** Cookies from the SvelteKit event */
	cookies: Cookies;
	/** URL of the current request */
	url: URL;
	/** Origin of the current request */
	origin: string;
	/**
	 * Called after tokens + permissions are resolved.
	 * Throw a redirect here if the user has sufficient access.
	 * If you do not throw, the result data is returned to the page for display.
	 */
	onPermissions: (permissions: Permission[], cookies: Cookies, clientId: string) => void;
	/** Default client_id fallback if not in URL params */
	defaultClientId?: string;
}

export async function handleAuthResult(opts: AuthResultOptions): Promise<AuthResultData> {
	const { api, cookies, url, origin, onPermissions, defaultClientId = '' } = opts;
	console.log(opts);

	// Use the request's port to scope all cookie reads/writes to this app instance
	const port = url;

	const clientId = url.searchParams.get('client_id') || defaultClientId;
	const authCode = url.searchParams.get('auth_code');
	const prefix = cookiePrefix(port);
	const existingAccessToken = cookies.get(`${prefix}auth_token`);
	const existingRefreshToken = cookies.get(`${prefix}refresh_token`);

	// 1. auth_code in URL — exchange it (one-time, highest priority)
	if (authCode) {
		const res = await exchangeAuthCode(api, clientId, authCode, origin);

		if (res.status !== 200) {
			return { error: res.data?.data?.error_type || 'token_failed', access_token: null, refresh_token: null, permissions: [] };
		}

		const { access_token, refresh_token } = res.data.data;
		saveTokens(cookies, access_token, refresh_token, port);

		const permissions = await fetchPermissions(api, access_token, origin);
		onPermissions(permissions, cookies, clientId);
		return { error: null, access_token, refresh_token, permissions };
	}

	// 2. Existing access token in cookie
	if (existingAccessToken) {
		const permissions = await fetchPermissions(api, existingAccessToken, origin);
		onPermissions(permissions, cookies, clientId);
		return { error: null, access_token: existingAccessToken, refresh_token: existingRefreshToken ?? null, permissions };
	}

	// 3. No access token — try refresh
	if (existingRefreshToken) {
		const res = await refreshAccessToken(api, clientId, existingRefreshToken);

		if (res.status === 200) {
			const { access_token, refresh_token } = res.data.data;
			saveTokens(cookies, access_token, refresh_token, port);
			const permissions = await fetchPermissions(api, access_token, origin);
			onPermissions(permissions, cookies, clientId);
			return { error: null, access_token, refresh_token, permissions };
		}

		cookies.delete(`${prefix}refresh_token`, { path: '/' });
	}

	// 4. Nothing available
	return { error: 'missing_auth_code', access_token: null, refresh_token: null, permissions: [] };
}
