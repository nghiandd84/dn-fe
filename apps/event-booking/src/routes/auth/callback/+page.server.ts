import { redirect } from '@sveltejs/kit';
import { AUTH_CLIENT_ID } from '$env/static/private';
import { authApi } from '$lib/api';
import { saveTokens } from '@dn-fe/ui/auth-result';
import { setToken } from '@dn-fe/ui/session';
import {
	decodeReturnState,
	returnPathFor,
	extractAccessToken,
	extractRefreshToken
} from '$lib/payment';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
	const authCode = url.searchParams.get('auth_code');
	const clientId = url.searchParams.get('client_id') || AUTH_CLIENT_ID;
	const state = url.searchParams.get('state');

	// Where to return after login: the confirm or pay page for the booking
	// carried in state. The destination path includes `promote=1` so the page
	// knows the user just returned from login and should promote the booking.
	const decoded = decodeReturnState(state);
	const returnTo = decoded ? returnPathFor(decoded) : '/';
	// Base path (no query) for error redirects, to avoid malformed URLs.
	const basePath = decoded
		? decoded.target === 'confirm'
			? `/path/confirm_booking?guest_booking_id=${encodeURIComponent(decoded.bookingId)}`
			: `/pay/${decoded.bookingId}`
		: '/';

	if (!authCode) {
		throw redirect(302, returnTo);
	}

	const res = await authApi('/public/tokens/oauth', {
		method: 'POST',
		body: { client_id: clientId, code: authCode, grant_type: 'authorization_code' },
		origin: url.origin
	});

	const token = extractAccessToken(res.data);
	if (res.status !== 200 || !token) {
		const sep = basePath.includes('?') ? '&' : '?';
		throw redirect(302, `${basePath}${sep}auth_error=token_failed`);
	}

	// Scope the cookies to this app's port, matching the proxy routes' getToken.
	const refreshToken = extractRefreshToken(res.data);
	if (refreshToken) {
		saveTokens(cookies, token, refreshToken, url);
	} else {
		setToken(cookies, token, url);
	}
	throw redirect(302, returnTo);
};
