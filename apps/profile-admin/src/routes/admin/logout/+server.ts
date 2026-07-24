import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { clearToken } from '$lib/session';

export const POST: RequestHandler = async ({ cookies }) => {
	clearToken(cookies);
	cookies.delete('refresh_token', { path: '/' });
	cookies.delete('profile_resources', { path: '/' });
	cookies.delete('profile_client_id', { path: '/' });
	return json({ data: { redirect: '/authenticate' } });
};
