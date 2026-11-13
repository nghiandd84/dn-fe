import type { PageServerLoad } from './$types';
import {
	AUTH_SERVER_URL,
	AUTH_CLIENT_ID,
	AUTH_CALLBACK_URL,
	AUTH_SCOPES
} from '$env/static/private';
import { getToken } from '@dn-fe/ui/session';
import { buildAuthorizeUrl, encodeReturnState } from '$lib/payment';

// Provide the confirm page with the current auth state and a login URL that
// returns to this confirm page (carrying the guest booking id) so the booking
// can be promoted inline after a successful login.
export const load: PageServerLoad = ({ cookies, url }) => {
	const authed = !!getToken(cookies, url);
	const bookingId = url.searchParams.get('guest_booking_id') ?? '';

	const loginUrl = buildAuthorizeUrl({
		authServerUrl: AUTH_SERVER_URL,
		clientId: AUTH_CLIENT_ID,
		callbackUrl: AUTH_CALLBACK_URL,
		scopes: AUTH_SCOPES,
		state: bookingId ? encodeReturnState('confirm', bookingId) : undefined,
		screen: 'login'
	});

	return { authed, loginUrl };
};
