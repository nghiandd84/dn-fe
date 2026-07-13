import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getToken, clearToken } from '$lib/session';
import { evictCachedUser } from '$lib/verify-cache';

export const POST: RequestHandler = async ({ cookies }) => {
	const token = getToken(cookies);
	const loginUrl = cookies.get('auth_login_url') || '';
	const clientId = cookies.get('auth_client_id') || '';

	if (token) evictCachedUser(token);

	clearToken(cookies);
	cookies.delete('refresh_token', { path: '/' });
	cookies.delete('auth_resources', { path: '/' });
	cookies.delete('auth_client_id', { path: '/' });
	cookies.delete('auth_login_url', { path: '/' });

	const redirectTo = loginUrl || (clientId ? `/authenticate?client_id=${clientId}` : '/authenticate');
	return json({ status: 200, data: { ok: true, redirect: redirectTo } });
};
