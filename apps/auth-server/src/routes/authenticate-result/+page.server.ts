import { redirect } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import { api } from '$lib/api';
import { handleAuthResult, type Permission } from '@dn-fe/ui/auth-result';

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

function onPermissions(permissions: Permission[], cookies: Cookies, clientId: string) {
	const authResources = permissions
		.filter((p) => p.resource.startsWith('AUTH:'))
		.map((p) => AUTH_RESOURCE_MAP[p.resource])
		.filter(Boolean);

	if (authResources.length > 0) {
		cookies.set('auth_resources', JSON.stringify(authResources), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 60 * 60 * 24 * 7
		});
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

export async function load({ url, cookies, request }) {
	return handleAuthResult({
		api,
		cookies,
		url,
		origin: url.origin,
		onPermissions
	});
}
