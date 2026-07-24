import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { api } from '$lib/api';
import { enrichWithUserEmail } from '$lib/enrich-user';

export const GET: RequestHandler = async ({ url, request, locals }) => {
	const res = await api('/email-templates', {
		params: url.searchParams,
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		token: locals.token,
		origin: url.origin
	});

	const rows: any[] = res.data?.data?.result ?? [];
	await enrichWithUserEmail(rows, {
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		token: locals.token,
		origin: url.origin
	});

	return json(res.data, { status: res.status });
};

export const POST: RequestHandler = async ({ request, url, locals }) => {
	const body = await request.json();
	const res = await api('/email-templates', {
		method: 'POST',
		body,
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		token: locals.token,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};
