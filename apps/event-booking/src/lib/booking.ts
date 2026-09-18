import {
	CONFIRM_PATH,
	DEFAULT_CURRENCY,
	SEAT_PRICE,
	type GuestBookingCreateRequest,
	type GuestSeatInput
} from './types';

export interface BuildBookingArgs {
	eventId: string;
	seats: number[];
	guestEmail: string;
	guestName?: string;
	siteOrigin: string;
	currency?: string;
	seatPrice?: number;
	// injectable for tests; defaults to crypto.randomUUID
	uuid?: () => string;
}

// Build the guest-booking create request body. One seats[] entry is created per
// selected seat number. The backend has no public seat ids, so item_id is a
// client-generated uuid and the seat number is preserved in metadata.
export function buildGuestBookingPayload(args: BuildBookingArgs): GuestBookingCreateRequest {
	const {
		eventId,
		seats,
		guestEmail,
		guestName,
		siteOrigin,
		currency = DEFAULT_CURRENCY,
		seatPrice = SEAT_PRICE,
		uuid = () => crypto.randomUUID()
	} = args;

	const seatInputs: GuestSeatInput[] = seats.map((seat) => ({
		item_id: uuid(),
		item_type: 'seat',
		price: seatPrice,
		metadata: { seat_number: seat }
	}));

	return {
		site_origin: siteOrigin,
		guest_email: guestEmail,
		guest_name: guestName?.trim() ? guestName.trim() : null,
		currency,
		seats: seatInputs,
		resource_type: 'event',
		resource_id: eventId,
		confirm_path: CONFIRM_PATH
		// booking_type/booking_mode omitted → backend defaults EVENT/CAPACITY
	};
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
	return EMAIL_RE.test(email.trim());
}

// Map a backend create-response status to a user-facing error message.
export function createErrorMessage(status: number, errorType?: string | null): string {
	switch (status) {
		case 429:
			return 'Too many booking attempts. Please wait a moment and try again.';
		case 403:
			return 'Bookings are not allowed from this site. Please contact support.';
		case 409:
			return 'One or more selected seats are no longer available.';
		case 422:
		case 400:
			if (errorType?.toLowerCase().includes('email')) {
				return 'This email has reached its booking limit. Try a different email.';
			}
			if (errorType?.toLowerCase().includes('seat')) {
				return 'Seat selection is invalid or exceeds the allowed limit.';
			}
			return 'The booking request was invalid. Please review your details.';
		default:
			return 'Could not create your booking. Please try again.';
	}
}
