import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { api, authApi } from '$lib/api';

export const GET: RequestHandler = async ({ url, request, locals }) => {
	const res = await api('/profiles', {
		params: url.searchParams,
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		token: locals.token,
		origin: url.origin
	});

	// Enrich each profile row with the user's email
	const profiles: any[] = res.data?.data?.result ?? [];
	if (profiles.length > 0) {
		const userIds = [...new Set(profiles.map((p: any) => p.user_id).filter(Boolean))];
		try {
			const usersRes = await authApi('/users', {
				params: new URLSearchParams({ id: `in|${userIds.join(',')}`, page_size: String(userIds.length) }),
				fingerprint: request.headers.get('x-client-fingerprint') || undefined,
				token: locals.token,
				origin: url.origin
			});
			const users: any[] = usersRes.data?.data?.result ?? usersRes.data?.result ?? [];
			const emailMap = Object.fromEntries(users.map((u: any) => [u.id, u.email]));
			for (const profile of profiles) {
				profile.user_email = emailMap[profile.user_id] ?? null;
			}
		} catch {
			// Non-fatal: if user lookup fails, just omit email
		}
	}

	return json(res.data, { status: res.status });
};

export const POST: RequestHandler = async ({ request, url, locals }) => {
	const body = await request.json();
	const res = await api('/profiles', {
		method: 'POST',
		body,
		fingerprint: request.headers.get('x-client-fingerprint') || undefined,
		token: locals.token,
		origin: url.origin
	});
	return json(res.data, { status: res.status });
};
