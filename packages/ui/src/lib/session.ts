import type { Cookies } from '@sveltejs/kit';

const BASE_COOKIE_NAME = 'auth_token';

/**
 * Returns a cookie name prefixed with the port so that apps running on
 * different localhost ports (5173, 5174, …) do not share cookies.
 *
 * Pass `url.port` (or the full `url` object) from the SvelteKit event.
 * The prefix is omitted when the port is empty (e.g. production, port 80/443).
 */
export function cookiePrefix(port: string | URL): string {
	const p = typeof port === 'string' ? port : port.port;
	return p ? `p${p}_` : '';
}

export function getToken(cookies: Cookies, port: string | URL = ''): string | undefined {
	return cookies.get(`${cookiePrefix(port)}${BASE_COOKIE_NAME}`);
}

export function setToken(cookies: Cookies, token: string, port: string | URL = '') {
	cookies.set(`${cookiePrefix(port)}${BASE_COOKIE_NAME}`, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: false,
		maxAge: 60 * 60 * 24 * 7
	});
}

export function clearToken(cookies: Cookies, port: string | URL = '') {
	cookies.delete(`${cookiePrefix(port)}${BASE_COOKIE_NAME}`, { path: '/' });
}
