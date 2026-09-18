import { redirect } from '@sveltejs/kit';
import { AUTH_CLIENT_ID } from '$env/static/private';
import { authApi } from '$lib/api';
import { setToken } from '@dn-fe/ui/session';
import { decodePayState, extractAccessToken } from '$lib/payment';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
	const authCode = url.searchParams.get('auth_code');
	const clientId = url.searchParams.get('client_id') || AUTH_CLIENT_ID;
	const state = url.searchParams.get('state');

	// Where to return after login: the pay page for the booking carried in state.
	const bookingId = decodePayState(state);
	const returnTo = bookingId ? `/pay/${bookingId}` : '/';

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
		throw redirect(302, `${returnTo}?auth_error=token_failed`);
	}

	// Scope the cookie to this app's port, matching the proxy routes' getToken.
	setToken(cookies, token, url);
	throw redirect(302, returnTo);
};
