import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { api } from '$lib/api';
import { getToken } from '$lib/session';

export const POST: RequestHandler = async ({ params, request, cookies, url }) => {
	const body = await request.json();
	const res = await api(`/roles/${params.id}/unassign-permissions`, {
		method: 'POST',
		body,
		token: getToken(cookies),
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};
