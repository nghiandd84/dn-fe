import { redirect } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import { AUTH_CLIENT_ID } from '$env/static/private';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { authApi } from '$lib/api';
import { handleAuthResult, type Permission } from '@dn-fe/ui/auth-result';
import { cookiePrefix } from '@dn-fe/ui/session';

const BOOKING_RESOURCE_MAP: Record<string, string> = {
	'BOOKING:BOOKING': 'bookings',
	'BOOKING:SEAT': 'booking-seats',
	'BOOKING:SLOT': 'slots'
};

function onPermissions(permissions: Permission[], cookies: Cookies, clientId: string, port: string | URL) {
	const prefix = cookiePrefix(port);
	const bookingResources = permissions
		.filter((p) => p.resource.startsWith('BOOKING:'))
		.map((p) => BOOKING_RESOURCE_MAP[p.resource])
		.filter(Boolean);
	if (bookingResources.length > 0) {
		cookies.set(`${prefix}resources`, JSON.stringify(bookingResources), {
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
