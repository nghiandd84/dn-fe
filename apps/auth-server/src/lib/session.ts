import type { Cookies } from '@sveltejs/kit';

const COOKIE_NAME = 'auth_token';

export function getToken(cookies: Cookies): string | undefined {
	return cookies.get(COOKIE_NAME);
}

export function setToken(cookies: Cookies, token: string) {
	cookies.set(COOKIE_NAME, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: false,
		maxAge: 60 * 60 * 24 * 7
	});
}

export function clearToken(cookies: Cookies) {
	cookies.delete(COOKIE_NAME, { path: '/' });
}
