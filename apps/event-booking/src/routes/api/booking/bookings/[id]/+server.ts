import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { bookingApi } from '$lib/api';
import { getToken } from '@dn-fe/ui/session';

// Fetch a promoted (real) booking. Requires the OAuth bearer token.
// Backend: GET /bookings/{id}
export const GET: RequestHandler = async ({ params, request, url, cookies }) => {
	const token = getToken(cookies, url);
	if (!token) {
		return json({ status: 401, data: { error_type: 'unauthenticated' } }, { status: 401 });
	}

	const res = await bookingApi(`/bookings/${params.id}`, {
		token,
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};
