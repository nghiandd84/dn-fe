import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { api } from '$lib/api';

export const GET: RequestHandler = async ({ params, request, url }) => {
	const res = await api(`/lookup-types/${params.type_code}/items/${params.item_id}`, {
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};

export const PATCH: RequestHandler = async ({ params, request, url }) => {
	const body = await request.json();
	const res = await api(`/lookup-types/${params.type_code}/items/${params.item_id}`, {
		method: 'PATCH',
		body,
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};

export const DELETE: RequestHandler = async ({ params, request, url }) => {
	const res = await api(`/lookup-types/${params.type_code}/items/${params.item_id}`, {
		method: 'DELETE',
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};
