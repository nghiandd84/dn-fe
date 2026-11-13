import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { bookingApi } from '$lib/api';
import { getToken } from '@dn-fe/ui/session';

// Promote a confirmed guest booking to a real booking. Requires the OAuth
// bearer token obtained during payment. Backend: POST /guest-bookings/{id}/promote
export const POST: RequestHandler = async ({ params, request, url, cookies }) => {
	const token = getToken(cookies, url);
	if (!token) {
		return json({ status: 401, data: { error_type: 'unauthenticated' } }, { status: 401 });
	}

	const res = await bookingApi(`/guest-bookings/${params.id}/promote`, {
		method: 'POST',
		token,
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};
