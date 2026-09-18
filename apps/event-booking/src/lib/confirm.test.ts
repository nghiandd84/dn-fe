import { describe, it, expect } from 'vitest';
import {
	buildConfirmPayload,
	isExpired,
	isConfirmed,
	secondsUntil,
	formatCountdown,
	confirmErrorMessage
} from './confirm';

describe('buildConfirmPayload', () => {
	it('wraps the token', () => {
		expect(buildConfirmPayload('tok-123')).toEqual({ confirm_token: 'tok-123' });
	});
});

describe('isExpired', () => {
	const now = new Date('2026-01-01T12:00:00Z');

	it('is true for EXPIRED / CANCELLED status', () => {
		expect(isExpired({ status: 'EXPIRED', expires_at: null }, now)).toBe(true);
		expect(isExpired({ status: 'CANCELLED', expires_at: null }, now)).toBe(true);
	});

	it('is true when expires_at is in the past', () => {
		expect(isExpired({ status: 'PENDING', expires_at: '2026-01-01T11:59:00Z' }, now)).toBe(true);
	});

	it('is false when PENDING and expires_at is in the future', () => {
		expect(isExpired({ status: 'PENDING', expires_at: '2026-01-01T12:05:00Z' }, now)).toBe(false);
	});

	it('is false when no expiry and active status', () => {
		expect(isExpired({ status: 'PENDING', expires_at: null }, now)).toBe(false);
	});
});

describe('isConfirmed', () => {
	it('is true for CONFIRMED and PROMOTED', () => {
		expect(isConfirmed({ status: 'CONFIRMED' })).toBe(true);
		expect(isConfirmed({ status: 'PROMOTED' })).toBe(true);
	});
	it('is false otherwise', () => {
		expect(isConfirmed({ status: 'PENDING' })).toBe(false);
		expect(isConfirmed({ status: null })).toBe(false);
	});
});

describe('secondsUntil', () => {
	const now = new Date('2026-01-01T12:00:00Z');
	it('returns positive seconds for a future time', () => {
		expect(secondsUntil('2026-01-01T12:02:30Z', now)).toBe(150);
	});
	it('clamps to zero for a past time', () => {
		expect(secondsUntil('2026-01-01T11:00:00Z', now)).toBe(0);
	});
	it('returns 0 for null/invalid', () => {
		expect(secondsUntil(null, now)).toBe(0);
		expect(secondsUntil('not-a-date', now)).toBe(0);
	});
});

describe('formatCountdown', () => {
	it('formats mm:ss', () => {
		expect(formatCountdown(150)).toBe('2:30');
		expect(formatCountdown(5)).toBe('0:05');
	});
	it('formats hh:mm:ss when >= 1 hour', () => {
		expect(formatCountdown(3661)).toBe('1:01:01');
	});
	it('clamps negatives to 0:00', () => {
		expect(formatCountdown(-10)).toBe('0:00');
	});
});

describe('confirmErrorMessage', () => {
	it('handles not found (404)', () => {
		expect(confirmErrorMessage(404)).toMatch(/could not be found/i);
	});
	it('handles invalid/used token (403)', () => {
		expect(confirmErrorMessage(403)).toMatch(/invalid or has already/i);
	});
	it('handles expired/conflict (410)', () => {
		expect(confirmErrorMessage(410)).toMatch(/expired or was already/i);
	});
	it('handles invalid token via error_type', () => {
		expect(confirmErrorMessage(422, 'invalid_token')).toMatch(/token/i);
	});
	it('falls back to generic', () => {
		expect(confirmErrorMessage(500)).toMatch(/could not confirm/i);
	});
});
