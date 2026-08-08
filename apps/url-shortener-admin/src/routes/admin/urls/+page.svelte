<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { LL } from '$i18n/i18n-util';

	function formatDate(v: string | null): string {
		if (!v) return '—';
		try { return new Date(v).toLocaleString(); } catch { return v; }
	}

	function formatBool(v: boolean | null): string {
		if (v === null || v === undefined) return '—';
		return v ? '✅' : '❌';
	}

	function truncate(v: string | null, max = 60): string {
		if (!v) return '—';
		return v.length > max ? v.slice(0, max) + '…' : v;
	}
</script>

<h1>{$LL.urls_page.title()}</h1>

<CrudTable
	resource="urls"
	apiPrefix="/api/url-shortener"
	columns={[
		{ key: 'id', label: $LL.urls_page.col_id(), sortable: false, hideInTable: true },
		{
			key: 'short_code',
			label: $LL.urls_page.col_short_code(),
			sortable: true,
			filterable: true,
			operators: ['eq', 'li', 'sw']
		},
		{
			key: 'original_url',
			label: $LL.urls_page.col_original_url(),
			sortable: false,
			filterable: true,
			operators: ['li'],
			format: (v) => truncate(v as string)
		},
		{
			key: 'title',
			label: $LL.urls_page.col_title(),
			sortable: true,
			filterable: true,
			operators: ['li'],
			format: (v) => (v as string) ?? '—'
		},
		{
			key: 'is_active',
			label: $LL.urls_page.col_is_active(),
			sortable: false,
			format: (v) => formatBool(v as boolean)
		},
		{
			key: 'click_count',
			label: $LL.urls_page.col_click_count(),
			sortable: true,
			format: (v) => String(v ?? 0)
		},
		{
			key: 'expires_at',
			label: $LL.urls_page.col_expires_at(),
			sortable: true,
			format: formatDate
		},
		{
			key: 'created_at',
			label: $LL.urls_page.col_created_at(),
			sortable: true,
			format: formatDate
		},
		{
			key: 'updated_at',
			label: $LL.urls_page.col_updated_at(),
			sortable: true,
			hideInTable: true,
			format: formatDate
		}
	]}
	formFields={[
		{ key: 'original_url', label: $LL.urls_page.col_original_url(), type: 'text', required: true },
		{ key: 'custom_code', label: $LL.urls_page.col_short_code(), type: 'text', required: false },
		{ key: 'title', label: $LL.urls_page.col_title(), type: 'text', required: false },
		{ key: 'expires_at', label: $LL.urls_page.col_expires_at(), type: 'datetime-local', required: false }
	]}
	actions={{ create: true, edit: true, delete: true, detail: true }}
>
	{#snippet editSnippet(editingItem, formData)}
		<div class="form-group">
			<label class="field-label" for="field-title">{$LL.urls_page.col_title()}</label>
			<input id="field-title" type="text" bind:value={formData.title} placeholder="Optional title" />
		</div>

		<div class="form-group">
			<label class="field-label" for="field-expires-at">{$LL.urls_page.col_expires_at()}</label>
			<input id="field-expires-at" type="datetime-local" bind:value={formData.expires_at} />
		</div>

		<div class="form-group">
			<label class="field-label" for="field-is-active">{$LL.urls_page.col_is_active()}</label>
			<select id="field-is-active" bind:value={formData.is_active}>
				<option value="">-- Select --</option>
				<option value={true}>Active</option>
				<option value={false}>Inactive</option>
			</select>
		</div>
	{/snippet}

	{#snippet detailSnippet(item)}
		<div class="meta-detail">
			<div class="meta-row">
				<span class="meta-label">{$LL.urls_page.col_id()}</span>
				<span class="mono">{item.id}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.urls_page.col_user_id()}</span>
				<span class="mono">{item.user_id ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.urls_page.col_short_code()}</span>
				<span class="mono">{item.short_code ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.urls_page.col_original_url()}</span>
				<a href={item.original_url} target="_blank" rel="noopener noreferrer" class="mono">{item.original_url ?? '—'}</a>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.urls_page.col_title()}</span>
				<span>{item.title ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.urls_page.col_is_active()}</span>
				<span class="action-badge action-{item.is_active ? 'active' : 'inactive'}">{item.is_active ? 'Active' : 'Inactive'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.urls_page.col_click_count()}</span>
				<span>{item.click_count ?? 0}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.urls_page.col_expires_at()}</span>
				<span>{formatDate(item.expires_at)}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.urls_page.col_created_at()}</span>
				<span>{formatDate(item.created_at)}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.urls_page.col_updated_at()}</span>
				<span>{formatDate(item.updated_at)}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">Clicks</span>
				<a href="/admin/url-clicks?url_id={item.id}" class="view-clicks-link">View click analytics →</a>
			</div>
		</div>
	{/snippet}
</CrudTable>

<style>
	h1 { margin-bottom: 1rem; }
	.form-group { margin-bottom: 0.8rem; }
	.field-label { display: block; margin-bottom: 0.3rem; font-weight: 500; font-size: 0.85rem; }
	.form-group input,
	.form-group select {
		width: 100%;
		padding: 0.4rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 0.9rem;
		box-sizing: border-box;
	}
	.action-badge {
		display: inline-block;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		font-size: 0.78rem;
		font-weight: 600;
	}
	.action-active  { background: #dcfce7; color: #15803d; }
	.action-inactive { background: #fee2e2; color: #dc2626; }
	.view-clicks-link { color: #0ea5e9; text-decoration: none; font-size: 0.85rem; }
	.view-clicks-link:hover { text-decoration: underline; }
</style>
