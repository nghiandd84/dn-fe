import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { api } from '$lib/api';
import { getToken } from '$lib/session';

export const POST: RequestHandler = async ({ params, request, url, cookies }) => {
	const body = await request.json();
	const res = await api(`/users/${params.id}/assign-roles`, {
		method: 'POST',
		body,
		token: getToken(cookies, url),
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};
