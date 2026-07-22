import type { Handle } from '@sveltejs/kit';
import { json, redirect } from '@sveltejs/kit';
import { AUTH_SERVER_URL, AUTH_CLIENT_ID, AUTH_CALLBACK_URL } from '$env/static/private';
import { getToken } from '$lib/session';
import { getCachedUser, setCachedUser, evictCachedUser } from '$lib/verify-cache';

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
	const url = AUTH_SERVER_URL.replace(/\/$/, '') + '/public/tokens/verify';
	const headers: Record<string, string> = { 'Content-Type': 'application/json' };
	if (fingerprint) headers['X-Client-Fingerprint'] = fingerprint;

	try {
		const res = await fetch(url, {
			method: 'POST',
			headers,
			body: JSON.stringify({ token })
		});

		if (res.status !== 200) {
			evictCachedUser(token);
			return null;
		}

		const body = await res.json();
		const user = {
			user_id: body.data.user_id,
			client_id: body.data.client_id,
			accesses: body.data.accesses || []
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
