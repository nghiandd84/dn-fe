// Pure helpers for the OAuth-gated payment + promote step.

export interface AuthorizeUrlArgs {
	authServerUrl: string;
	clientId: string;
	callbackUrl: string;
	scopes?: string;
	// carried through OAuth so the callback can return to the right booking
	state?: string;
	// which auth-server screen to open: 'login' (default) or 'signup'
	screen?: 'login' | 'signup';
}

// Build the auth-server authorize URL the guest is redirected to for login/signup.
export function buildAuthorizeUrl(args: AuthorizeUrlArgs): string {
	const base = args.authServerUrl.replace(/\/$/, '') + '/authenticate';
	const params = new URLSearchParams({
		client_id: args.clientId,
		redirect_url: args.callbackUrl
	});
	if (args.scopes) params.set('scopes', args.scopes);
	if (args.state) params.set('state', args.state);
	return `${base}?${params}&screen=${args.screen ?? 'login'}`;
}

// Encode/decode the OAuth state carrying the guest booking id we must return to.
export function encodePayState(bookingId: string): string {
	return `pay:${bookingId}`;
}

export function decodePayState(state: string | null): string | null {
	if (!state) return null;
	const m = /^pay:(.+)$/.exec(state);
	return m ? m[1] : null;
}

// Where the OAuth flow should return after login. `confirm` returns to the
// confirmation page so a confirmed guest booking can be promoted inline;
// `pay` returns to the dedicated payment page (legacy flow).
export type ReturnTarget = 'confirm' | 'pay';

// Encode the OAuth `state` carrying both the return target and guest booking id.
export function encodeReturnState(target: ReturnTarget, bookingId: string): string {
	return `${target}:${bookingId}`;
}

// Decode an OAuth `state` into its return target + booking id. Defaults an
// un-prefixed (or `pay:`) state to the `pay` target for backward compatibility.
export function decodeReturnState(
	state: string | null
): { target: ReturnTarget; bookingId: string } | null {
	if (!state) return null;
	const m = /^(confirm|pay):(.+)$/.exec(state);
	if (m) return { target: m[1] as ReturnTarget, bookingId: m[2] };
	return null;
}

// Build the path the auth callback should redirect to for a decoded state.
// The `promote=1` marker tells the destination page the user just returned
// from login and the confirmed guest booking should be promoted.
export function returnPathFor(decoded: { target: ReturnTarget; bookingId: string }): string {
	const base = decoded.target === 'confirm' ? '/path/confirm_booking' : `/pay/${decoded.bookingId}`;
	const params = new URLSearchParams({ promote: '1' });
	if (decoded.target === 'confirm') params.set('guest_booking_id', decoded.bookingId);
	return `${base}?${params}`;
}

// Extract the access token from the auth token-exchange response body.
export function extractAccessToken(body: unknown): string | null {
	const data = (body as { data?: { access_token?: string } })?.data;
	return data?.access_token ?? null;
}

// Extract the refresh token from the auth token-exchange response body.
export function extractRefreshToken(body: unknown): string | null {
	const data = (body as { data?: { refresh_token?: string } })?.data;
	return data?.refresh_token ?? null;
}

export function promoteErrorMessage(status: number, errorType?: string | null): string {
	switch (status) {
		case 401:
			return 'Your session expired. Please sign in again to complete payment.';
		case 403:
			return 'You are not allowed to complete this booking.';
		case 404:
			return 'This booking could not be found.';
		case 409:
		case 410:
			if (errorType?.toLowerCase().includes('payment')) {
				return 'The payment window has expired. Please start a new booking.';
			}
			return 'This booking can no longer be promoted (already promoted or expired).';
		default:
			return 'Payment could not be completed. Please try again.';
	}
}

// Read the promoted (real) booking id from a promote response.
export function extractPromotedBookingId(body: unknown): string | null {
	const data = (body as { data?: { id?: string } | string })?.data;
	if (typeof data === 'string') return data;
	return (data as { id?: string })?.id ?? null;
}
