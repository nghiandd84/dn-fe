import { describe, it, expect } from 'vitest';
import {
	buildAuthorizeUrl,
	encodePayState,
	decodePayState,
	extractAccessToken,
	extractPromotedBookingId,
	promoteErrorMessage
} from './payment';

describe('buildAuthorizeUrl', () => {
	it('builds a login authorize URL with client, redirect, scopes and state', () => {
		const url = buildAuthorizeUrl({
			authServerUrl: 'http://localhost:5173/',
			clientId: 'client-123',
			callbackUrl: 'http://localhost:5181/auth/callback',
			scopes: 'id,email',
			state: 'pay:bk-1'
		});
		expect(url).toContain('http://localhost:5173/authenticate?');
		expect(url).toContain('client_id=client-123');
		expect(url).toContain('redirect_url=http%3A%2F%2Flocalhost%3A5181%2Fauth%2Fcallback');
		expect(url).toContain('scopes=id%2Cemail');
		expect(url).toContain('state=pay%3Abk-1');
		expect(url).toContain('screen=login');
	});

	it('omits scopes and state when not provided', () => {
		const url = buildAuthorizeUrl({
			authServerUrl: 'http://localhost:5173',
			clientId: 'c',
			callbackUrl: 'http://cb'
		});
		expect(url).not.toContain('scopes=');
		expect(url).not.toContain('state=');
	});
});

describe('pay state round-trip', () => {
	it('encodes and decodes a booking id', () => {
		expect(encodePayState('bk-9')).toBe('pay:bk-9');
		expect(decodePayState('pay:bk-9')).toBe('bk-9');
	});
	it('returns null for missing or non-pay state', () => {
		expect(decodePayState(null)).toBeNull();
		expect(decodePayState('other:x')).toBeNull();
	});
});

describe('extractAccessToken', () => {
	it('reads data.access_token', () => {
		expect(extractAccessToken({ data: { access_token: 'jwt-abc' } })).toBe('jwt-abc');
	});
	it('returns null when absent', () => {
		expect(extractAccessToken({})).toBeNull();
		expect(extractAccessToken({ data: {} })).toBeNull();
	});
});

describe('extractPromotedBookingId', () => {
	it('reads data.id (OkUuid shape)', () => {
		expect(extractPromotedBookingId({ data: { id: 'real-1' } })).toBe('real-1');
	});
	it('reads data as a bare string', () => {
		expect(extractPromotedBookingId({ data: 'real-2' })).toBe('real-2');
	});
	it('returns null when absent', () => {
		expect(extractPromotedBookingId({})).toBeNull();
	});
});

describe('promoteErrorMessage', () => {
	it('handles unauthenticated (401)', () => {
		expect(promoteErrorMessage(401)).toMatch(/session expired/i);
	});
	it('handles payment-window expiry via error_type', () => {
		expect(promoteErrorMessage(410, 'payment_expired')).toMatch(/payment window has expired/i);
	});
	it('handles generic conflict (409)', () => {
		expect(promoteErrorMessage(409)).toMatch(/no longer be promoted/i);
	});
	it('falls back to generic', () => {
		expect(promoteErrorMessage(500)).toMatch(/could not be completed/i);
	});
});
