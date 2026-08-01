import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { clearToken, cookiePrefix } from '$lib/session';

export const POST: RequestHandler = async ({ cookies, url }) => {
	const prefix = cookiePrefix(url);
	clearToken(cookies, url);
	cookies.delete(`${prefix}refresh_token`, { path: '/' });
	cookies.delete(`${prefix}resources`, { path: '/' });
	cookies.delete(`${prefix}client_id`, { path: '/' });
	return json({ status: 200, data: { redirect: '/authenticate' } });
};
