import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { api } from '$lib/api';

// url-clicks is a query-only listing that aggregates clicks across all URLs.
// For the dashboard count, this proxies /urls (total URLs = base for clicks navigation).
// Actual per-URL click data is at /api/url-shortener/urls/[id]/clicks
export const GET: RequestHandler = async ({ url, request, locals }) => {
	// We proxy to /urls here to get total count for dashboard card
	const res = await api('/urls', {
		params: url.searchParams,
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		token: locals.token,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};
