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
		isExpired,
		isConfirmed,
		secondsUntil,
		formatCountdown
	} from '$lib/confirm';

	type Phase = 'loading' | 'confirming' | 'confirmed' | 'expired' | 'error';

	let phase = $state<Phase>('loading');
	let errorMsg = $state('');
	let booking = $state<GuestBookingData | null>(null);
	let paymentSeconds = $state(0);
	let bookingId = $state('');

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
		const res = await fetch(`/api/booking/guest-bookings/${id}`, {
			headers: { 'X-Client-Fingerprint': get(fingerprint) }
		});
		if (!res.ok) return null;
		const body = (await res.json()) as ApiEnvelope<GuestBookingData> | GuestBookingData;
		return (body as ApiEnvelope<GuestBookingData>)?.data ?? (body as GuestBookingData);
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
		if (!res.ok) {
			const msg = confirmErrorMessage(res.status, body?.data?.error_type);
			// Treat expiry/conflict specially so the user sees the expired state.
			if (res.status === 409 || res.status === 410) {
				phase = 'expired';
			} else {
				phase = 'error';
			}
			errorMsg = msg;
			return;
		}

		// Re-fetch the booking to get confirmed status + payment window.
		const refreshed = await fetchBooking(id);
		booking = refreshed;
		phase = 'confirmed';
		toast.success('Booking confirmed! You can now pay.');
		if (refreshed?.payment_expires_at) startPaymentCountdown();
	}

	onMount(async () => {
		const url = get(page).url;
		const id = url.searchParams.get('guest_booking_id') ?? '';
		const token = url.searchParams.get('token') ?? '';
		bookingId = id;

		if (!id || !token) {
			phase = 'error';
			errorMsg = 'This confirmation link is missing required information.';
			return;
		}

		// Load current state first to short-circuit already-confirmed/expired.
		const current = await fetchBooking(id);
		booking = current;

		// Strip the token from the URL so it isn't leaked in history/referrer.
		const cleanUrl = `${url.pathname}?guest_booking_id=${encodeURIComponent(id)}`;
		replaceState(cleanUrl, {});

		if (current && isConfirmed(current)) {
			phase = 'confirmed';
			if (current.payment_expires_at) startPaymentCountdown();
			return;
		}
		if (current && isExpired(current)) {
			phase = 'expired';
			errorMsg = 'This booking has expired.';
			return;
		}

		await confirm(id, token);
	});

	$effect(() => {
		return () => {
			if (timer) clearInterval(timer);
		};
	});

	function goPay() {
		goto(`/pay/${bookingId}`);
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
		{:else if phase === 'confirmed'}
			<h1 class="page-title">Booking confirmed ✅</h1>
			<span class="status-badge status-CONFIRMED">CONFIRMED</span>
			<p class="confirmed-copy">
				Your seats are held. Complete payment to finalize your booking.
			</p>
			{#if paymentSeconds > 0}
				<div class="alert alert-info" data-testid="payment-countdown">
					Complete payment within <strong>{formatCountdown(paymentSeconds)}</strong>.
				</div>
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
