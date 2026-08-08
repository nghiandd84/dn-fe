<script lang="ts">
	import { LL, setLocale, locale } from '$i18n/i18n-util';
	import type { Locales } from '$i18n/i18n-util';
	import { page } from '$app/stores';
	import { SidebarFooter } from '@dn-fe/ui';
	import '@dn-fe/ui/styles/admin-layout.css';
	import '@dn-fe/ui/styles/meta-detail.css';
	import '@dn-fe/ui/styles/action-badges.css';
	import '@dn-fe/ui/styles/search-bar.css';

	let { children, data } = $props();

	const lookupResources: string[] = data.lookupResources || [];

	const allNavItems = $derived([
		{ href: '/admin', label: $LL.admin_panel.nav.dashboard(), resource: null },
		{ href: '/admin/lookup-types', label: $LL.admin_panel.nav.lookup_types(), resource: 'lookup-types' },
		{ href: '/admin/items', label: $LL.admin_panel.nav.lookup_items(), resource: 'lookup-items' },
		{ href: '/admin/translations', label: $LL.admin_panel.nav.lookup_item_translations(), resource: 'lookup-item-translations' },
	]);

	const navItems = $derived(
		allNavItems.filter((item) => !item.resource || lookupResources.includes(item.resource))
	);

	const pageTitle = $derived(() => {
		const path = $page.url.pathname;
		const match = allNavItems.slice().reverse().find((item) =>
			item.href === '/admin' ? path === '/admin' : path.startsWith(item.href)
		);
		return match?.label ?? $LL.admin_panel.nav.dashboard();
	});

	async function handleLogout() {
		const res = await fetch('/admin/logout', { method: 'POST' });
		const body = await res.json();
		window.location.href = body?.data?.redirect || '/authenticate';
	}
</script>

<svelte:head>
	<title>{$LL.admin_panel.title()} - {pageTitle()}</title>
</svelte:head>

<div class="admin-layout">
	<aside class="sidebar">
		<h2>{$LL.admin_panel.title()}</h2>
		<nav>
			{#each navItems as item}
				<a href={item.href}>{item.label}</a>
			{/each}
		</nav>
		<SidebarFooter
			logoutLabel={$LL.admin_panel.logout()}
			onLogout={handleLogout}
			locale={$locale}
			onLocaleChange={(loc) => setLocale(loc as Locales)}
		/>
	</aside>
	<main class="content">
		{@render children()}
	</main>
</div>

