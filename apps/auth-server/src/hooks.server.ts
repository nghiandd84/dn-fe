import type { Handle } from '@sveltejs/kit';
import { json, redirect } from '@sveltejs/kit';
import { api } from '$lib/api';
import { getToken } from '$lib/session';
import { getCachedUser, setCachedUser, evictCachedUser } from '$lib/verify-cache';
import { cookiePrefix } from '@dn-fe/ui/session';

const SUPPORTED_LOCALES = ['en-US', 'vi-VN'];
const DEFAULT_LOCALE = 'en-US';

function resolveLocale(acceptLang: string | null): string {
	if (!acceptLang) return DEFAULT_LOCALE;
	const parts = acceptLang.split(',');
	for (const part of parts) {
		const lang = part.split(';')[0].trim();
		if (SUPPORTED_LOCALES.includes(lang)) return lang;
		const base = lang.split('-')[0];
		const match = SUPPORTED_LOCALES.find((l) => l.startsWith(base));
		if (match) return match;
	}
	return DEFAULT_LOCALE;
}

async function verifyUser(event: Parameters<Handle>[0]['event']) {
	const token = getToken(event.cookies, event.url);
	if (!token) return null;

	const cached = getCachedUser(token);
	if (cached) return cached;

	const fingerprint = event.request.headers.get('x-client-fingerprint') || undefined;
	const verify = await api('/public/tokens/verify', {
		method: 'POST',
		body: { token },
		fingerprint,
		origin: event.url.origin
	});

	if (verify.status !== 200) {
		evictCachedUser(token);
		return null;
	}

	const user = {
		user_id: verify.data.data.user_id,
		client_id: verify.data.data.client_id,
		accesses: verify.data.data.accesses || []
	};

	setCachedUser(token, user);
	return user;
}

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.lang = resolveLocale(event.request.headers.get('accept-language'));
	const isAdminPage = event.url.pathname.startsWith('/admin');
	const isAdminApi = event.url.pathname.startsWith('/api/admin');

	if (isAdminPage || isAdminApi) {
		const user = await verifyUser(event);

		if (!user) {
			if (isAdminApi) {
				return json({ status: 401, data: { error_type: 'unauthorized' } }, { status: 401 });
			}
			// Redirect back to the original authenticate URL (with client_id etc.) if available
			const prefix = cookiePrefix(event.url);
			const loginUrl = event.cookies.get(`${prefix}login_url`) || '/authenticate';
			throw redirect(302, loginUrl);
		}

		event.locals.token = getToken(event.cookies, event.url);
		event.locals.user = user;
	}

	return resolve(event);
};
