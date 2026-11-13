<script lang="ts">
	import { onMount } from 'svelte';
	import { initFingerprint } from '$lib/fingerprint';
	import { LL, setLocale } from '$i18n/i18n-util';
	import type { Locales } from '$i18n/i18n-util';
	import { Toaster } from '@dn-fe/ui';
	import '@dn-fe/ui/styles/global.css';

	let { children, data } = $props();

	onMount(() => {
		initFingerprint();
		setLocale((data.lang as Locales) ?? 'en-US');
	});
</script>

<svelte:head>
	<title>{$LL.admin_panel.title()}</title>
</svelte:head>

<Toaster />
{@render children()}
