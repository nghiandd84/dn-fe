import type { Handle } from '@sveltejs/kit';
import { json, redirect } from '@sveltejs/kit';
import { AUTH_CLIENT_ID, AUTH_CALLBACK_URL, AUTH_API_URL } from '$env/static/private';
import { getToken } from '$lib/session';
import { getCachedUser, setCachedUser, evictCachedUser } from '$lib/verify-cache';
import { createApi } from '@dn-fe/ui/api';

const authApi = createApi(AUTH_API_URL);

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
	const token = getToken(event.cookies);
	if (!token) return null;

	const cached = getCachedUser(token);
	if (cached) return cached;

	const fingerprint = event.request.headers.get('x-client-fingerprint') || undefined;

	try {
		const res = await authApi('/public/tokens/verify', {
			method: 'POST',
			body: { token },
			fingerprint,
			origin: event.url.origin
		});

		if (res.status !== 200) {
			evictCachedUser(token);
			return null;
		}

		const user = {
			user_id: res.data.data.user_id,
			client_id: res.data.data.client_id,
			accesses: res.data.data.accesses || []
		};

		setCachedUser(token, user);
		return user;
	} catch {
		evictCachedUser(token);
		return null;
	}
}

function buildAuthenticateUrl(): string {
	const params = new URLSearchParams({
		client_id: AUTH_CLIENT_ID,
		redirect_url: AUTH_CALLBACK_URL
	});
	return `/authenticate?${params}`;
}

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.lang = resolveLocale(event.request.headers.get('accept-language'));

	const path = event.url.pathname;
	const isAdminPage = path.startsWith('/admin');
	const isAdminApi = path.startsWith('/api/');

	if (isAdminPage || isAdminApi) {
		const user = await verifyUser(event);

		if (!user) {
			if (isAdminApi) {
				return json({ status: 401, data: { error_type: 'unauthorized' } }, { status: 401 });
			}
			throw redirect(302, buildAuthenticateUrl());
		}

		event.locals.token = getToken(event.cookies)!;
		event.locals.user = user;
	}

	return resolve(event);
};
