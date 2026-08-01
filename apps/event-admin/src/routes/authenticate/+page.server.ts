import { AUTH_SERVER_URL, AUTH_CLIENT_ID, AUTH_CALLBACK_URL, AUTH_SCOPES } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const clientId = url.searchParams.get('client_id') || AUTH_CLIENT_ID;
	const redirectUrl = url.searchParams.get('redirect_url') || AUTH_CALLBACK_URL;
	const state = url.searchParams.get('state') || '';

	// Build the auth-server authenticate URL for each screen
	const base = AUTH_SERVER_URL.replace(/\/$/, '') + '/authenticate';

	const params = new URLSearchParams({
		client_id: clientId,
		redirect_url: redirectUrl
	});

	if (AUTH_SCOPES) params.set('scopes', AUTH_SCOPES);
	if (state) params.set('state', state);

	const loginUrl = `${base}?${params}&screen=login`;
	const signupUrl = `${base}?${params}&screen=signup`;

	return { valid: true, loginUrl, signupUrl };
};
