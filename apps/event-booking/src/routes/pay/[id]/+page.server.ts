import type { PageServerLoad } from './$types';
import {
	AUTH_SERVER_URL,
	AUTH_CLIENT_ID,
	AUTH_CALLBACK_URL,
	AUTH_SCOPES
} from '$env/static/private';
import { getToken } from '@dn-fe/ui/session';
import { buildAuthorizeUrl, encodePayState } from '$lib/payment';
import type { ApiEnvelope, GuestBookingData } from '$lib/types';

export const load: PageServerLoad = async ({ params, url, cookies, fetch }) => {
	const token = getToken(cookies, url);
	const bookingId = params.id;

	if (!token) {
		// Not authenticated yet — send the guest through OAuth, returning here.
		const loginUrl = buildAuthorizeUrl({
			authServerUrl: AUTH_SERVER_URL,
			clientId: AUTH_CLIENT_ID,
			callbackUrl: AUTH_CALLBACK_URL,
			scopes: AUTH_SCOPES,
			state: encodePayState(bookingId)
		});
		return { authed: false, loginUrl, booking: null, bookingId };
	}

	// Authenticated — load the booking summary for the payment screen.
	const res = await fetch(`/api/booking/guest-bookings/${bookingId}`);
	let booking: GuestBookingData | null = null;
	if (res.ok) {
		const body = (await res.json()) as ApiEnvelope<GuestBookingData> | GuestBookingData;
		booking = (body as ApiEnvelope<GuestBookingData>)?.data ?? (body as GuestBookingData);
	}

	return { authed: true, loginUrl: null, booking, bookingId };
};
