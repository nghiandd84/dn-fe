<script lang="ts">
	import { page } from '$app/stores';
	import { LL } from '$i18n/i18n-util';

	let { data, children } = $props();

	const template = $derived(data.template);
	const id = $derived($page.params.id);

	const placeholdersHref = $derived(`/admin/email-templates/${id}/placeholders`);
	const translationsHref = $derived(`/admin/email-templates/${id}/translations`);

	const isPlaceholders = $derived($page.url.pathname.endsWith('/placeholders'));
	const isTranslations = $derived($page.url.pathname.endsWith('/translations'));
</script>

<div class="template-detail">
	<div class="detail-header">
		<a href="/admin/email-templates" class="back-link">{$LL.email_template_detail_layout.back()}</a>
		{#if template}
			<div class="template-info">
				<h1 class="template-name">{template.name}</h1>
				<div class="template-meta">
					{#if template.key}
						<span class="meta-badge key-badge">{template.key}</span>
					{/if}
					<span class="meta-badge" class:active-badge={template.is_active} class:inactive-badge={!template.is_active}>
						{template.is_active ? '● Active' : '○ Inactive'}
					</span>
					{#if template.description}
						<span class="meta-desc">{template.description}</span>
					{/if}
				</div>
			</div>
		{:else}
			<p class="not-found">{$LL.email_template_detail_layout.not_found()}</p>
		{/if}
	</div>

	<div class="tab-bar">
		<a href={placeholdersHref} class="tab" class:tab-active={isPlaceholders}>
			{$LL.email_template_detail_layout.tab_placeholders()}
		</a>
		<a href={translationsHref} class="tab" class:tab-active={isTranslations}>
			{$LL.email_template_detail_layout.tab_translations()}
		</a>
	</div>

	<div class="tab-content">
		{@render children()}
	</div>
</div>

<style>
	.template-detail {
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
	.back-link:hover { color: #4f46e5; }

	.template-name {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0 0 0.35rem;
		color: #111827;
	}

	.template-meta {
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
	}
	.active-badge {
		background: #f0fdf4;
		border-color: #bbf7d0;
		color: #15803d;
	}
	.inactive-badge {
		background: #f9fafb;
		border-color: #e5e7eb;
		color: #9ca3af;
	}

	.meta-desc {
		font-size: 0.82rem;
		color: #6b7280;
	}

	.not-found {
		color: #9ca3af;
		font-style: italic;
	}

	/* Tabs */
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
	.tab:hover { color: #4f46e5; }
	.tab-active {
		color: #4f46e5;
		border-bottom-color: #4f46e5;
		font-weight: 600;
	}

	.tab-content {
		min-height: 200px;
	}
</style>
