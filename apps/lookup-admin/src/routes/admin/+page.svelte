<script lang="ts">
	import { LL } from '$i18n/i18n-util';
</script>

<div class="dashboard">
	<div class="header">
		<div>
			<h1>{$LL.dashboard.title()}</h1>
			<p class="description">{$LL.dashboard.description()}</p>
		</div>
		<span class="badge">{$LL.dashboard.badge()}</span>
	</div>

	<div class="cards">
		<a href="/admin/lookup-types" class="card">
			<div class="card-icon">🗂️</div>
			<div class="card-body">
				<h3>{$LL.dashboard.resources.lookup_types()}</h3>
				<p>{$LL.dashboard.resource_desc.lookup_types()}</p>
			</div>
			<span class="card-arrow">→</span>
		</a>
	</div>
</div>

<style>
	/* lookup-admin dashboard — custom card layout (not stats grid pattern) */
	.dashboard { max-width: 960px; }
	.header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
	.header h1 { font-size: 1.6rem; font-weight: 700; color: #111; }
	.description { margin-top: 0.4rem; color: #6b7280; font-size: 0.9rem; }
	.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
	.card { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; text-decoration: none; color: inherit; transition: box-shadow 0.15s, border-color 0.15s; }
	.card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-color: #4f46e5; text-decoration: none; }
	.card-icon { font-size: 1.75rem; }
	.card-body { flex: 1; }
	.card-body h3 { font-size: 0.95rem; font-weight: 600; color: #111; margin-bottom: 0.2rem; }
	.card-body p { font-size: 0.82rem; color: #6b7280; }
	.card-arrow { font-size: 1.1rem; color: #9ca3af; }
</style>
