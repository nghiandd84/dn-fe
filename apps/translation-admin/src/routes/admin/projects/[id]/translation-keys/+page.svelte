<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { LL } from '$i18n/i18n-util';
	import { page } from '$app/stores';

	const projectId = $derived($page.params.id);
	const apiPrefix = $derived(`/api/translation/projects/${projectId}`);
</script>

<CrudTable
	resource="translation-keys"
	{apiPrefix}
	columns={[
		{ key: 'id', label: $LL.translation_keys_page.col_id(), sortable: false, hideInTable: true },
		{
			key: 'key_name',
			label: $LL.translation_keys_page.col_key_name(),
			sortable: true,
			filterable: true,
			operators: ['eq', 'li', 'sw']
		},
		{
			key: 'description',
			label: $LL.translation_keys_page.col_description(),
			sortable: false,
			format: (v) => v ?? '—'
		},
		{
			key: 'project_id',
			label: $LL.translation_keys_page.col_project_id(),
			sortable: false,
			hideInTable: true
		}
	]}
	formFields={[]}
	actions={{ create: true, edit: true, delete: true, detail: true }}
	onCreateOpen={(fd) => { fd.project_id = projectId; }}
>
	{#snippet editSnippet(editingItem, formData)}
		<div class="form-group">
			<label class="field-label" for="field-key-name">
				{$LL.translation_keys_page.col_key_name()} <span class="required">*</span>
			</label>
			<input id="field-key-name" type="text" required bind:value={formData.key_name} />
		</div>

		<div class="form-group">
			<label class="field-label" for="field-description">
				{$LL.translation_keys_page.col_description()}
			</label>
			<textarea id="field-description" rows="3" bind:value={formData.description}></textarea>
		</div>
	{/snippet}

	{#snippet detailSnippet(item)}
		<div class="meta-detail">
			<div class="meta-row">
				<span class="meta-label">{$LL.translation_keys_page.col_id()}</span>
				<span class="mono">{item.id}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.translation_keys_page.col_key_name()}</span>
				<span>{item.key_name}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.translation_keys_page.col_project_id()}</span>
				<span class="mono">{item.project_id ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.translation_keys_page.col_description()}</span>
				<span>{item.description ?? '—'}</span>
			</div>
		</div>
	{/snippet}
</CrudTable>

<style>
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
	.form-group input[type='text'],
	.form-group textarea {
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
