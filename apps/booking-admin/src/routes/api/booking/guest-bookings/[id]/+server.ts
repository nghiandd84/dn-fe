import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { api } from '$lib/api';

// Authenticated admin CRUD for a single guest booking. Always eager-load items
// for the detail view on GET.
export const GET: RequestHandler = async ({ params, request, url, locals }) => {
	const search = new URLSearchParams(url.searchParams);
	if (!search.has('includes')) search.set('includes', 'items');
	const res = await api(`/guest-bookings/${params.id}`, {
		params: search,
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		token: locals.token,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};

export const PATCH: RequestHandler = async ({ params, request, url, locals }) => {
	const body = await request.json();
	const res = await api(`/guest-bookings/${params.id}`, {
		method: 'PATCH',
		body,
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		token: locals.token,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};

export const DELETE: RequestHandler = async ({ params, request, url, locals }) => {
	const res = await api(`/guest-bookings/${params.id}`, {
		method: 'DELETE',
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		token: locals.token,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};
