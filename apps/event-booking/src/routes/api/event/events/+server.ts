import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { eventApi } from '$lib/api';

// Public events list — no auth. Backend: GET /public/events
export const GET: RequestHandler = async ({ url, request }) => {
	const res = await eventApi('/public/events', {
		params: url.searchParams,
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};
