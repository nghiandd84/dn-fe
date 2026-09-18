<script lang="ts">
	import type { BookingData } from '$lib/types';
	import { DEFAULT_CURRENCY } from '$lib/types';

	let { data } = $props();
	const booking = $derived(data.booking as BookingData | null);

	const seatCount = $derived(Array.isArray(booking?.items) ? booking!.items!.length : 0);
</script>

<svelte:head>
	<title>Booking confirmed — Event Booking</title>
</svelte:head>

<div class="page page-narrow">
	<div class="card" data-testid="result-card">
		{#if data.ok && booking}
			<h1 class="page-title">You're all set 🎉</h1>
			<span class={`status-badge status-${(booking.status ?? '').toUpperCase()}`}>
				{booking.status ?? 'BOOKED'}
			</span>

			<div class="result-summary">
				{#if booking.booking_reference}
					<div class="row">
						<span class="muted">Reference</span>
						<strong>{booking.booking_reference}</strong>
					</div>
				{/if}
				<div class="row">
					<span class="muted">Booking ID</span>
					<span>{booking.id ?? data.bookingId}</span>
				</div>
				{#if seatCount > 0}
					<div class="row">
						<span class="muted">Seats</span>
						<span>{seatCount}</span>
					</div>
				{/if}
				<div class="row">
					<span class="muted">Total paid</span>
					<strong>{booking.total_amount ?? 0} {booking.currency ?? DEFAULT_CURRENCY}</strong>
				</div>
			</div>

			<p class="muted">A confirmation has been sent to your email.</p>
			<a class="btn btn-primary btn-block" href="/">Browse more events</a>
		{:else}
			<h1 class="page-title">Booking not found</h1>
			<div class="alert alert-error" role="alert">
				{#if data.status === 401}
					Your session expired. Please sign in again.
				{:else}
					We couldn't load this booking. It may still be processing.
				{/if}
			</div>
			<a class="btn btn-secondary btn-block" href="/">Browse events</a>
		{/if}
	</div>
</div>

<style>
	.result-summary {
		margin: 1rem 0;
	}
	.result-summary .row {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--border);
	}
	.status-badge {
		display: inline-block;
		margin-bottom: 0.5rem;
	}
</style>
