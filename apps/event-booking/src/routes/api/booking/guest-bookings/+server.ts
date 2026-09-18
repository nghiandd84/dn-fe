import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { bookingApi } from '$lib/api';

// Create a guest booking — no auth. Backend: POST /public/guest-bookings
// The confirm token is emailed out-of-band; the response returns only the id.
export const POST: RequestHandler = async ({ request, url }) => {
	const body = await request.json();
	const res = await bookingApi('/public/guest-bookings', {
		method: 'POST',
		body,
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};
