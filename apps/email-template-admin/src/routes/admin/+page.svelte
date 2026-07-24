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
		{ labelKey: 'email_templates', descKey: 'email_templates', endpoint: 'email-templates', href: '/admin/email-templates', icon: '📧', color: '#6366f1' },
		{ labelKey: 'template_placeholders', descKey: 'template_placeholders', endpoint: 'template-placeholders', href: '/admin/template-placeholders', icon: '🔤', color: '#0ea5e9' },
		{ labelKey: 'template_translations', descKey: 'template_translations', endpoint: 'template-translations', href: '/admin/template-translations', icon: '🌐', color: '#10b981' },
	];

	type StatState = { count: number | null; loading: boolean; error: boolean };
	let stats = $state<Record<string, StatState>>(
		Object.fromEntries(cards.map(c => [c.endpoint, { count: null, loading: true, error: false }]))
	);

	async function fetchCount(endpoint: string): Promise<void> {
		try {
			const res = await fetch(`/api/email-template/${endpoint}?page=1&page_size=1`, {
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
					<span class="card-desc">{$LL.dashboard.resource_desc[card.descKey]()}</span>
				</div>
				<div class="card-arrow">→</div>
			</a>
		{/each}
	</div>
</div>

<style>
	.dashboard { display: flex; flex-direction: column; gap: 2rem; }

	/* Header */
	.dash-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.dash-title {
		margin: 0;
		font-size: 1.6rem;
		font-weight: 700;
		color: #111;
	}
	.dash-subtitle {
		margin: 0.2rem 0 0;
		font-size: 0.85rem;
		color: #9ca3af;
	}
	.dash-badge {
		background: #1e1b4b;
		color: #c7d2fe;
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.3rem 0.8rem;
		border-radius: 99px;
		letter-spacing: 0.05em;
	}

	/* Stats grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 1rem;
	}
	.stat-card {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		padding: 1rem 1.1rem;
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 10px;
		text-decoration: none;
		color: inherit;
		transition: box-shadow 0.15s, transform 0.15s;
		position: relative;
		border-left: 4px solid var(--accent);
	}
	.stat-card:hover {
		box-shadow: 0 4px 16px rgba(0,0,0,0.08);
		transform: translateY(-2px);
		text-decoration: none;
	}
	.card-icon {
		font-size: 1.6rem;
		line-height: 1;
		flex-shrink: 0;
	}
	.card-body {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		min-width: 0;
	}
	.card-label {
		font-size: 0.78rem;
		font-weight: 600;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.card-count {
		font-size: 1.65rem;
		font-weight: 700;
		color: var(--accent);
		line-height: 1;
		min-height: 1.65rem;
		display: flex;
		align-items: center;
	}
	.card-desc {
		font-size: 0.72rem;
		color: #9ca3af;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.count-skeleton {
		display: inline-block;
		width: 2.5rem;
		height: 1.4rem;
		background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
		background-size: 200% 100%;
		animation: shimmer 1.2s infinite;
		border-radius: 4px;
	}
	@keyframes shimmer {
		0%   { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}
	.count-error { font-size: 1rem; color: #9ca3af; }
	.card-arrow {
		font-size: 0.9rem;
		color: #d1d5db;
		flex-shrink: 0;
		transition: color 0.15s, transform 0.15s;
	}
	.stat-card:hover .card-arrow {
		color: var(--accent);
		transform: translateX(3px);
	}
</style>
