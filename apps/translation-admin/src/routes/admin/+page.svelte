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
	};

	const cards: StatCard[] = [
		{
			labelKey: 'projects',
			descKey: 'projects',
			endpoint: 'projects',
			href: '/admin/projects',
			icon: '📁',
			color: '#6366f1'
		},
		{
			labelKey: 'tags',
			descKey: 'tags',
			endpoint: 'tags',
			href: '/admin/tags',
			icon: '🏷️',
			color: '#0ea5e9'
		},
		{
			labelKey: 'translation_keys',
			descKey: 'translation_keys',
			endpoint: 'translation-keys',
			href: '/admin/translation-keys',
			icon: '🔑',
			color: '#10b981'
		},
		{
			labelKey: 'translation_versions',
			descKey: 'translation_versions',
			endpoint: 'translation-versions',
			href: '/admin/translation-versions',
			icon: '🌐',
			color: '#f59e0b'
		}
	];

	type StatState = { count: number | null; loading: boolean; error: boolean };
	let stats = $state<Record<string, StatState>>(
		Object.fromEntries(cards.map((c) => [c.endpoint, { count: null, loading: true, error: false }]))
	);

	async function fetchCount(endpoint: string): Promise<void> {
		try {
			const res = await fetch(`/api/translation/${endpoint}?page=1&page_size=1`, {
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
		cards.forEach((c) => fetchCount(c.endpoint));
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
					<span class="card-count">
						{#if stat.loading}
							<span class="count-skeleton"></span>
						{:else if stat.error}
							<span class="count-error">—</span>
						{:else}
							{stat.count ?? 0}
						{/if}
					</span>
					<span class="card-desc">{$LL.dashboard.resource_desc[card.descKey]()}</span>
				</div>
				<div class="card-arrow">→</div>
			</a>
		{/each}
	</div>
</div>

<style>
	.dashboard {
		padding: 1.5rem;
	}
	.dash-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 2rem;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.dash-title {
		font-size: 1.6rem;
		font-weight: 700;
		margin: 0 0 0.25rem;
	}
	.dash-subtitle {
		color: #6b7280;
		font-size: 0.9rem;
		margin: 0;
	}
	.dash-badge {
		background: #6366f1;
		color: #fff;
		padding: 0.35rem 0.9rem;
		border-radius: 999px;
		font-size: 0.78rem;
		font-weight: 600;
		white-space: nowrap;
	}
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 1.25rem;
	}
	.stat-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem 1.5rem;
		background: #fff;
		border: 1px solid #e5e7eb;
		border-left: 4px solid var(--accent, #6366f1);
		border-radius: 10px;
		text-decoration: none;
		color: inherit;
		transition: box-shadow 0.15s;
	}
	.stat-card:hover {
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
	}
	.card-icon {
		font-size: 2rem;
		flex-shrink: 0;
	}
	.card-body {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.card-label {
		font-weight: 600;
		font-size: 0.95rem;
	}
	.card-count {
		font-size: 1.6rem;
		font-weight: 800;
		color: var(--accent, #6366f1);
		line-height: 1.1;
	}
	.count-skeleton {
		display: inline-block;
		width: 2.5rem;
		height: 1.4rem;
		background: #e5e7eb;
		border-radius: 4px;
		animation: pulse 1.2s ease-in-out infinite;
	}
	.count-error {
		color: #9ca3af;
	}
	.card-desc {
		font-size: 0.8rem;
		color: #6b7280;
	}
	.card-arrow {
		font-size: 1.2rem;
		color: #9ca3af;
		flex-shrink: 0;
	}
	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.4; }
	}
</style>
