import { redirect } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import { AUTH_CLIENT_ID } from '$env/static/private';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { authApi } from '$lib/api';
import { handleAuthResult, type Permission } from '@dn-fe/ui/auth-result';
import { cookiePrefix } from '@dn-fe/ui/session';

const EMAIL_TEMPLATE_RESOURCE_MAP: Record<string, string> = {
	'EMAIL_TEMPLATE:EMAIL_TEMPLATE': 'email-templates',
	'EMAIL_TEMPLATE:TEMPLATE_TRANSLATION': 'template-placeholders',
	'EMAIL_TEMPLATE:TEMPLATE_PLACEHOLDER': 'template-translations'
};

function onPermissions(permissions: Permission[], cookies: Cookies, clientId: string, port: string | URL) {
	const prefix = cookiePrefix(port);
	const emailTemplatePerms = permissions.filter((p) => p.resource.startsWith('EMAIL_TEMPLATE:'));
	const emailTemplateResources = emailTemplatePerms
		.map((p) => EMAIL_TEMPLATE_RESOURCE_MAP[p.resource])
		.filter(Boolean);
	if (emailTemplateResources.length > 0) {
		cookies.set(`${prefix}resources`, JSON.stringify(emailTemplateResources), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 60 * 60 * 24 * 7
		});
		const authMasks: Record<string, number> = {};
		for (const p of emailTemplatePerms) {
			const resource = EMAIL_TEMPLATE_RESOURCE_MAP[p.resource];
			if (resource) authMasks[resource] = p.mask;
		}
		cookies.set(`${prefix}auth_masks`, JSON.stringify(authMasks), {
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
