import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { api } from '$lib/api';

export const GET: RequestHandler = async ({ url, request }) => {
	const res = await api('/lookup-types', {
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		params: url.searchParams,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};

export const POST: RequestHandler = async ({ request, url }) => {
	const body = await request.json();
	const res = await api('/lookup-types', {
		method: 'POST',
		body,
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};
