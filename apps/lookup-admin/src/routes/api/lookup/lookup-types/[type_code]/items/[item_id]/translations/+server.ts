import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { api } from '$lib/api';

export const GET: RequestHandler = async ({ params, url, request }) => {
	const res = await api(
		`/lookup-types/${params.type_code}/items/${params.item_id}/translations`,
		{
			fingerprint: request.headers.get('x-client-fingerprint') || undefined,
			params: url.searchParams,
			origin: url.origin
		}
	);
	return json(res.data, { status: res.status });
};

export const POST: RequestHandler = async ({ params, request, url }) => {
	const body = await request.json();
	const res = await api(
		`/lookup-types/${params.type_code}/items/${params.item_id}/translations`,
		{
			method: 'POST',
			body,
			fingerprint: request.headers.get('x-client-fingerprint') || undefined,
			origin: url.origin
		}
	);
	return json(res.data, { status: res.status });
};
