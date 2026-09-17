<script lang="ts">
	import { LL, setLocale, locale } from '$i18n/i18n-util';
	import type { Locales } from '$i18n/i18n-util';
	import { SidebarFooter, Toaster } from '@dn-fe/ui';
	import { page } from '$app/stores';
	import '@dn-fe/ui/styles/admin-layout.css';
	import '@dn-fe/ui/styles/meta-detail.css';
	import '@dn-fe/ui/styles/action-badges.css';
	import '@dn-fe/ui/styles/search-bar.css';
	import '@dn-fe/ui/styles/form.css';
	import '@dn-fe/ui/styles/modal.css';
	import '@dn-fe/ui/styles/dashboard.css';

	let { children, data } = $props();

	const bookingResources = $derived<string[]>(data.bookingResources || []);

	const allNavItems = $derived([
		{ href: '/admin', label: $LL.admin_panel.nav.dashboard(), resource: null },
		{ href: '/admin/bookings', label: $LL.admin_panel.nav.bookings(), resource: 'bookings' },
		{ href: '/admin/booking-items', label: $LL.admin_panel.nav.booking_items(), resource: 'booking-items' },
		{ href: '/admin/guest-bookings', label: $LL.admin_panel.nav.guest_bookings(), resource: 'bookings' }
	]);

	const navItems = $derived(
		allNavItems.filter((item) => !item.resource || bookingResources.includes(item.resource))
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

<Toaster />
