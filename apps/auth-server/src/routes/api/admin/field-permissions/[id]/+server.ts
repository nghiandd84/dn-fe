import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { api } from '$lib/api';
import { getToken } from '$lib/session';

export const GET: RequestHandler = async ({ params, cookies, request, url }) => {
	const res = await api(`/field-permissions/${params.id}`, {
		token: getToken(cookies),
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};

export const PATCH: RequestHandler = async ({ params, request, cookies, url }) => {
	const body = await request.json();
	const res = await api(`/field-permissions/${params.id}`, {
		method: 'PATCH',
		body,
		token: getToken(cookies),
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};

export const DELETE: RequestHandler = async ({ params, cookies, request, url }) => {
	const res = await api(`/field-permissions/${params.id}`, {
		method: 'DELETE',
		token: getToken(cookies),
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};
