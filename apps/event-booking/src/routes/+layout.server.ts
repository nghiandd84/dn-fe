import type { LayoutServerLoad } from './$types';
import {
	AUTH_SERVER_URL,
	AUTH_CLIENT_ID,
	AUTH_CALLBACK_URL,
	AUTH_SCOPES
} from '$env/static/private';
import { getToken } from '@dn-fe/ui/session';
import { buildAuthorizeUrl } from '$lib/payment';

export const load: LayoutServerLoad = ({ locals, cookies, url }) => {
	const authed = !!getToken(cookies, url);

	const authorizeArgs = {
		authServerUrl: AUTH_SERVER_URL,
		clientId: AUTH_CLIENT_ID,
		callbackUrl: AUTH_CALLBACK_URL,
		scopes: AUTH_SCOPES
	};

	return {
		lang: locals.lang,
		authed,
		loginUrl: buildAuthorizeUrl({ ...authorizeArgs, screen: 'login' }),
		signupUrl: buildAuthorizeUrl({ ...authorizeArgs, screen: 'signup' })
	};
};
