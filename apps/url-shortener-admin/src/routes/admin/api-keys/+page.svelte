<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { LL } from '$i18n/i18n-util';
	import { maskToCrudActions } from '@dn-fe/ui/types';

	let { data } = $props();
	const actions = $derived(maskToCrudActions((data as any).authMasks?.['api-keys'] ?? 0));

	function formatDate(v: string | null): string {
		if (!v) return '—';
		try { return new Date(v).toLocaleString(); } catch { return v; }
	}

	function formatBool(v: boolean | null): string {
		if (v === null || v === undefined) return '—';
		return v ? '✅' : '❌';
	}

	// Store the newly created key to display it once
	let newlyCreatedKey = $state<{ id: string; key: string; name: string } | null>(null);
	let showKeyBanner = $state(false);

	function handleCreateSuccess(result: unknown) {
		const r = result as { id?: string; key?: string; name?: string };
		if (r?.key) {
			newlyCreatedKey = { id: r.id ?? '', key: r.key, name: r.name ?? '' };
			showKeyBanner = true;
		}
	}

	function dismissBanner() {
		showKeyBanner = false;
		newlyCreatedKey = null;
	}
</script>

<h1>{$LL.api_keys_page.title()}</h1>

{#if showKeyBanner && newlyCreatedKey}
	<div class="key-banner">
		<div class="key-banner-header">
			<span class="key-banner-title">🔑 New API Key Created</span>
			<button class="key-banner-close" onclick={dismissBanner}>×</button>
		</div>
		<p class="key-banner-note">{$LL.api_keys_page.key_note()}</p>
		<div class="key-value">
			<code>{newlyCreatedKey.key}</code>
			<button
				class="copy-btn"
				onclick={() => navigator.clipboard.writeText(newlyCreatedKey!.key)}
			>📋 Copy</button>
		</div>
	</div>
{/if}

<CrudTable
	resource="api-keys"
	apiPrefix="/api/url-shortener"
	columns={[
		{ key: 'id', label: $LL.api_keys_page.col_id(), sortable: false, hideInTable: true },
		{
			key: 'name',
			label: $LL.api_keys_page.col_name(),
			sortable: true,
			filterable: true,
			operators: ['li', 'sw']
		},
		{
			key: 'is_active',
			label: $LL.api_keys_page.col_is_active(),
			sortable: false,
			format: (v) => formatBool(v as boolean)
		},
		{
			key: 'last_used_at',
			label: $LL.api_keys_page.col_last_used_at(),
			sortable: true,
			format: formatDate
		},
		{
			key: 'created_at',
			label: $LL.api_keys_page.col_created_at(),
			sortable: true,
			format: formatDate
		}
	]}
	formFields={[
		{ key: 'name', label: $LL.api_keys_page.col_name(), type: 'text', required: true }
	]}
	{actions}
	onCreateSuccess={handleCreateSuccess}
>
	{#snippet detailSnippet(item)}
		<div class="meta-detail">
			<div class="meta-row">
				<span class="meta-label">{$LL.api_keys_page.col_id()}</span>
				<span class="mono">{item.id}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.api_keys_page.col_user_id()}</span>
				<span class="mono">{item.user_id ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.api_keys_page.col_name()}</span>
				<span>{item.name ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.api_keys_page.col_is_active()}</span>
				<span class="action-badge action-{item.is_active ? 'active' : 'revoked'}">{item.is_active ? 'Active' : 'Revoked'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.api_keys_page.col_last_used_at()}</span>
				<span>{formatDate(item.last_used_at)}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.api_keys_page.col_created_at()}</span>
				<span>{formatDate(item.created_at)}</span>
			</div>
		</div>
	{/snippet}
</CrudTable>

<style>
	/* API Key banner — shown once after key creation */
	.key-banner { background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 1.25rem; }
	.key-banner-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
	.key-banner-title { font-weight: 600; font-size: 0.95rem; color: #15803d; }
	.key-banner-close { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #6b7280; padding: 0 0.25rem; }
	.key-banner-note { font-size: 0.82rem; color: #6b7280; margin: 0 0 0.75rem; }
	.key-value { display: flex; align-items: center; gap: 0.75rem; background: #fff; border: 1px solid #d1fae5; border-radius: 6px; padding: 0.5rem 0.75rem; }
	.key-value code { font-family: monospace; font-size: 0.85rem; word-break: break-all; flex: 1; color: #1f2937; }
	.copy-btn { background: #0ea5e9; color: #fff; border: none; border-radius: 4px; padding: 0.3rem 0.6rem; font-size: 0.8rem; cursor: pointer; white-space: nowrap; flex-shrink: 0; }
	.copy-btn:hover { background: #0284c7; }

	.action-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.78rem; font-weight: 600; }
	.action-active  { background: #dcfce7; color: #15803d; }
	.action-revoked { background: #fee2e2; color: #dc2626; }
</style>
