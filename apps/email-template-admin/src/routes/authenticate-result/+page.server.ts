import { redirect } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import { AUTH_CLIENT_ID } from '$env/static/private';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { authApi } from '$lib/api';
import { handleAuthResult, type Permission } from '@dn-fe/ui/auth-result';

const EMAIL_TEMPLATE_RESOURCE_MAP: Record<string, string> = {
	'EMAIL_TEMPLATE:EMAIL_TEMPLATE': 'email-templates',
	'EMAIL_TEMPLATE:TEMPLATE_TRANSLATION': 'template-placeholders',
	'EMAIL_TEMPLATE:TEMPLATE_PLACEHOLDER': 'template-translations'
};

function onPermissions(permissions: Permission[], cookies: Cookies, clientId: string) {
	const emailTemplateResources = permissions
		.filter((p) => p.resource.startsWith('EMAIL_TEMPLATE:'))
		.map((p) => EMAIL_TEMPLATE_RESOURCE_MAP[p.resource])
		.filter(Boolean);
	if (emailTemplateResources.length > 0) {
		cookies.set('email_template_resources', JSON.stringify(emailTemplateResources), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 60 * 60 * 24 * 7
		});
		if (clientId) {
			cookies.set('email_template_client_id', clientId, {
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
