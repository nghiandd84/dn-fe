<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { LL } from '$i18n/i18n-util';
	import { maskToCrudActions } from '@dn-fe/ui/types';
	
	let { data } = $props();
	const actions = $derived(maskToCrudActions((data as any).authMasks?.['slots'] ?? 0));
</script>

<h1>{$LL.slots_page.title()}</h1>

<CrudTable
	resource="slots"
	apiPrefix="/api/booking"
	columns={[
		{ key: 'id', label: $LL.slots_page.col_id(), sortable: false }
	]}
	formFields={[]}
	{actions}
>
	{#snippet detailSnippet(item)}
		<div class="meta-detail">
			<div class="meta-row">
				<span class="meta-label">{$LL.slots_page.col_id()}</span>
				<span class="mono">{item.id}</span>
			</div>
		</div>
	{/snippet}
</CrudTable>



