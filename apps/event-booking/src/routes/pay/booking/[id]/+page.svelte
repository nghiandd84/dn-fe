<script lang="ts">
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	// Placeholder payment page for a promoted (real) booking.
	// The payment workflow will be implemented here later.
	const bookingId = get(page).params.id;
</script>

<svelte:head>
	<title>Payment — Event Booking</title>
</svelte:head>

<div class="page page-narrow">
	<div class="card" data-testid="pay-booking-card">
		<h1 class="page-title">Payment</h1>
		<div class="result-summary">
			<div class="row">
				<span class="muted">Booking ID</span>
				<span>{bookingId}</span>
			</div>
		</div>
		<div class="alert alert-info" role="status">
			The payment workflow for this booking is not implemented yet.
		</div>
		<a class="btn btn-secondary btn-block" href={`/result/${bookingId}`}>Back to booking</a>
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
</style>
