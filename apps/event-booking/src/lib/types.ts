// Domain types derived from the backend OpenAPI specs
// (Event API :5071, Booking API :5091).

export interface EventData {
	id: string | null;
	event_name: string | null;
	event_date: string | null;
	venue_name: string | null;
	status: string | null;
	total_seats: number | null;
	sale_start_time: string | null;
	created_at: string | null;
}

export interface QueryResult<T> {
	total_page: number;
	result: T[];
}

export interface ApiEnvelope<T> {
	status: number;
	data: T;
}

// One seat sent in a guest-booking create request.
export interface GuestSeatInput {
	item_id: string; // client-generated uuid (backend has no public seat ids)
	item_type?: string; // defaults to "seat"
	price: number;
	metadata?: Record<string, unknown> | null;
}

export interface GuestBookingCreateRequest {
	site_origin: string;
	guest_email: string;
	guest_name?: string | null;
	currency: string;
	seats: GuestSeatInput[];
	resource_type?: string | null;
	resource_id?: string | null;
	booking_type?: string;
	booking_mode?: string;
	confirm_path?: string;
	metadata?: Record<string, unknown> | null;
}

export type GuestBookingStatus =
	| 'PENDING'
	| 'CONFIRMED'
	| 'PROMOTED'
	| 'CANCELLED'
	| 'EXPIRED'
	| 'PAYMENT_EXPIRED';

export interface GuestBookingData {
	id: string | null;
	status: GuestBookingStatus | string | null;
	guest_email: string | null;
	guest_name: string | null;
	currency: string | null;
	total_amount: number | null;
	expires_at: string | null;
	payment_expires_at: string | null;
	confirmed_at: string | null;
	promoted_booking_id: string | null;
	confirm_path: string | null;
	resource_type: string | null;
	resource_id: string | null;
	items: unknown[] | null;
	created_at: string | null;
	updated_at: string | null;
}

export interface BookingData {
	id: string | null;
	status: string | null;
	booking_reference: string | null;
	currency: string | null;
	total_amount: number | null;
	resource_type: string | null;
	resource_id: string | null;
	items: unknown[] | null;
	capacity: Record<string, unknown> | null;
	created_at: string | null;
}

// The default confirm path used when creating a guest booking; the emailed
// link is {site_origin}{confirm_path}?guest_booking_id=&token=.
export const CONFIRM_PATH = '/path/confirm_booking';

// Flat dev seat price (EventData exposes no price). total_amount is computed
// server-side from the per-seat prices we send.
export const SEAT_PRICE = 25;
export const DEFAULT_CURRENCY = 'USD';
export const MAX_SEATS_PER_BOOKING = 10;
