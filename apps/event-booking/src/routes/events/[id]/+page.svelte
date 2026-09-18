<script lang="ts">
	import type { EventData } from '$lib/types';
	import { SEAT_PRICE, DEFAULT_CURRENCY, MAX_SEATS_PER_BOOKING } from '$lib/types';
	import { seatSlots, toggleSeat, maxSelectable } from '$lib/seats';
	import { buildGuestBookingPayload, isValidEmail, createErrorMessage } from '$lib/booking';
	import { fingerprint } from '@dn-fe/ui/fingerprint';
	import { toast } from '@dn-fe/ui/toast';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	let { data } = $props();
	const event = $derived(data.event as EventData);

	const slots = $derived(seatSlots(event.total_seats));
	const cap = $derived(maxSelectable(event.total_seats));

	let selected = $state<number[]>([]);
	const atCap = $derived(selected.length >= cap);
	const total = $derived(selected.length * SEAT_PRICE);

	let email = $state('');
	let name = $state('');
	let submitting = $state(false);
	let errorMsg = $state('');
	const emailInvalid = $derived(email.length > 0 && !isValidEmail(email));

	function onToggle(seat: number) {
		selected = toggleSeat(selected, seat, event.total_seats);
	}

	async function submit() {
		errorMsg = '';
		if (selected.length === 0) {
			errorMsg = 'Please select at least one seat.';
			return;
		}
		if (!isValidEmail(email)) {
			errorMsg = 'Please enter a valid email address.';
			return;
		}

		submitting = true;
		try {
			const payload = buildGuestBookingPayload({
				eventId: event.id as string,
				seats: selected,
				guestEmail: email,
				guestName: name,
				siteOrigin: get(page).url.origin,
				currency: DEFAULT_CURRENCY
			});

			const res = await fetch('/api/booking/guest-bookings', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Client-Fingerprint': get(fingerprint)
				},
				body: JSON.stringify(payload)
			});

			const body = await res.json().catch(() => ({}));

			if (!res.ok) {
				errorMsg = createErrorMessage(res.status, body?.data?.error_type);
				return;
			}

			const id = body?.data?.id ?? body?.data;
			if (typeof id === 'string' && id) {
				try {
					localStorage.setItem('last_guest_booking_id', id);
				} catch {
					// localStorage may be unavailable; non-fatal
				}
			}

			toast.success('Booking created — check your email to confirm.');
			await goto(`/check-email?email=${encodeURIComponent(email)}`);
		} catch {
			errorMsg = 'Network error — please try again.';
		} finally {
			submitting = false;
		}
	}

	function formatDate(iso: string | null): string {
		if (!iso) return 'Date TBA';
		const d = new Date(iso);
		return isNaN(d.getTime())
			? 'Date TBA'
			: d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
	}
</script>

<svelte:head>
	<title>{event.event_name ?? 'Event'} — Event Booking</title>
</svelte:head>

<div class="page">
	<a href="/" class="back-link">← All events</a>

	<h1 class="page-title">{event.event_name ?? 'Untitled event'}</h1>

	<div class="detail-meta">
		<span>📅 {formatDate(event.event_date)}</span>
		{#if event.venue_name}<span>📍 {event.venue_name}</span>{/if}
		{#if event.status}
			<span class={`status-badge status-${event.status.toUpperCase()}`}>{event.status}</span>
		{/if}
	</div>

	<section class="card seat-section">
		<h2 class="section-title">Select your seats</h2>
		<p class="muted">
			Choose up to {MAX_SEATS_PER_BOOKING} seats · {SEAT_PRICE}
			{DEFAULT_CURRENCY} each
		</p>

		{#if slots.length === 0}
			<div class="alert alert-warning">No seats are available for this event.</div>
		{:else}
			<div class="seat-grid" role="group" aria-label="Seat selection" data-testid="seat-grid">
				{#each slots as seat (seat)}
					{@const isSelected = selected.includes(seat)}
					<button
						type="button"
						class="seat"
						class:selected={isSelected}
						aria-pressed={isSelected}
						disabled={!isSelected && atCap}
						data-testid="seat"
						onclick={() => onToggle(seat)}
					>
						{seat}
					</button>
				{/each}
			</div>

			{#if atCap}
				<p class="alert alert-info" data-testid="cap-notice">
					You've reached the maximum of {cap} seats.
				</p>
			{/if}

			<div class="summary" data-testid="summary">
				<div>
					<strong>{selected.length}</strong> seat{selected.length === 1 ? '' : 's'} selected
					{#if selected.length > 0}
						<span class="muted"> · {selected.join(', ')}</span>
					{/if}
				</div>
				<div class="total">Total: {total} {DEFAULT_CURRENCY}</div>
			</div>

			<form
				class="guest-form"
				onsubmit={(e) => {
					e.preventDefault();
					submit();
				}}
			>
				<div class="field">
					<label for="guest-email">Email <span aria-hidden="true">*</span></label>
					<input
						id="guest-email"
						type="email"
						autocomplete="email"
						class:invalid={emailInvalid}
						bind:value={email}
						placeholder="you@example.com"
						required
						data-testid="email"
					/>
					{#if emailInvalid}
						<p class="field-error">Enter a valid email address.</p>
					{/if}
				</div>

				<div class="field">
					<label for="guest-name">Name <span class="muted">(optional)</span></label>
					<input
						id="guest-name"
						type="text"
						autocomplete="name"
						bind:value={name}
						placeholder="Your name"
						data-testid="name"
					/>
				</div>

				{#if errorMsg}
					<div class="alert alert-error" role="alert" data-testid="error">{errorMsg}</div>
				{/if}

				<button
					type="submit"
					class="btn btn-primary btn-block"
					disabled={selected.length === 0 || submitting}
					data-testid="continue"
				>
					{submitting ? 'Creating booking…' : 'Continue to booking'}
				</button>
			</form>
		{/if}
	</section>
</div>

<style>
	.back-link {
		display: inline-block;
		margin-bottom: 1rem;
		font-size: 0.85rem;
		color: var(--text-muted);
	}
	.detail-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: center;
		margin-bottom: 1.5rem;
		color: var(--text-secondary);
		font-size: 0.9rem;
	}
	.seat-section {
		margin-top: 1rem;
	}
	.section-title {
		font-size: 1.1rem;
		font-weight: 600;
		margin: 0 0 0.25rem;
	}
	.seat-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
		gap: 0.5rem;
		margin: 1.25rem 0;
	}
	.seat {
		aspect-ratio: 1;
		border: 1px solid var(--border);
		border-radius: 6px;
		background: var(--surface);
		font-size: 0.85rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.1s;
	}
	.seat:hover:not(:disabled) {
		border-color: var(--primary);
	}
	.seat.selected {
		background: var(--primary);
		border-color: var(--primary);
		color: #fff;
	}
	.seat:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
	.summary {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 0;
		border-top: 1px solid var(--border);
		margin: 1rem 0;
	}
	.total {
		font-weight: 600;
	}
	.guest-form {
		margin-top: 0.5rem;
	}
	.field-error {
		color: var(--error);
		font-size: 0.8rem;
		margin: 0.35rem 0 0;
	}
</style>
