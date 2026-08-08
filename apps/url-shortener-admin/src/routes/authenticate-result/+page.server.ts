import { redirect } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import { AUTH_CLIENT_ID } from '$env/static/private';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { authApi } from '$lib/api';
import { handleAuthResult, type Permission } from '@dn-fe/ui/auth-result';
import { cookiePrefix } from '@dn-fe/ui/session';

const URL_SHORTENER_RESOURCE_MAP: Record<string, string> = {
	'URL_SHORTENER:URL': 'urls',
	'URL_SHORTENER:API_KEY': 'api-keys',
	'URL_SHORTENER:ANALYTICS': 'url-clicks'
};

function onPermissions(permissions: Permission[], cookies: Cookies, clientId: string, port: string | URL) {
	const prefix = cookiePrefix(port);
	const urlShortenerResources = permissions
		.filter((p) => p.resource.startsWith('URL_SHORTENER:'))
		.map((p) => URL_SHORTENER_RESOURCE_MAP[p.resource])
		.filter(Boolean);
	if (urlShortenerResources.length > 0) {
		cookies.set(`${prefix}resources`, JSON.stringify(urlShortenerResources), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 60 * 60 * 24 * 7
		});
		if (clientId) {
			cookies.set(`${prefix}client_id`, clientId, {
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

export async function load({ url, cookies }) {
	return handleAuthResult({
		api: authApi,
		cookies,
		url,
		origin: PUBLIC_BASE_URL,
		onPermissions: (permissions, cookies, clientId) =>
			onPermissions(permissions, cookies, clientId, url),
		defaultClientId: AUTH_CLIENT_ID
	});
}
