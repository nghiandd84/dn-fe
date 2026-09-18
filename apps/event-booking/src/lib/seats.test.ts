import { describe, it, expect } from 'vitest';
import { seatSlots, maxSelectable, toggleSeat, canSelectMore } from './seats';
import { MAX_SEATS_PER_BOOKING } from './types';

describe('seatSlots', () => {
	it('generates 1..N slots', () => {
		expect(seatSlots(5)).toEqual([1, 2, 3, 4, 5]);
	});

	it('returns empty for null/zero/negative', () => {
		expect(seatSlots(null)).toEqual([]);
		expect(seatSlots(0)).toEqual([]);
		expect(seatSlots(-3)).toEqual([]);
	});
});

describe('maxSelectable', () => {
	it('caps at total_seats when fewer than the per-booking limit', () => {
		expect(maxSelectable(4)).toBe(4);
	});

	it('caps at the per-booking limit when total_seats is larger', () => {
		expect(maxSelectable(500)).toBe(MAX_SEATS_PER_BOOKING);
	});

	it('handles null', () => {
		expect(maxSelectable(null)).toBe(0);
	});
});

describe('toggleSeat', () => {
	it('adds a seat when not selected', () => {
		expect(toggleSeat([], 3, 100)).toEqual([3]);
	});

	it('removes a seat when already selected', () => {
		expect(toggleSeat([1, 3, 5], 3, 100)).toEqual([1, 5]);
	});

	it('keeps selection sorted', () => {
		expect(toggleSeat([5, 1], 3, 100)).toEqual([1, 3, 5]);
	});

	it('ignores new seats once the per-booking cap is reached', () => {
		const full = Array.from({ length: MAX_SEATS_PER_BOOKING }, (_, i) => i + 1);
		const result = toggleSeat(full, MAX_SEATS_PER_BOOKING + 1, 100);
		expect(result).toEqual(full);
		expect(result.length).toBe(MAX_SEATS_PER_BOOKING);
	});

	it('still allows deselecting when at cap', () => {
		const full = Array.from({ length: MAX_SEATS_PER_BOOKING }, (_, i) => i + 1);
		const result = toggleSeat(full, 1, 100);
		expect(result).not.toContain(1);
		expect(result.length).toBe(MAX_SEATS_PER_BOOKING - 1);
	});

	it('respects a small total_seats cap', () => {
		expect(toggleSeat([1, 2], 3, 2)).toEqual([1, 2]);
	});
});

describe('canSelectMore', () => {
	it('is true below the cap', () => {
		expect(canSelectMore([1], 100)).toBe(true);
	});

	it('is false at the cap', () => {
		const full = Array.from({ length: MAX_SEATS_PER_BOOKING }, (_, i) => i + 1);
		expect(canSelectMore(full, 100)).toBe(false);
	});
});
