<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';
	import { replaceState, goto } from '$app/navigation';
	import { fingerprint } from '@dn-fe/ui/fingerprint';
	import { toast } from '@dn-fe/ui/toast';
	import type { ApiEnvelope, GuestBookingData } from '$lib/types';
	import {
		buildConfirmPayload,
		confirmErrorMessage,
		isExpiryError,
		secondsUntil,
		formatCountdown
	} from '$lib/confirm';
	import { promoteErrorMessage, extractPromotedBookingId } from '$lib/payment';

	let { data } = $props();

	type Phase =
		| 'loading'
		| 'confirming'
		| 'needs_login' // confirmed, but user must log in before promoting
		| 'promoting' // promote request in flight
		| 'ready' // promoted — show Pay button
		| 'expired'
		| 'error';

	let phase = $state<Phase>('loading');
	let errorMsg = $state('');
	let booking = $state<GuestBookingData | null>(null);
	let paymentSeconds = $state(0);
	let bookingId = $state('');
	let realBookingId = $state('');

	let timer: ReturnType<typeof setInterval> | undefined;

	function startPaymentCountdown() {
		const tick = () => {
			paymentSeconds = secondsUntil(booking?.payment_expires_at ?? null);
			if (paymentSeconds <= 0 && timer) clearInterval(timer);
		};
		tick();
		timer = setInterval(tick, 1000);
	}

	async function fetchBooking(id: string): Promise<GuestBookingData | null> {
		try {
			const res = await fetch(`/api/booking/guest-bookings/${id}`, {
				headers: { 'X-Client-Fingerprint': get(fingerprint) }
			});
			if (!res.ok) return null;
			const body = (await res.json().catch(() => null)) as
				| ApiEnvelope<GuestBookingData>
				| GuestBookingData
				| null;
			if (!body) return null;
			return (body as ApiEnvelope<GuestBookingData>)?.data ?? (body as GuestBookingData);
		} catch {
			return null;
		}
	}

	async function confirm(id: string, token: string) {
		phase = 'confirming';
		const res = await fetch(`/api/booking/guest-bookings/${id}/confirm`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Client-Fingerprint': get(fingerprint)
			},
			body: JSON.stringify(buildConfirmPayload(token))
		});

		const body = await res.json().catch(() => ({}));

		// The backend wraps responses in an envelope: { status: 0|1, data }.
		// A soft failure (status:0 / error_type) can arrive with HTTP 200, so we
		// must inspect both the HTTP status and the envelope before declaring
		// success — otherwise a failed confirm would render as "confirmed".
		const envelopeFailed = body?.status === 0;
		const errorType = body?.data?.error_type as string | undefined;

		if (!res.ok || envelopeFailed || errorType) {
			const msg = confirmErrorMessage(res.status, errorType);
			// Treat expiry/conflict specially so the user sees the expired state.
			if (res.status === 409 || res.status === 410 || isExpiryError(errorType)) {
				phase = 'expired';
			} else {
				phase = 'error';
			}
			errorMsg = msg;
			return;
		}

		// Confirmed. Load the booking (for the payment window + amount). Non-fatal.
		booking = await fetchBooking(id);
		if (booking?.payment_expires_at) startPaymentCountdown();

		// Already promoted (e.g. the user confirmed again after promoting)?
		if (booking?.promoted_booking_id) {
			realBookingId = booking.promoted_booking_id;
			phase = 'ready';
			return;
		}

		// Next step depends on auth: logged-in users promote immediately;
		// guests must log in first.
		if (data.authed) {
			await promote(id);
		} else {
			phase = 'needs_login';
		}
	}

	// Promote the confirmed guest booking into a real booking. Requires auth.
	async function promote(id: string) {
		phase = 'promoting';
		errorMsg = '';
		try {
			const res = await fetch(`/api/booking/guest-bookings/${id}/promote`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Client-Fingerprint': get(fingerprint)
				}
			});
			const body = await res.json().catch(() => ({}));
			const envelopeFailed = body?.status === 0;
			const errorType = body?.data?.error_type as string | undefined;

			if (!res.ok || envelopeFailed || errorType) {
				if (res.status === 409 || res.status === 410 || isExpiryError(errorType)) {
					phase = 'expired';
				} else {
					phase = 'error';
				}
				errorMsg = promoteErrorMessage(res.status, errorType);
				return;
			}

			realBookingId = extractPromotedBookingId(body) ?? id;
			phase = 'ready';
			toast.success('Booking promoted. Complete payment to finish.');
		} catch {
			phase = 'error';
			errorMsg = 'Network error while promoting your booking. Please try again.';
		}
	}

	onMount(async () => {
		try {
			const url = get(page).url;
			const id = url.searchParams.get('guest_booking_id') ?? '';
			const token = url.searchParams.get('token') ?? '';
			const returnedFromLogin = url.searchParams.get('promote') === '1';
			bookingId = id;

			if (!id) {
				phase = 'error';
				errorMsg = 'This confirmation link is missing required information.';
				return;
			}

			// Returning from login: the booking was already confirmed before the
			// OAuth round-trip, so skip re-confirming and promote directly.
			if (returnedFromLogin) {
				// Clean the promote marker out of the URL.
				try {
					replaceState(`${url.pathname}?guest_booking_id=${encodeURIComponent(id)}`, {});
				} catch {
					// non-fatal
				}
				booking = await fetchBooking(id);
				if (booking?.payment_expires_at) startPaymentCountdown();
				if (booking?.promoted_booking_id) {
					realBookingId = booking.promoted_booking_id;
					phase = 'ready';
					return;
				}
				if (data.authed) {
					await promote(id);
				} else {
					// Login must have failed; let them try again.
					phase = 'needs_login';
				}
				return;
			}

			if (!token) {
				phase = 'error';
				errorMsg = 'This confirmation link is missing required information.';
				return;
			}

			// Strip the token from the URL so it isn't leaked in history/referrer.
			// Best-effort only: replaceState can throw depending on router timing,
			// and must NEVER block the confirmation request below.
			try {
				const cleanUrl = `${url.pathname}?guest_booking_id=${encodeURIComponent(id)}`;
				replaceState(cleanUrl, {});
			} catch {
				// non-fatal — proceed with confirmation regardless
			}

			await confirm(id, token);
		} catch {
			phase = 'error';
			errorMsg = 'Could not confirm your booking. Please try again.';
		}
	});

	$effect(() => {
		return () => {
			if (timer) clearInterval(timer);
		};
	});

	// Proceed to payment for the promoted (real) booking.
	function goPay() {
		goto(`/result/${realBookingId || bookingId}`);
	}
