import { describe, it, expect } from 'vitest';
import { buildGuestBookingPayload, isValidEmail, createErrorMessage } from './booking';
import { CONFIRM_PATH, SEAT_PRICE } from './types';

const uuidSeq = () => {
	let n = 0;
	return () => `uuid-${++n}`;
};

describe('buildGuestBookingPayload', () => {
	it('creates one seats[] entry per selected seat', () => {
		const p = buildGuestBookingPayload({
			eventId: 'evt-1',
			seats: [1, 2, 3],
			guestEmail: 'a@b.com',
			siteOrigin: 'http://localhost:5181',
			uuid: uuidSeq()
		});
		expect(p.seats).toHaveLength(3);
		expect(p.seats.map((s) => s.item_id)).toEqual(['uuid-1', 'uuid-2', 'uuid-3']);
	});

	it('sets event resource fields and confirm path', () => {
		const p = buildGuestBookingPayload({
			eventId: 'evt-9',
			seats: [5],
			guestEmail: 'a@b.com',
			siteOrigin: 'http://localhost:5181',
			uuid: uuidSeq()
		});
		expect(p.resource_type).toBe('event');
		expect(p.resource_id).toBe('evt-9');
		expect(p.confirm_path).toBe(CONFIRM_PATH);
		expect(p.site_origin).toBe('http://localhost:5181');
		// booking_type / booking_mode omitted → backend defaults
		expect(p.booking_type).toBeUndefined();
		expect(p.booking_mode).toBeUndefined();
	});

	it('preserves seat number in metadata and applies flat price + item_type', () => {
		const p = buildGuestBookingPayload({
			eventId: 'evt-1',
			seats: [7],
			guestEmail: 'a@b.com',
			siteOrigin: 'http://localhost:5181',
			uuid: uuidSeq()
		});
		expect(p.seats[0]).toMatchObject({
			item_type: 'seat',
			price: SEAT_PRICE,
			metadata: { seat_number: 7 }
		});
	});

	it('normalizes empty name to null and trims non-empty', () => {
		const blank = buildGuestBookingPayload({
			eventId: 'e',
			seats: [1],
			guestEmail: 'a@b.com',
			guestName: '   ',
			siteOrigin: 'o',
			uuid: uuidSeq()
		});
		expect(blank.guest_name).toBeNull();

		const named = buildGuestBookingPayload({
			eventId: 'e',
			seats: [1],
			guestEmail: 'a@b.com',
			guestName: '  Jane  ',
			siteOrigin: 'o',
			uuid: uuidSeq()
		});
		expect(named.guest_name).toBe('Jane');
	});

	it('respects a custom currency and seat price', () => {
		const p = buildGuestBookingPayload({
			eventId: 'e',
			seats: [1, 2],
			guestEmail: 'a@b.com',
			siteOrigin: 'o',
			currency: 'EUR',
			seatPrice: 40,
			uuid: uuidSeq()
		});
		expect(p.currency).toBe('EUR');
		expect(p.seats.every((s) => s.price === 40)).toBe(true);
	});
});

describe('isValidEmail', () => {
	it('accepts valid emails', () => {
		expect(isValidEmail('user@example.com')).toBe(true);
		expect(isValidEmail('  user@example.com ')).toBe(true);
	});
	it('rejects invalid emails', () => {
		expect(isValidEmail('nope')).toBe(false);
		expect(isValidEmail('a@b')).toBe(false);
		expect(isValidEmail('')).toBe(false);
	});
});

describe('createErrorMessage', () => {
	it('handles rate limiting (429)', () => {
		expect(createErrorMessage(429)).toMatch(/too many/i);
	});
	it('handles disallowed origin (403)', () => {
		expect(createErrorMessage(403)).toMatch(/not allowed/i);
	});
	it('handles seat conflict (409)', () => {
		expect(createErrorMessage(409)).toMatch(/no longer available/i);
	});
	it('handles per-email cap via error_type', () => {
		expect(createErrorMessage(422, 'email_limit_reached')).toMatch(/email/i);
	});
	it('handles seat-cap via error_type', () => {
		expect(createErrorMessage(400, 'too_many_seats')).toMatch(/seat/i);
	});
	it('falls back to a generic message', () => {
		expect(createErrorMessage(500)).toMatch(/could not create/i);
	});
});
