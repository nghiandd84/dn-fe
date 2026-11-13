<script lang="ts">
	import '@dn-fe/ui/styles/global.css';
	import '$lib/styles/storefront.css';
	import { initFingerprint } from '@dn-fe/ui/fingerprint';
	import { Toaster } from '@dn-fe/ui';
	import { onMount } from 'svelte';

	let { children, data } = $props();

	onMount(() => {
		initFingerprint();
	});
</script>

<svelte:head>
	<title>Event Booking</title>
</svelte:head>

<header class="site-header">
	<a href="/" class="brand">🎟️ Event Booking</a>
	<nav class="header-actions">
		{#if data.authed}
			<a class="btn btn-secondary" href="/my-bookings" data-testid="my-bookings-cta">My bookings</a>
			<a class="btn btn-secondary" href="/logout" data-testid="logout-cta">Logout</a>
		{:else}
			<a class="btn btn-secondary" href={data.loginUrl} data-testid="login-cta">Login</a>
			<a class="btn btn-primary" href={data.signupUrl} data-testid="signup-cta">Sign Up</a>
		{/if}
	</nav>
</header>

{@render children()}

<Toaster />
