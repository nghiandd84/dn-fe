<script lang="ts">
	import { page } from '$app/stores';
	import { LL } from '$i18n/i18n-util';

	let { data, children } = $props();

	const project = $derived(data.project);
	const id = $derived($page.params.id);

	const translationKeysHref = $derived(`/admin/projects/${id}/translation-keys`);
	const isTranslationKeys = $derived($page.url.pathname.endsWith('/translation-keys'));
</script>

<div class="project-detail">
	<div class="detail-header">
		<a href="/admin/projects" class="back-link">{$LL.project_detail_layout.back()}</a>
		{#if project}
			<div class="project-info">
				<h1 class="project-name">{project.name}</h1>
				<div class="project-meta">
					{#if project.api_key}
						<span class="meta-badge key-badge" title="API Key">{project.api_key}</span>
					{/if}
					{#if project.default_locale}
						<span class="meta-badge locale-badge">🌐 {project.default_locale}</span>
					{/if}
				</div>
			</div>
		{:else}
			<p class="not-found">{$LL.project_detail_layout.not_found()}</p>
		{/if}
	</div>

	<div class="tab-bar">
		<a href={translationKeysHref} class="tab" class:tab-active={isTranslationKeys}>
			{$LL.project_detail_layout.tab_translation_keys()}
		</a>
	</div>

	<div class="tab-content">
		{@render children()}
	</div>
</div>

<style>
	.project-detail {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.detail-header {
		padding: 1rem 0 0.75rem;
		border-bottom: 1px solid #e5e7eb;
		margin-bottom: 0;
	}

	.back-link {
		display: inline-block;
		font-size: 0.82rem;
		color: #6b7280;
		text-decoration: none;
		margin-bottom: 0.5rem;
		transition: color 0.15s;
	}
	.back-link:hover { color: #6366f1; }

	.project-name {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0 0 0.35rem;
		color: #111827;
	}

	.project-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.meta-badge {
		display: inline-flex;
		align-items: center;
		padding: 0.15rem 0.55rem;
		border-radius: 99px;
		font-size: 0.75rem;
		font-weight: 600;
		border: 1px solid #e5e7eb;
		background: #f3f4f6;
		color: #374151;
	}
	.key-badge {
		font-family: monospace;
		background: #eff6ff;
		border-color: #bfdbfe;
		color: #1d4ed8;
		max-width: 20ch;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.locale-badge {
		background: #f0fdf4;
		border-color: #bbf7d0;
		color: #15803d;
	}

	.not-found {
		color: #9ca3af;
		font-style: italic;
	}

	.tab-bar {
		display: flex;
		gap: 0;
		border-bottom: 2px solid #e5e7eb;
		margin-bottom: 1.25rem;
	}

	.tab {
		padding: 0.55rem 1.1rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: #6b7280;
		text-decoration: none;
		border-bottom: 2px solid transparent;
		margin-bottom: -2px;
		transition: color 0.15s, border-color 0.15s;
	}
	.tab:hover { color: #6366f1; }
	.tab-active {
		color: #6366f1;
		border-bottom-color: #6366f1;
		font-weight: 600;
	}

	.tab-content {
		min-height: 200px;
	}
</style>
