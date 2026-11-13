import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { api } from '$lib/api';

// Promote a CONFIRMED guest booking into a real booking. Authenticated: the
// backend records the acting user as the booking owner. Not under /public.
export const POST: RequestHandler = async ({ params, request, url, locals }) => {
	const res = await api(`/guest-bookings/${params.id}/promote`, {
		method: 'POST',
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		token: locals.token,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};
