<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { LL } from '$i18n/i18n-util';

	function boolFormat(v: any): string {
		if (v === true || v === 'true') return '<span style="color:#15803d;font-weight:600">✓</span>';
		if (v === false || v === 'false') return '<span style="color:#b91c1c;font-weight:600">✗</span>';
		return '—';
	}
</script>

<h1>{$LL.lookup_types_page.title()}</h1>

<CrudTable
	resource="lookup-types"
	apiPrefix="/api/lookup"
	columns={[
		{ key: 'code', label: $LL.lookup_types_page.col_code(), sortable: true, filterable: true, operators: ['eq', 'li', 'sw'] },
		{ key: 'name', label: $LL.lookup_types_page.col_name(), sortable: true, filterable: true, operators: ['eq', 'li'] },
		{ key: 'description', label: $LL.lookup_types_page.col_description() },
		{ key: 'is_active', label: $LL.lookup_types_page.col_active(), sortable: true, format: boolFormat },
		{ key: 'tenant_id', label: $LL.lookup_types_page.col_tenant(), sortable: true, filterable: true, operators: ['eq', 'li'] },
	]}
	formFields={[
		{ key: 'code', label: $LL.lookup_types_page.col_code(), type: 'text', required: true },
		{ key: 'name', label: $LL.lookup_types_page.col_name(), type: 'text', required: true },
		{ key: 'description', label: $LL.lookup_types_page.col_description(), type: 'text' },
		{ key: 'is_active', label: $LL.lookup_types_page.col_active(), type: 'checkbox' },
	]}
	actions={{ create: true, edit: true, delete: true, detail: true }}
>
	{#snippet detailSnippet(item)}
		<div class="type-detail">
			<div class="meta-row"><span class="meta-label">ID</span><span class="mono">{item.id}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.lookup_types_page.col_code()}</span><span class="code-badge">{item.code}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.lookup_types_page.col_name()}</span><span>{item.name}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.lookup_types_page.col_tenant()}</span><span>{item.tenant_id || '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.lookup_types_page.col_description()}</span><span>{item.description || '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.lookup_types_page.col_active()}</span><span>{item.is_active ? '✓ Active' : '✗ Inactive'}</span></div>
			<div class="meta-row"><span class="meta-label">Created</span><span class="mono">{item.created_at ?? '—'}</span></div>
			<div class="meta-row"><span class="meta-label">Updated</span><span class="mono">{item.updated_at ?? '—'}</span></div>
			<div class="meta-row">
				<span class="meta-label">{$LL.lookup_types_page.view_items()}</span>
				<a href="/admin/lookup-types/{item.code}/items" class="btn-link">{$LL.lookup_types_page.view_items()} →</a>
			</div>
		</div>
	{/snippet}
</CrudTable>

<style>
	/* Page-specific layout */
	.type-detail { display: flex; flex-direction: column; gap: 0.5rem; min-width: 340px; }
</style>
