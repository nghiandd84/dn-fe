import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { api } from '$lib/api';

export const PATCH: RequestHandler = async ({ params, request, url, locals }) => {
	const body = await request.json();
	const res = await api(
		`/lookup-types/${params.type_code}/items/${params.item_id}/translations/${params.translation_id}`,
		{
			method: 'PATCH',
			body,
			fingerprint: request.headers.get('x-client-fingerprint') || undefined,
			token: locals.token,
			origin: url.origin
		}
	);
	return json(res.data, { status: res.status });
};

export const DELETE: RequestHandler = async ({ params, request, url, locals }) => {
	const res = await api(
		`/lookup-types/${params.type_code}/items/${params.item_id}/translations/${params.translation_id}`,
		{
			method: 'DELETE',
			fingerprint: request.headers.get('x-client-fingerprint') || undefined,
			token: locals.token,
			origin: url.origin
		}
	);
	return json(res.data, { status: res.status });
};
