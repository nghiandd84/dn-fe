import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { bookingApi } from '$lib/api';

// Fetch a guest booking summary — no auth. Backend: GET /public/guest-bookings/{id}
export const GET: RequestHandler = async ({ params, url, request }) => {
	const res = await bookingApi(`/public/guest-bookings/${params.id}`, {
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};
