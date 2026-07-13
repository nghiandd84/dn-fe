import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { api } from '$lib/api';
import { getToken } from '$lib/session';

export const GET: RequestHandler = async ({ url, cookies, request }) => {
	const res = await api('/roles', {
		token: getToken(cookies),
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		params: url.searchParams,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};

export const POST: RequestHandler = async ({ request, cookies, url }) => {
	const body = await request.json();
	const res = await api('/roles', {
		method: 'POST',
		body,
		token: getToken(cookies),
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};
