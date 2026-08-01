import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { api } from '$lib/api';
import { getToken } from '$lib/session';

export const GET: RequestHandler = async ({ url, cookies, request }) => {
	const token = getToken(cookies, url);
	const fingerprint = request.headers.get('x-client-fingerprint') || undefined;

	const res = await api('/users', {
		token,
		fingerprint,
		params: url.searchParams,
		origin: url.origin
	});

	// If includes=accesses is requested, enrich accesses with role name
	const includesAccesses = url.searchParams.get('includes')?.includes('accesses');
	if (includesAccesses && res.status === 200 && res.data?.data?.result) {
		const users: any[] = res.data.data.result;

		// Collect all unique role_ids across all users
		const roleIds = [...new Set(
			users.flatMap((u: any) =>
				(u.accesses ?? []).map((a: any) => a.role_id).filter(Boolean)
			)
		)];

		if (roleIds.length > 0) {
			const rolesRes = await api('/roles', {
				token,
				fingerprint,
				params: new URLSearchParams({ id: `in|${roleIds.join(',')}`, page_size: '100' }),
				origin: url.origin
			});

			const roles: any[] = rolesRes.data?.data?.result ?? [];
			const roleMap = new Map(roles.map((r: any) => [r.id, r.name]));

			// Merge role name into each access
			for (const user of users) {
				if (Array.isArray(user.accesses)) {
					user.accesses = user.accesses.map((a: any) => ({
						...a,
						role_name: roleMap.get(a.role_id) ?? ''
					}));
				}
			}
		}
	}

	return json(res.data, { status: res.status });
};
