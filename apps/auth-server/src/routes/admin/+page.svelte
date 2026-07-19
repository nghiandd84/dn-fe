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
		{ labelKey: 'users',             descKey: 'users',             endpoint: 'users',             href: '/admin/users',             icon: '👤', color: '#6366f1' },
		{ labelKey: 'roles',             descKey: 'roles',             endpoint: 'roles',             href: '/admin/roles',             icon: '🛡️', color: '#0ea5e9' },
		{ labelKey: 'permissions',       descKey: 'permissions',       endpoint: 'permissions',       href: '/admin/permissions',       icon: '🔑', color: '#f59e0b' },
		{ labelKey: 'field_permissions', descKey: 'field_permissions', endpoint: 'field-permissions', href: '/admin/field-permissions', icon: '🔒', color: '#8b5cf6' },
		{ labelKey: 'clients',           descKey: 'clients',           endpoint: 'clients',           href: '/admin/clients',           icon: '🖥️', color: '#10b981' },
		{ labelKey: 'scopes',            descKey: 'scopes',            endpoint: 'scopes',            href: '/admin/scopes',            icon: '📋', color: '#ec4899' },
		{ labelKey: 'tokens',            descKey: 'tokens',            endpoint: 'tokens',            href: '/admin/tokens',            icon: '🎟️', color: '#f97316' },
		{ labelKey: 'auth_codes',        descKey: 'auth_codes',        endpoint: 'auth-codes',        href: '/admin/auth-codes',        icon: '📨', color: '#14b8a6' },
	];

	type StatState = { count: number | null; loading: boolean; error: boolean };
	let stats = $state<Record<string, StatState>>(
		Object.fromEntries(cards.map(c => [c.endpoint, { count: null, loading: true, error: false }]))
	);

	async function fetchCount(endpoint: string): Promise<void> {
		try {
			const res = await fetch(`/api/admin/${endpoint}?page=1&page_size=1`, {
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

	<div class="dash-info">
		<div class="info-card">
			<h2 class="info-title">{$LL.dashboard.quick_ref_title()}</h2>
			<ul class="info-list">
				{#each cards as card}
					<li>
						<span class="info-dot" style="background:{card.color}"></span>
						<span><strong>{$LL.dashboard.resources[card.labelKey]()}</strong> — {$LL.dashboard.resource_desc[card.descKey]()}</span>
					</li>
				{/each}
			</ul>
		</div>

		<div class="info-card">
			<h2 class="info-title">{$LL.dashboard.action_values_title()}</h2>
			<table class="ref-table">
				<thead>
					<tr>
						<th>{$LL.dashboard.col_action()}</th>
						<th>{$LL.dashboard.col_bit()}</th>
						<th>{$LL.dashboard.col_description()}</th>
					</tr>
				</thead>
				<tbody>
					<tr><td><span class="action-badge read">READ</span></td><td class="mono">1</td><td>{$LL.dashboard.action_desc.read()}</td></tr>
					<tr><td><span class="action-badge create">CREATE</span></td><td class="mono">2</td><td>{$LL.dashboard.action_desc.create()}</td></tr>
					<tr><td><span class="action-badge update">UPDATE</span></td><td class="mono">4</td><td>{$LL.dashboard.action_desc.update()}</td></tr>
					<tr><td><span class="action-badge delete">DELETE</span></td><td class="mono">8</td><td>{$LL.dashboard.action_desc.delete()}</td></tr>
					<tr><td><span class="action-badge admin">ADMIN</span></td><td class="mono">16</td><td>{$LL.dashboard.action_desc.admin()}</td></tr>
				</tbody>
			</table>
			<p class="ref-note">{$LL.dashboard.mask_note({ example: '5' })}</p>

			<h2 class="info-title" style="margin-top:1.25rem">{$LL.dashboard.field_action_values_title()}</h2>
			<table class="ref-table">
				<thead>
					<tr>
						<th>{$LL.dashboard.col_action()}</th>
						<th>{$LL.dashboard.col_value()}</th>
						<th>{$LL.dashboard.col_description()}</th>
					</tr>
				</thead>
				<tbody>
					<tr><td><span class="action-badge read">READ</span></td><td class="mono">1</td><td>{$LL.dashboard.action_desc.field_read()}</td></tr>
					<tr><td><span class="action-badge update">UPDATE</span></td><td class="mono">4</td><td>{$LL.dashboard.action_desc.field_update()}</td></tr>
				</tbody>
			</table>
		</div>
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
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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

	/* Info section */
	.dash-info {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
	@media (max-width: 900px) {
		.dash-info { grid-template-columns: 1fr; }
	}
	.info-card {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 10px;
		padding: 1.25rem 1.4rem;
	}
	.info-title {
		margin: 0 0 0.85rem;
		font-size: 0.9rem;
		font-weight: 700;
		color: #374151;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.info-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}
	.info-list li {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-size: 0.85rem;
		color: #374151;
		line-height: 1.4;
	}
	.info-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	/* Reference table */
	.ref-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.82rem;
	}
	.ref-table th {
		text-align: left;
		padding: 0.3rem 0.5rem;
		color: #9ca3af;
		font-weight: 600;
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		border-bottom: 1px solid #e5e7eb;
	}
	.ref-table td {
		padding: 0.35rem 0.5rem;
		border-bottom: 1px solid #f3f4f6;
		color: #374151;
		vertical-align: middle;
	}
	.ref-table tr:last-child td { border-bottom: none; }
	.mono {
		font-family: monospace;
		font-size: 0.82rem;
		color: #6b7280;
	}
	.ref-note {
		margin: 0.6rem 0 0;
		font-size: 0.78rem;
		color: #9ca3af;
	}

	/* Action badges */
	.action-badge {
		display: inline-block;
		font-size: 0.65rem;
		font-weight: 700;
		border-radius: 3px;
		padding: 0.05rem 0.45rem;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}
	.action-badge.read   { background: #dbeafe; color: #1d4ed8; }
	.action-badge.create { background: #dcfce7; color: #15803d; }
	.action-badge.update { background: #fef9c3; color: #a16207; }
	.action-badge.delete { background: #fee2e2; color: #b91c1c; }
	.action-badge.admin  { background: #f3e8ff; color: #7e22ce; }
</style>
