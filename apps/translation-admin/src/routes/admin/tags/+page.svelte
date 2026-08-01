<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { LL } from '$i18n/i18n-util';
</script>

<h1>{$LL.tags_page.title()}</h1>

<CrudTable
	resource="tags"
	apiPrefix="/api/translation"
	columns={[
		{ key: 'id', label: $LL.tags_page.col_id(), sortable: false, hideInTable: true },
		{
			key: 'name',
			label: $LL.tags_page.col_name(),
			sortable: true,
			filterable: true,
			operators: ['eq', 'li', 'sw']
		}
	]}
	formFields={[]}
	actions={{ create: true, edit: true, delete: true, detail: true }}
>
	{#snippet editSnippet(editingItem, formData)}
		<div class="form-group">
			<label class="field-label" for="field-name">
				{$LL.tags_page.col_name()} <span class="required">*</span>
			</label>
			<input id="field-name" type="text" required bind:value={formData.name} />
		</div>
	{/snippet}

	{#snippet detailSnippet(item)}
		<div class="meta-detail">
			<div class="meta-row">
				<span class="meta-label">{$LL.tags_page.col_id()}</span>
				<span class="mono">{item.id}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.tags_page.col_name()}</span>
				<span>{item.name}</span>
			</div>
		</div>
	{/snippet}
</CrudTable>

<style>
	h1 {
		margin-bottom: 1rem;
	}
	.form-group {
		margin-bottom: 0.8rem;
	}
	.field-label {
		display: block;
		margin-bottom: 0.3rem;
		font-weight: 500;
		font-size: 0.85rem;
	}
	.required {
		color: #dc2626;
	}
	.form-group input[type='text'] {
		width: 100%;
		padding: 0.4rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 0.9rem;
		box-sizing: border-box;
	}
	.mono {
		font-family: monospace;
		font-size: 0.85rem;
		word-break: break-all;
	}
</style>
