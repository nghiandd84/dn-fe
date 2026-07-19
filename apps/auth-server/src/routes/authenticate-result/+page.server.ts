import { redirect } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import { api } from '$lib/api';
import { getToken, setToken } from '$lib/session';

const AUTH_RESOURCE_MAP: Record<string, string> = {
	'AUTH:USER': 'users',
	'AUTH:ROLE': 'roles',
	'AUTH:PERMISSION': 'permissions',
	'AUTH:FIELD_PERMISSION': 'field-permissions',
	'AUTH:SCOPE': 'scopes',
	'AUTH:CLIENT': 'clients',
	'AUTH:TOKEN': 'tokens',
	'AUTH:AUTH_CODE': 'auth-codes',
};

function decodeJwtPayload(token: string) {
	const payload = token.split('.')[1];
	return JSON.parse(Buffer.from(payload, 'base64url').toString());
}

async function fetchPermissions(access_token: string, origin: string) {
	const payload = decodeJwtPayload(access_token);
	const roleNames: string[] = (payload.dn_data?.accesses ?? []).map((a: { role_name: string }) => a.role_name);

	if (!roleNames.length) return [];

	const rolesRes = await api(`/roles`, {
		params: new URLSearchParams({ name: `in|${roleNames.join(',')}`, includes: 'permissions' }),
		token: access_token,
		origin
	});
	console.log('rolesRes', rolesRes);
	if (rolesRes.status !== 200) return [];

	const roles = rolesRes.data.data?.result ?? [];
	const seen = new Set<string>();
	const permissions: { id: string; resource: string; description: string; mask: number }[] = [];

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

function redirectIfAdmin(permissions: { resource: string }[], cookies: Cookies, clientId: string) {
	const authResources = permissions
		.filter((p) => p.resource.startsWith('AUTH:'))
		.map((p) => AUTH_RESOURCE_MAP[p.resource])
		.filter(Boolean);
	console.log(authResources);
	if (authResources.length > 0) {
		// Persist resolved nav keys so the admin layout can read them after redirect
		cookies.set('auth_resources', JSON.stringify(authResources), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 60 * 60 * 24 * 7
		});
		// Persist client_id so logout can redirect back to the correct authenticate URL
		if (clientId) {
			cookies.set('auth_client_id', clientId, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: false,
				maxAge: 60 * 60 * 24 * 7
			});
		}
		throw redirect(302, '/admin');
	}
}

function saveTokens(cookies: Cookies, access_token: string, refresh_token: string) {
	setToken(cookies, access_token);
	cookies.set('refresh_token', refresh_token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: false,
		maxAge: 60 * 60 * 24 * 30
	});
}

export async function load({ url, cookies }) {
	const clientId = url.searchParams.get('client_id') || '';
	const authCode = url.searchParams.get('auth_code');

	// 1. auth_code present in URL — exchange it for tokens (one-time use, highest priority)
	if (authCode) {
		const res = await api('/public/tokens/oauth', {
			method: 'POST',
			body: { client_id: clientId, code: authCode, grant_type: 'authorization_code' },
			origin: url.origin
		});

		if (res.status !== 200) {
			return { error: res.data?.data?.error_type || 'token_failed', access_token: null, refresh_token: null, permissions: [] };
		}

		const { access_token, refresh_token } = res.data.data;
		saveTokens(cookies, access_token, refresh_token);

		const permissions = await fetchPermissions(access_token, url.origin);
		redirectIfAdmin(permissions, cookies, clientId);
		return { error: null, access_token, refresh_token, permissions };
	}

	// 2. No auth_code — check for existing access token in cookies
	const existingAccessToken = getToken(cookies);
	const existingRefreshToken = cookies.get('refresh_token');

	if (existingAccessToken) {
		const permissions = await fetchPermissions(existingAccessToken, url.origin);
		redirectIfAdmin(permissions, cookies, clientId);
		return { error: null, access_token: existingAccessToken, refresh_token: existingRefreshToken ?? null, permissions };
	}

	// 3. No access token — try refresh token
	if (existingRefreshToken) {
		const res = await api('/public/tokens/oauth', {
			method: 'POST',
			body: { client_id: clientId, refresh_token: existingRefreshToken, grant_type: 'refresh_token' },
			origin: url.origin
		});

		if (res.status === 200) {
			const { access_token, refresh_token } = res.data.data;
			saveTokens(cookies, access_token, refresh_token);
			const permissions = await fetchPermissions(access_token, url.origin);
			redirectIfAdmin(permissions, cookies, clientId);
			return { error: null, access_token, refresh_token, permissions };
		}

		// Refresh token expired/invalid — clear it
		cookies.delete('refresh_token', { path: '/' });
	}

	// 4. No tokens and no auth_code — cannot proceed
	return { error: 'missing_auth_code', access_token: null, refresh_token: null, permissions: [] };
}
