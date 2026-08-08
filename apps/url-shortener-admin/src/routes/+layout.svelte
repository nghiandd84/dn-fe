<script lang="ts">
	import '@dn-fe/ui/styles/global.css';
	import { LL, setLocale } from '$i18n/i18n-util';
	import type { Locales } from '$i18n/i18n-util';
	import { initFingerprint } from '$lib/fingerprint';
	import { onMount } from 'svelte';

	let { children, data } = $props();

	$effect(() => {
		setLocale((data.lang as Locales) ?? 'en-US');
	});

	onMount(() => {
		initFingerprint();
	});
</script>

<svelte:head>
	<title>{$LL.admin_panel.title()}</title>
</svelte:head>

{@render children()}
