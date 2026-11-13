import { MAX_SEATS_PER_BOOKING } from './types';

// Generate the list of selectable seat numbers for an event. The backend
// exposes only total_seats (no per-seat objects), so we render slots 1..N.
export function seatSlots(totalSeats: number | null | undefined): number[] {
	const n = Math.max(0, Math.floor(totalSeats ?? 0));
	return Array.from({ length: n }, (_, i) => i + 1);
}

// The maximum number of seats a guest may select for one booking: capped by
// both the event's total_seats and the per-booking limit.
export function maxSelectable(totalSeats: number | null | undefined): number {
	return Math.min(Math.max(0, Math.floor(totalSeats ?? 0)), MAX_SEATS_PER_BOOKING);
}

// Toggle a seat in the current selection, enforcing the per-booking cap.
// Returns the new selection (does not mutate the input).
export function toggleSeat(
	selected: number[],
	seat: number,
	totalSeats: number | null | undefined
): number[] {
	if (selected.includes(seat)) {
		return selected.filter((s) => s !== seat);
	}
	if (selected.length >= maxSelectable(totalSeats)) {
		return selected; // at cap — ignore additional selections
	}
	return [...selected, seat].sort((a, b) => a - b);
}

// Whether adding another (not-yet-selected) seat is allowed.
export function canSelectMore(
	selected: number[],
	totalSeats: number | null | undefined
): boolean {
	return selected.length < maxSelectable(totalSeats);
}
