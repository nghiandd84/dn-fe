<script lang="ts">
	import { LL, setLocale, locale } from '$i18n/i18n-util';
	import type { Locales } from '$i18n/i18n-util';
	import { SidebarFooter } from '@dn-fe/ui';
	import '@dn-fe/ui/styles/admin-layout.css';
	import '@dn-fe/ui/styles/meta-detail.css';
	import '@dn-fe/ui/styles/action-badges.css';
	import '@dn-fe/ui/styles/search-bar.css';

	let { children, data } = $props();

	const bookingResources: string[] = data.bookingResources || [];

	const allNavItems = $derived([
		{ href: '/admin', label: $LL.admin_panel.nav.dashboard(), resource: null },
		{ href: '/admin/bookings', label: $LL.admin_panel.nav.bookings(), resource: 'bookings' },
		{ href: '/admin/booking-seats', label: $LL.admin_panel.nav.booking_seats(), resource: 'booking-seats' },
		{ href: '/admin/slots', label: $LL.admin_panel.nav.slots(), resource: 'slots' }
	]);

	const navItems = $derived(
		allNavItems.filter((item) => !item.resource || bookingResources.includes(item.resource))
	);

	async function handleLogout() {
		const res = await fetch('/admin/logout', { method: 'POST' });
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
