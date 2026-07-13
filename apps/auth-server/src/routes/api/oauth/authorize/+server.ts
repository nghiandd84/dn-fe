import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { api } from '$lib/api';

export const POST: RequestHandler = async ({ request, url }) => {
	const body = await request.json();
	const fingerprint = request.headers.get('x-client-fingerprint') || undefined;

	const res = await api('/public/requests/code', {
		method: 'POST',
		body,
		fingerprint,
		origin: url.origin
	});

	return json(res.data, { status: res.status });
};
