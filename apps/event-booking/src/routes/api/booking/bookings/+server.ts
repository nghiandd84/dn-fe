import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { bookingApi } from '$lib/api';
import { getToken } from '@dn-fe/ui/session';

// List the signed-in user's own bookings. Requires the OAuth bearer token.
// Backend: GET /bookings/me — scopes to the authenticated user (via forwarded
// identity). Note: GET /bookings returns ALL bookings and must not be used here.
export const GET: RequestHandler = async ({ url, request, cookies }) => {
	const token = getToken(cookies, url);
	if (!token) {
		return json({ status: 401, data: { error_type: 'unauthenticated' } }, { status: 401 });
	}

	const res = await bookingApi('/bookings/me', {
		params: url.searchParams,
		token,
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};
