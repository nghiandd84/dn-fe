<script lang="ts">
	import { fingerprint } from '$lib/fingerprint';
	import { get } from 'svelte/store';
	import { LL } from '$i18n/i18n-util';

	type StatCard = {
		labelKey: keyof typeof $LL.dashboard.resources;
		descKey: keyof typeof $LL.dashboard.resource_desc;
		endpoint: string;
		href: string;
		icon: string;
		color: string;
		/** When false, the card is a link only (no count is fetched/shown). */
		countable?: boolean;
	};

	const cards: StatCard[] = [
		{
			labelKey: 'bookings',
			descKey: 'bookings',
			endpoint: 'bookings',
			href: '/admin/bookings',
			icon: '📅',
			color: '#4f46e5',
			countable: true
		},
		{
			labelKey: 'booking_items',
			descKey: 'booking_items',
			endpoint: 'booking-items',
			href: '/admin/booking-items',
			icon: '🎟️',
			color: '#0ea5e9',
			countable: true
		},
		{
			labelKey: 'guest_bookings',
			descKey: 'guest_bookings',
			endpoint: 'guest-bookings',
			href: '/admin/guest-bookings',
			icon: '🧾',
			color: '#f59e0b',
			countable: true
		}
	];

	type StatState = { count: number | null; loading: boolean; error: boolean };
	let stats = $state<Record<string, StatState>>(
		Object.fromEntries(cards.map((c) => [c.endpoint, { count: null, loading: true, error: false }]))
	);

	async function fetchCount(endpoint: string): Promise<void> {
		try {
			const res = await fetch(`/api/booking/${endpoint}?page=1&page_size=1`, {
				headers: { 'X-Client-Fingerprint': get(fingerprint) }
			});
			const json = await res.json();
			const total = json?.data?.total_page ?? json?.total_page ?? null;
			stats[endpoint] = { count: total, loading: false, error: false };
		} catch {
			stats[endpoint] = { count: null, loading: false, error: true };
		}
	}

	$effect(() => {
		cards.filter((c) => c.countable).forEach((c) => fetchCount(c.endpoint));
	});

	const now = new Date();
	const timeLabel = now.toLocaleDateString(undefined, {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
</script>

<div class="dashboard">
	<div class="dash-header">
		<div>
			<h1 class="dash-title">{$LL.dashboard.title()}</h1>
			<p class="dash-subtitle">{timeLabel}</p>
		</div>
		<div class="dash-badge">{$LL.dashboard.badge()}</div>
	</div>

	<div class="stats-grid">
		{#each cards as card}
			{@const stat = stats[card.endpoint]}
			<a class="stat-card" href={card.href} style="--accent: {card.color}">
				<div class="card-icon">{card.icon}</div>
				<div class="card-body">
					<span class="card-label">{$LL.dashboard.resources[card.labelKey]()}</span>
					{#if card.countable}
						<span class="card-count">
							{#if stat.loading}
								<span class="count-skeleton"></span>
							{:else if stat.error}
								<span class="count-error">—</span>
							{:else}
								{stat.count ?? 0}
							{/if}
						</span>
					{:else}
						<span class="card-count card-count-lookup">{$LL.guest_bookings_page.lookup_button()}</span>
					{/if}
					<span class="card-desc">{$LL.dashboard.resource_desc[card.descKey]()}</span>
				</div>
				<div class="card-arrow">→</div>
			</a>
		{/each}
	</div>
</div>

<style>
	.card-count-lookup {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--accent, #f59e0b);
	}
</style>

