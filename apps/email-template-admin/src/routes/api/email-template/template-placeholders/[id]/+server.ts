import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { api } from '$lib/api';
import { enrichOneWithUserEmail } from '$lib/enrich-user';

export const GET: RequestHandler = async ({ params, request, url, locals }) => {
	const res = await api(`/template-placeholders/${params.id}`, {
		params: new URLSearchParams({ includes: 'email_template' }),
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		token: locals.token,
		origin: url.origin
	});

	const record = res.data?.data;
	if (record) {
		await enrichOneWithUserEmail(record, {
			fingerprint: request.headers.get('x-client-fingerprint') || undefined,
			token: locals.token,
			origin: url.origin
		});
	}

	return json(res.data, { status: res.status });
};

export const PATCH: RequestHandler = async ({ params, request, url, locals }) => {
	const body = await request.json();
	const res = await api(`/template-placeholders/${params.id}`, {
		method: 'PATCH',
		body,
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		token: locals.token,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};

export const DELETE: RequestHandler = async ({ params, request, url, locals }) => {
	const res = await api(`/template-placeholders/${params.id}`, {
		method: 'DELETE',
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		token: locals.token,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};
