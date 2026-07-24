<script lang="ts">
	import { onMount } from 'svelte';
	import { initFingerprint } from '$lib/fingerprint';
	import { setLocale } from '$i18n/i18n-util';
	import type { Locales } from '$i18n/i18n-util';
	import '@dn-fe/ui/styles/global.css';

	let { children, data } = $props();

	onMount(() => {
		initFingerprint();
		setLocale((data.lang as Locales) ?? 'en-US');
	});
</script>

{@render children()}
