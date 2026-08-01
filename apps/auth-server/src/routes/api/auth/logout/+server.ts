import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getToken, clearToken, cookiePrefix } from '$lib/session';
import { evictCachedUser } from '$lib/verify-cache';

export const POST: RequestHandler = async ({ cookies, url }) => {
	const prefix = cookiePrefix(url);
	const token = getToken(cookies, url);
	const loginUrl = cookies.get(`${prefix}login_url`) || '';
	const clientId = cookies.get(`${prefix}client_id`) || '';

	if (token) evictCachedUser(token);

	clearToken(cookies, url);
	cookies.delete(`${prefix}refresh_token`, { path: '/' });
	cookies.delete(`${prefix}resources`, { path: '/' });
	cookies.delete(`${prefix}client_id`, { path: '/' });
	cookies.delete(`${prefix}login_url`, { path: '/' });

	const redirectTo = loginUrl || (clientId ? `/authenticate?client_id=${clientId}` : '/authenticate');
	return json({ status: 200, data: { ok: true, redirect: redirectTo } });
};
