import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { clearToken } from '$lib/session';
import { cookiePrefix } from '@dn-fe/ui/session';

export const POST: RequestHandler = async ({ cookies, url }) => {
	const prefix = cookiePrefix(url);
	clearToken(cookies, url);
	cookies.delete(`${prefix}resources`, { path: '/' });
	cookies.delete(`${prefix}auth_masks`, { path: '/' });
	cookies.delete(`${prefix}client_id`, { path: '/' });
	return json({ data: { redirect: '/authenticate' } });
};
