<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { maskToCrudActions } from '@dn-fe/ui/types';
	import { LL } from '$i18n/i18n-util';

	let { data } = $props();
	const actions = $derived(maskToCrudActions((data as any).authMasks?.['translation-keys'] ?? 0));
</script>

<h1>{$LL.translation_keys_page.title()}</h1>

<CrudTable
	resource="translation-keys"
	apiPrefix="/api/translation"
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
	{actions}
>
	{#snippet editSnippet(editingItem, formData)}
		<div class="form-group">
			<label class="field-label" for="field-key-name">
				{$LL.translation_keys_page.col_key_name()} <span class="required">*</span>
			</label>
			<input id="field-key-name" type="text" required bind:value={formData.key_name} />
		</div>

		<div class="form-group">
			<label class="field-label" for="field-project-id">
				{$LL.translation_keys_page.col_project_id()} <span class="required">*</span>
			</label>
			<input id="field-project-id" type="text" required bind:value={formData.project_id} />
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



