import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { api } from '$lib/api';

export const GET: RequestHandler = async ({ url, request, locals }) => {
	const res = await api('/social-links', {
		params: url.searchParams,
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		token: locals.token,
		origin: url.origin
	});

	// Enrich each row with profile full name
	const rows: any[] = res.data?.data?.result ?? [];
	if (rows.length > 0) {
		const profileIds = [...new Set(rows.map((r: any) => r.profile_id).filter(Boolean))];
		try {
			const profilesRes = await api('/profiles', {
				params: new URLSearchParams({ id: `in|${profileIds.join(',')}`, page_size: String(profileIds.length) }),
				fingerprint: request.headers.get('x-client-fingerprint') || undefined,
				token: locals.token,
				origin: url.origin
			});
			const profiles: any[] = profilesRes.data?.data?.result ?? [];
			const nameMap = Object.fromEntries(
				profiles.map((p: any) => [p.id, `${p.first_name} ${p.last_name}`.trim()])
			);
			for (const row of rows) {
				row.profile_name = nameMap[row.profile_id] ?? null;
			}
		} catch {
			// Non-fatal
		}
	}

	return json(res.data, { status: res.status });
};

export const POST: RequestHandler = async ({ request, url, locals }) => {
	const body = await request.json();
	const res = await api('/social-links', {
		method: 'POST',
		body,
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		token: locals.token,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};
