<script lang="ts">
	import { fingerprint } from '$lib/fingerprint';
	import { get } from 'svelte/store';
	import { LL, setLocale, locale } from '$i18n/i18n-util';
	import type { Locales } from '$i18n/i18n-util';
	import { SidebarFooter } from '@dn-fe/ui';

	let { data, children } = $props();

	const authResources: string[] = data.authResources || [];

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

	async function handleLogout() {
		const res = await fetch('/api/auth/logout', {
			method: 'POST',
			headers: { 'X-Client-Fingerprint': get(fingerprint) }
		});
		const body = await res.json();
		window.location.href = body?.data?.redirect || '/authenticate';
	}
</script>

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

<style>
	.admin-layout { display: flex; min-height: 100vh; }
	.sidebar { width: 220px; background: #1e1b4b; color: #fff; padding: 1.5rem 1rem; display: flex; flex-direction: column; }
	.sidebar h2 { font-size: 1.1rem; margin-bottom: 1.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #3730a3; }
	.sidebar nav { display: flex; flex-direction: column; gap: 0.3rem; flex: 1; }
	.sidebar nav a { color: #c7d2fe; padding: 0.5rem 0.7rem; border-radius: 4px; font-size: 0.9rem; }
	.sidebar nav a:hover { background: #3730a3; color: #fff; text-decoration: none; }
	.content { flex: 1; padding: 2rem; overflow-x: auto; }
</style>
