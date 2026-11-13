<script lang="ts">
	import type { BookingData } from '$lib/types';
	import { DEFAULT_CURRENCY } from '$lib/types';

	let { data } = $props();
	const bookings = $derived(data.bookings as BookingData[]);

	function formatDate(iso: string | null): string {
		if (!iso) return '';
		const d = new Date(iso);
		if (isNaN(d.getTime())) return '';
		return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
	}

	function seatCount(b: BookingData): number {
		return Array.isArray(b.items) ? b.items.length : 0;
	}
</script>

<svelte:head>
	<title>My bookings — Event Booking</title>
</svelte:head>

<div class="page">
	<h1 class="page-title">My bookings</h1>

	{#if !data.ok}
		<div class="alert alert-error" role="alert">
			Could not load your bookings. Please try again later.
		</div>
	{:else if bookings.length === 0}
		<p class="muted">You have no confirmed bookings yet.</p>
		<a class="btn btn-primary" href="/">Browse events</a>
	{:else}
		<ul class="booking-list" data-testid="booking-list">
			{#each bookings as booking (booking.id)}
				<li>
					<a class="card booking-card" href={`/result/${booking.id}`} data-testid="booking-card">
						<div class="booking-head">
							<span class="booking-ref">
								{booking.booking_reference ?? booking.id}
							</span>
							<span class={`status-badge status-${(booking.status ?? '').toUpperCase()}`}>
								{booking.status ?? 'BOOKED'}
							</span>
						</div>
						<div class="booking-meta">
							{#if seatCount(booking) > 0}
								<span>🎫 {seatCount(booking)} seat{seatCount(booking) === 1 ? '' : 's'}</span>
							{/if}
							<span>
								💳 {booking.total_amount ?? 0} {booking.currency ?? DEFAULT_CURRENCY}
							</span>
							{#if formatDate(booking.created_at)}
								<span>📅 {formatDate(booking.created_at)}</span>
							{/if}
						</div>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.booking-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.booking-card {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		color: var(--text);
	}
	.booking-card:hover {
		text-decoration: none;
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
	}
	.booking-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}
	.booking-ref {
		font-weight: 600;
	}
	.booking-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		font-size: 0.85rem;
		color: var(--text-muted);
	}
</style>
