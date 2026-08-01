import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { api } from '$lib/api';
import { getToken } from '$lib/session';

export const GET: RequestHandler = async ({ url, cookies, request }) => {
	const res = await api('/users', {
		token: getToken(cookies, url),
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		params: url.searchParams,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};
