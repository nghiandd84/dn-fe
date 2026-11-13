import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { eventApi } from '$lib/api';

// Single public event — no auth. Backend: GET /public/events/{id}
export const GET: RequestHandler = async ({ params, url, request }) => {
	const res = await eventApi(`/public/events/${params.id}`, {
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};
