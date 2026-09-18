import type { GuestBookingData } from './types';

export interface ConfirmPayload {
	confirm_token: string;
	metadata?: Record<string, unknown> | null;
}

export function buildConfirmPayload(token: string): ConfirmPayload {
	return { confirm_token: token };
}

// A guest booking is confirmable only while PENDING and before it expires.
export function isExpired(booking: Pick<GuestBookingData, 'status' | 'expires_at'>, now: Date = new Date()): boolean {
	const status = (booking.status ?? '').toUpperCase();
	if (status === 'EXPIRED' || status === 'CANCELLED') return true;
	if (booking.expires_at) {
		const exp = new Date(booking.expires_at);
		if (!isNaN(exp.getTime()) && exp.getTime() <= now.getTime()) return true;
	}
	return false;
}

export function isConfirmed(booking: Pick<GuestBookingData, 'status'>): boolean {
	const status = (booking.status ?? '').toUpperCase();
	return status === 'CONFIRMED' || status === 'PROMOTED';
}

// Seconds remaining until the given ISO timestamp (never negative).
export function secondsUntil(iso: string | null, now: Date = new Date()): number {
	if (!iso) return 0;
	const t = new Date(iso);
	if (isNaN(t.getTime())) return 0;
	return Math.max(0, Math.floor((t.getTime() - now.getTime()) / 1000));
}

// Format a seconds count as mm:ss (or hh:mm:ss when >= 1h).
export function formatCountdown(totalSeconds: number): string {
	const s = Math.max(0, Math.floor(totalSeconds));
	const h = Math.floor(s / 3600);
	const m = Math.floor((s % 3600) / 60);
	const sec = s % 60;
	const pad = (n: number) => n.toString().padStart(2, '0');
	return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

export function confirmErrorMessage(status: number, errorType?: string | null): string {
	switch (status) {
		case 404:
			return 'This booking could not be found. The link may be invalid.';
		case 401:
		case 403:
			return 'This confirmation link is invalid or has already been used.';
		case 409:
		case 410:
			return 'This booking has expired or was already confirmed.';
		case 422:
		case 400:
			if (errorType?.toLowerCase().includes('token')) {
				return 'The confirmation token is invalid or expired.';
			}
			return 'The confirmation request was invalid.';
		default:
			return 'Could not confirm your booking. Please try again.';
	}
}
