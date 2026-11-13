<script lang="ts">
	import { page } from '$app/stores';
	const email = $derived($page.url.searchParams.get('email') ?? '');
</script>

<svelte:head>
	<title>Check your email — Event Booking</title>
</svelte:head>

<div class="page page-narrow">
	<div class="card" data-testid="check-email">
		<h1 class="page-title">Check your email 📬</h1>
		<p>
			We've sent a confirmation link
			{#if email}
				to <strong>{email}</strong>
			{/if}. Open it to confirm your booking and continue to payment.
		</p>
		<p class="muted">
			The link expires shortly, so please confirm soon. If you don't see the email, check your
			spam folder.
		</p>
		<a class="btn btn-secondary btn-block" href="/">Back to events</a>
	</div>
</div>
