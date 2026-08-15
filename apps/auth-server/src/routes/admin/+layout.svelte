<script lang="ts">
	import { fingerprint } from '$lib/fingerprint';
	import { get } from 'svelte/store';
	import { LL, setLocale, locale } from '$i18n/i18n-util';
	import type { Locales } from '$i18n/i18n-util';
	import { SidebarFooter } from '@dn-fe/ui';
	import { page } from '$app/stores';
	import '@dn-fe/ui/styles/admin-layout.css';
	import '@dn-fe/ui/styles/meta-detail.css';
	import '@dn-fe/ui/styles/action-badges.css';
	import '@dn-fe/ui/styles/search-bar.css';

	let { data, children } = $props();

	const authResources = $derived<string[]>(data.authResources || []);

	const allNavItems = $derived([
		{ href: '/admin', label: $LL.admin_panel.nav.dashboard(), resource: null },
		{ href: '/admin/clients', label: $LL.admin_panel.nav.clients(), resource: 'clients' },
		{ href: '/admin/roles', label: $LL.admin_panel.nav.roles(), resource: 'roles' },
		{ href: '/admin/permissions', label: $LL.admin_panel.nav.permissions(), resource: 'permissions' },
		{ href: '/admin/field-permissions', label: $LL.admin_panel.nav.field_permissions(), resource: 'field-permissions' },
		{ href: '/admin/scopes', label: $LL.admin_panel.nav.scopes(), resource: 'scopes' },
		{ href: '/admin/users', label: $LL.admin_panel.nav.users(), resource: 'users' },
		{ href: '/admin/auth-codes', label: $LL.admin_panel.nav.auth_codes(), resource: 'auth-codes' },
		{ href: '/admin/tokens', label: $LL.admin_panel.nav.tokens(), resource: 'tokens' },
	]);

	const navItems = $derived(
		allNavItems.filter((item) => !item.resource || authResources.includes(item.resource))
	);

	const pageTitle = $derived(() => {
		const path = $page.url.pathname;
		const match = allNavItems.slice().reverse().find((item) =>
			item.href === '/admin' ? path === '/admin' : path.startsWith(item.href)
		);
		return match?.label ?? $LL.admin_panel.nav.dashboard();
	});

	async function handleLogout() {
		const res = await fetch('/api/auth/logout', {
			method: 'POST',
			headers: { 'X-Client-Fingerprint': get(fingerprint) }
		});
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

