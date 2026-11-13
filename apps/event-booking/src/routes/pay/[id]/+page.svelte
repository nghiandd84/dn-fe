<script lang="ts">
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { fingerprint } from '@dn-fe/ui/fingerprint';
	import { toast } from '@dn-fe/ui/toast';
	import { DEFAULT_CURRENCY, type GuestBookingData } from '$lib/types';
	import { promoteErrorMessage, extractPromotedBookingId } from '$lib/payment';
	import { secondsUntil, formatCountdown, isConfirmed } from '$lib/confirm';
	import { onMount } from 'svelte';

	let { data } = $props();
	const booking = $derived(data.booking as GuestBookingData | null);
	const bookingId = $derived(data.bookingId as string);

	let paying = $state(false);
	let errorMsg = $state('');
	let paymentSeconds = $state(0);
	let timer: ReturnType<typeof setInterval> | undefined;

	const amount = $derived(booking?.total_amount ?? 0);
	const currency = $derived(booking?.currency ?? DEFAULT_CURRENCY);
	const confirmed = $derived(booking ? isConfirmed(booking) : false);

	onMount(() => {
		if (data.authed && booking?.payment_expires_at) {
			const tick = () => {
				paymentSeconds = secondsUntil(booking!.payment_expires_at);
				if (paymentSeconds <= 0 && timer) clearInterval(timer);
			};
			tick();
			timer = setInterval(tick, 1000);
		}

		// If the user just returned from login (promote=1), auto-promote the
		// confirmed guest booking into a real booking instead of waiting for a
		// manual "Pay" click.
		maybeAutoPromote();

		return () => {
			if (timer) clearInterval(timer);
		};
	});

	// Decide whether to automatically promote on arrival. Only runs when the
	// user is authenticated, arrived via the post-login `promote=1` marker, the
	// booking is confirmed, and the payment window (if any) has not expired.
	function maybeAutoPromote() {
		if (!data.authed) return;

		const url = get(page).url;
		if (url.searchParams.get('promote') !== '1') return;

		const status = (booking?.status ?? '').toUpperCase();

		// Already promoted — just forward to the result page.
		if (status === 'PROMOTED' && booking?.promoted_booking_id) {
			toast.success('Booking already confirmed.');
			goto(`/result/${booking.promoted_booking_id}`);
			return;
		}

		// Only promote a confirmed booking whose payment window is still open.
		const payable = !booking?.payment_expires_at || secondsUntil(booking.payment_expires_at) > 0;
		if (confirmed && payable && !paying) {
			payAndPromote();
		}
	}

	async function payAndPromote() {
		errorMsg = '';
		paying = true;
		try {
			// Mock payment step (no real gateway in v1). Proceed straight to promote.
			const res = await fetch(`/api/booking/guest-bookings/${bookingId}/promote`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Client-Fingerprint': get(fingerprint)
				}
			});

			const body = await res.json().catch(() => ({}));
			if (!res.ok) {
				errorMsg = promoteErrorMessage(res.status, body?.data?.error_type);
				return;
			}

			const realId = extractPromotedBookingId(body) ?? bookingId;
			toast.success('Payment complete — booking confirmed!');
			await goto(`/result/${realId}`);
		} catch {
			errorMsg = 'Network error — please try again.';
		} finally {
			paying = false;
		}
	}
</script>

<svelte:head>
	<title>Payment — Event Booking</title>
</svelte:head>

<div class="page page-narrow">
	<div class="card" data-testid="pay-card">
		<h1 class="page-title">Complete payment</h1>

		{#if !data.authed}
			<p>Please sign in to pay for and finalize your booking.</p>
			<a class="btn btn-primary btn-block" href={data.loginUrl} data-testid="login-cta">
				Sign in to pay
			</a>
		{:else if booking && paymentSeconds <= 0 && booking.payment_expires_at}
			<span class="status-badge status-PAYMENT_EXPIRED">PAYMENT EXPIRED</span>
			<div class="alert alert-error" role="alert" data-testid="payment-expired">
				The payment window has expired. Please start a new booking.
			</div>
			<a class="btn btn-secondary btn-block" href="/">Browse events</a>
		{:else}
			<div class="pay-summary">
				<div class="row">
					<span class="muted">Booking</span>
					<span>{bookingId}</span>
				</div>
				<div class="row">
					<span class="muted">Amount due</span>
					<strong>{booking ? `${amount} ${currency}` : '—'}</strong>
				</div>
				{#if confirmed}
					<span class="status-badge status-CONFIRMED">CONFIRMED</span>
				{/if}
			</div>

			{#if !booking}
				<p class="muted" data-testid="summary-unavailable">
					We couldn't load the booking summary, but you can still complete payment.
				</p>
			{/if}

			{#if paymentSeconds > 0}
				<div class="alert alert-info" data-testid="payment-countdown">
					Complete payment within <strong>{formatCountdown(paymentSeconds)}</strong>.
				</div>
			{/if}

			{#if errorMsg}
				<div class="alert alert-error" role="alert" data-testid="pay-error">{errorMsg}</div>
			{/if}

			<button
				class="btn btn-primary btn-block"
				disabled={paying}
				data-testid="pay-now"
				onclick={payAndPromote}
			>
				{paying ? 'Processing…' : booking ? `Pay ${amount} ${currency}` : 'Pay now'}
			</button>
			<p class="muted disclaimer">Payment is simulated for this demo.</p>
		{/if}
	</div>
</div>

<style>
	.pay-summary {
		margin-bottom: 1rem;
	}
	.pay-summary .row {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--border);
	}
	.status-badge {
		margin-top: 0.5rem;
		display: inline-block;
	}
	.disclaimer {
		text-align: center;
		margin-top: 0.75rem;
	}
</style>
