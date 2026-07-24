import { redirect } from '@sveltejs/kit';
import { AUTH_SERVER_URL, AUTH_CLIENT_ID } from '$env/static/private';
import { setToken } from '$lib/session';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
	const authCode = url.searchParams.get('auth_code');
	const clientId = url.searchParams.get('client_id') || AUTH_CLIENT_ID;

	if (!authCode) {
		// No auth_code — redirect back to authenticate page
		throw redirect(302, '/authenticate');
	}

	// Exchange auth_code for access token
	const tokenUrl = AUTH_SERVER_URL.replace(/\/$/, '') + '/public/tokens/oauth';
	const res = await fetch(tokenUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			client_id: clientId,
			code: authCode,
			grant_type: 'authorization_code'
		})
	});

	if (res.status !== 200) {
		// Token exchange failed — redirect back to authenticate with error
		throw redirect(302, '/authenticate?error=token_failed');
	}

	const body = await res.json();
	const accessToken = body?.data?.access_token;

	if (!accessToken) {
		throw redirect(302, '/authenticate?error=no_token');
	}

	setToken(cookies, accessToken);
	throw redirect(302, '/admin');
};
