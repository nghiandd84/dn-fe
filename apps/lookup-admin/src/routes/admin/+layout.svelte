<script lang="ts">
	import { LL, setLocale, locale } from '$i18n/i18n-util';
	import type { Locales } from '$i18n/i18n-util';

	let { children } = $props();

	const navItems = $derived([
		{ href: '/admin', label: $LL.admin_panel.nav.dashboard() },
		{ href: '/admin/lookup-types', label: $LL.admin_panel.nav.lookup_types() },
	]);
</script>

<div class="admin-layout">
	<aside class="sidebar">
		<h2>{$LL.admin_panel.title()}</h2>
		<nav>
			{#each navItems as item}
				<a href={item.href}>{item.label}</a>
			{/each}
		</nav>
		<div class="lang-switcher">
			<button class:active={$locale === 'en-US'} onclick={() => setLocale('en-US' as Locales)}>EN</button>
			<button class:active={$locale === 'vi-VN'} onclick={() => setLocale('vi-VN' as Locales)}>VI</button>
		</div>
	</aside>
	<main class="content">
		{@render children()}
	</main>
</div>

<style>
	.admin-layout { display: flex; min-height: 100vh; }
	.sidebar { width: 220px; background: #1e1b4b; color: #fff; padding: 1.5rem 1rem; display: flex; flex-direction: column; }
	.sidebar h2 { font-size: 1.1rem; margin-bottom: 1.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #3730a3; }
	.sidebar nav { display: flex; flex-direction: column; gap: 0.3rem; flex: 1; }
	.sidebar nav a { color: #c7d2fe; padding: 0.5rem 0.7rem; border-radius: 4px; font-size: 0.9rem; }
	.sidebar nav a:hover { background: #3730a3; color: #fff; text-decoration: none; }
	.lang-switcher { display: flex; gap: 0.4rem; margin-top: 0.75rem; }
	.lang-switcher button { flex: 1; padding: 0.3rem 0; border: 1px solid #4338ca; border-radius: 4px; background: none; color: #a5b4fc; cursor: pointer; font-size: 0.75rem; font-weight: 600; }
	.lang-switcher button:hover { background: #3730a3; color: #fff; }
	.lang-switcher button.active { background: #4f46e5; color: #fff; border-color: #4f46e5; }
	.content { flex: 1; padding: 2rem; overflow-x: auto; }
</style>
