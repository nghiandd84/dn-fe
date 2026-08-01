import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { api } from '$lib/api';

export const GET: RequestHandler = async ({ params, url, request, locals }) => {
	const res = await api(`/projects/${params.id}/translation-keys`, {
		params: url.searchParams,
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		token: locals.token,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};

export const POST: RequestHandler = async ({ request, url, locals, params }) => {
	const body = await request.json();
	// Create goes to the general /translation-keys endpoint with project_id in body
	const res = await api('/translation-keys', {
		method: 'POST',
		body: { ...body, project_id: body.project_id ?? params.id },
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		token: locals.token,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};
