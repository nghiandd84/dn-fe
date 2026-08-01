<script lang="ts">
	import '@dn-fe/ui/styles/global.css';
	import { setLocale } from '$i18n/i18n-util';
	import type { Locales } from '$i18n/i18n-util';
	import { initFingerprint } from '$lib/fingerprint';
	import { onMount } from 'svelte';

	let { children, data } = $props();

	setLocale((data.lang as Locales) ?? 'en-US');

	onMount(() => {
		initFingerprint();
	});
</script>

{@render children()}
