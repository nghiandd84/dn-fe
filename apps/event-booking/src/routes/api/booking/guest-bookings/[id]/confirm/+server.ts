import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { bookingApi } from '$lib/api';

// Confirm a guest booking with the emailed one-time token — no auth.
// Backend: POST /public/guest-bookings/{id}/confirm  body: { confirm_token, metadata? }
export const POST: RequestHandler = async ({ params, request, url }) => {
	const body = await request.json();
	const res = await bookingApi(`/public/guest-bookings/${params.id}/confirm`, {
		method: 'POST',
		body,
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};
