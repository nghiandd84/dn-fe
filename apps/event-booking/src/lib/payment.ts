// Pure helpers for the OAuth-gated payment + promote step.

export interface AuthorizeUrlArgs {
	authServerUrl: string;
	clientId: string;
	callbackUrl: string;
	scopes?: string;
	// carried through OAuth so the callback can return to the right booking
	state?: string;
}

// Build the auth-server authorize URL the guest is redirected to for login.
export function buildAuthorizeUrl(args: AuthorizeUrlArgs): string {
	const base = args.authServerUrl.replace(/\/$/, '') + '/authenticate';
	const params = new URLSearchParams({
		client_id: args.clientId,
		redirect_url: args.callbackUrl
	});
	if (args.scopes) params.set('scopes', args.scopes);
	if (args.state) params.set('state', args.state);
	return `${base}?${params}&screen=login`;
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

// Extract the access token from the auth token-exchange response body.
export function extractAccessToken(body: unknown): string | null {
	const data = (body as { data?: { access_token?: string } })?.data;
	return data?.access_token ?? null;
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
