import type { PageServerLoad } from './$types';
import type { ApiEnvelope, BookingData } from '$lib/types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const res = await fetch(`/api/booking/bookings/${params.id}`);

	if (!res.ok) {
		return { booking: null, ok: false, status: res.status, bookingId: params.id };
	}

	const body = (await res.json()) as ApiEnvelope<BookingData> | BookingData;
	const booking = (body as ApiEnvelope<BookingData>)?.data ?? (body as BookingData);

	return { booking, ok: true, status: 200, bookingId: params.id };
};
