<script lang="ts">
	import { onMount } from 'svelte';
	import { initFingerprint } from '$lib/fingerprint';
	import { setLocale } from '$i18n/i18n-util';
	import type { Locales } from '$i18n/i18n-util';

	let { children, data } = $props();

	onMount(() => {
		initFingerprint();
		// Initialize locale from server-detected Accept-Language
		setLocale((data.lang as Locales) ?? 'en-US');
	});
</script>

{@render children()}

<style>
	:global(*) { margin: 0; padding: 0; box-sizing: border-box; }
	:global(body) { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; background: #f5f5f5; }
	:global(a) { color: #4f46e5; text-decoration: none; }
	:global(a:hover) { text-decoration: underline; }
</style>
