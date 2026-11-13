import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ApiEnvelope, BookingData, QueryResult } from '$lib/types';
import { getToken } from '@dn-fe/ui/session';
import { buildAuthorizeUrl } from '$lib/payment';
import {
	AUTH_SERVER_URL,
	AUTH_CLIENT_ID,
	AUTH_CALLBACK_URL,
	AUTH_SCOPES
} from '$env/static/private';

// Statuses that represent a successfully confirmed booking.
const CONFIRMED_STATUSES = new Set(['CONFIRMED', 'PROMOTED', 'PAID', 'COMPLETED']);

export const load: PageServerLoad = async ({ fetch, cookies, url }) => {
	// Guard: viewing your bookings requires being signed in.
	if (!getToken(cookies, url)) {
		const loginUrl = buildAuthorizeUrl({
			authServerUrl: AUTH_SERVER_URL,
			clientId: AUTH_CLIENT_ID,
			callbackUrl: AUTH_CALLBACK_URL,
			scopes: AUTH_SCOPES,
			screen: 'login'
		});
		throw redirect(302, loginUrl);
	}

	const all: BookingData[] = [];
	let currentPage = 1;
	let totalPages = 1;
	let ok = true;

	do {
		const params = new URLSearchParams({
			order_name: 'created_at',
			order_direction: 'desc',
			page: String(currentPage),
			page_size: '20'
		});

		const res = await fetch(`/api/booking/bookings?${params}`);
		if (!res.ok) {
			ok = false;
			break;
		}

		const body = (await res.json()) as ApiEnvelope<QueryResult<BookingData>>;
		all.push(...(body?.data?.result ?? []));
		totalPages = body?.data?.total_page || 1;
		currentPage++;
	} while (currentPage <= totalPages);

	const bookings = all.filter(
		(b) => b.status && CONFIRMED_STATUSES.has(b.status.toUpperCase())
	);

	return { bookings, ok };
};