</script>

<svelte:head>
	<title>Confirm booking — Event Booking</title>
</svelte:head>

<div class="page page-narrow">
	<div class="card" data-testid="confirm-card">
		{#if phase === 'loading' || phase === 'confirming'}
			<h1 class="page-title">Confirming your booking…</h1>
			<p class="muted">Please wait a moment.</p>
		{:else if phase === 'promoting'}
			<h1 class="page-title">Finalizing your booking…</h1>
			<p class="muted">Please wait while we prepare your payment.</p>
		{:else if phase === 'needs_login'}
			<h1 class="page-title">Booking confirmed ✅</h1>
			<span class="status-badge status-CONFIRMED">CONFIRMED</span>
			<p class="confirmed-copy">Sign in to finalize your booking and complete payment.</p>
			{#if paymentSeconds > 0}
				<div class="alert alert-info" data-testid="payment-countdown">
					Complete payment within <strong>{formatCountdown(paymentSeconds)}</strong>.
				</div>
			{/if}
			<a class="btn btn-primary btn-block" href={data.loginUrl} data-testid="login-cta">
				Login to continue
			</a>
		{:else if phase === 'ready'}
			<h1 class="page-title">Booking confirmed ✅</h1>
			<span class="status-badge status-CONFIRMED">CONFIRMED</span>
			<p class="confirmed-copy">Your seats are held. Complete payment to finalize your booking.</p>
			{#if paymentSeconds > 0}
				<div class="alert alert-info" data-testid="payment-countdown">
					Complete payment within <strong>{formatCountdown(paymentSeconds)}</strong>.
				</div>
			{/if}
			{#if errorMsg}
				<div class="alert alert-error" role="alert">{errorMsg}</div>
			{/if}
			<button class="btn btn-primary btn-block" data-testid="pay-cta" onclick={goPay}>
				Pay now
			</button>
		{:else if phase === 'expired'}
			<h1 class="page-title">Link expired ⌛</h1>
			<span class="status-badge status-EXPIRED">EXPIRED</span>
			<div class="alert alert-error" role="alert">{errorMsg}</div>
			<a class="btn btn-secondary btn-block" href="/">Browse events</a>
		{:else}
			<h1 class="page-title">Something went wrong</h1>
			<div class="alert alert-error" role="alert" data-testid="confirm-error">{errorMsg}</div>
			<a class="btn btn-secondary btn-block" href="/">Browse events</a>
		{/if}
	</div>
</div>

<style>
	.confirmed-copy {
		margin: 0.75rem 0 1rem;
	}
	.status-badge {
		margin-bottom: 0.5rem;
	}
</style>
