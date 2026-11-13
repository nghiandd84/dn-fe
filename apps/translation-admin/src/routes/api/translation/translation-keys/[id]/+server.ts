import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { api } from '$lib/api';

export const GET: RequestHandler = async ({ params, request, url, locals }) => {
	const res = await api(`/translation-keys/${params.id}`, {
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		token: locals.token,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};

export const PATCH: RequestHandler = async ({ params, request, url, locals }) => {
	const body = await request.json();
	const res = await api(`/translation-keys/${params.id}`, {
		method: 'PATCH',
		body,
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		token: locals.token,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};

export const DELETE: RequestHandler = async ({ params, request, url, locals }) => {
	const res = await api(`/translation-keys/${params.id}`, {
		method: 'DELETE',
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		token: locals.token,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};
