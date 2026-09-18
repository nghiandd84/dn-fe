<script lang="ts">
	import '@dn-fe/ui/styles/global.css';
	import '$lib/styles/storefront.css';
	import { initFingerprint } from '@dn-fe/ui/fingerprint';
	import { Toaster } from '@dn-fe/ui';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		initFingerprint();
	});
</script>

<svelte:head>
	<title>Event Booking</title>
</svelte:head>

<header class="site-header">
	<a href="/" class="brand">🎟️ Event Booking</a>
</header>

{@render children()}

<Toaster />
