import { redirect } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import { AUTH_CLIENT_ID } from '$env/static/private';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { authApi } from '$lib/api';
import { handleAuthResult, type Permission } from '@dn-fe/ui/auth-result';

const PROFILE_RESOURCE_MAP: Record<string, string> = {
	'PROFILE:PROFILE': 'profiles',
	'PROFILE:PREFERENCE': 'user-preferences',
	'PROFILE:SOCIAL_LINK': 'social-links',
};

function onPermissions(permissions: Permission[], cookies: Cookies, clientId: string) {
	const profileResources = permissions
		.filter((p) => p.resource.startsWith('PROFILE:'))
		.map((p) => PROFILE_RESOURCE_MAP[p.resource])
		.filter(Boolean);
	if (profileResources.length > 0) {
		cookies.set('profile_resources', JSON.stringify(profileResources), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 60 * 60 * 24 * 7
		});
		if (clientId) {
			cookies.set('profile_client_id', clientId, {
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
		onPermissions,
		defaultClientId: AUTH_CLIENT_ID
	});
}
