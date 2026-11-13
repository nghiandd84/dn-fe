<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { maskToCrudActions } from '$lib/components/types';

	let { data } = $props();

	const actions = $derived(maskToCrudActions((data as any).authMasks?.['scopes'] ?? 0));
</script>

<h1>Scopes</h1>
<CrudTable
	resource="scopes"
	columns={[
		{ key: 'name', label: 'Name', sortable: true, filterable: true, operators: ['li', 'eq', 'sw'] },
		{ key: 'description', label: 'Description' },
	]}
	formFields={[
		{ key: 'name', label: 'Name', type: 'text', required: true },
		{ key: 'description', label: 'Description', type: 'text' },
	]}
	{actions}
/>
