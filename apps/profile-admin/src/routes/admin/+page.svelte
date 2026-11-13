<script lang="ts">
	import { fingerprint } from '$lib/fingerprint';
	import { get } from 'svelte/store';
	import { LL } from '$i18n/i18n-util';

	type StatCard = {
		labelKey: keyof typeof $LL.dashboard.resources;
		endpoint: string;
		href: string;
		icon: string;
		color: string;
		descKey: keyof typeof $LL.dashboard.resource_desc;
	};

	const cards: StatCard[] = [
		{ labelKey: 'profiles', descKey: 'profiles', endpoint: 'profiles', href: '/admin/profiles', icon: '👤', color: '#6366f1' },
		{ labelKey: 'social_links', descKey: 'social_links', endpoint: 'social-links', href: '/admin/social-links', icon: '🔗', color: '#0ea5e9' },
		{ labelKey: 'user_preferences', descKey: 'user_preferences', endpoint: 'user-preferences', href: '/admin/user-preferences', icon: '⚙️', color: '#10b981' },
	];

	type StatState = { count: number | null; loading: boolean; error: boolean };
	let stats = $state<Record<string, StatState>>(
		Object.fromEntries(cards.map(c => [c.endpoint, { count: null, loading: true, error: false }]))
	);

	async function fetchCount(endpoint: string): Promise<void> {
		try {
			const res = await fetch(`/api/profile/${endpoint}?page=1&page_size=1`, {
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
		cards.forEach(c => fetchCount(c.endpoint));
	});

	const now = new Date();
	const timeLabel = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
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
					<span class="card-count">
						{#if stat.loading}
							<span class="count-skeleton"></span>
						{:else if stat.error}
							<span class="count-error">—</span>
						{:else}
							{stat.count ?? 0}
						{/if}
					</span>
				</div>
				<div class="card-arrow">→</div>
			</a>
		{/each}
	</div>
</div>



