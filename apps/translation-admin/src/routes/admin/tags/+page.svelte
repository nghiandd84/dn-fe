<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { maskToCrudActions } from '@dn-fe/ui/types';
	import { LL } from '$i18n/i18n-util';

	let { data } = $props();
	const actions = $derived(maskToCrudActions((data as any).authMasks?.['tags'] ?? 0));
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
	{actions}
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



