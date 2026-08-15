<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { maskToCrudActions } from '$lib/components/types';

	let { data } = $props();

	const actions = $derived(maskToCrudActions((data as any).authMasks?.['tokens'] ?? 0));
</script>

<h1>Tokens</h1>
<CrudTable
	resource="tokens"
	columns={[
		{ key: 'user_id', label: 'User ID', filterable: true, operators: ['eq'] },
		{ key: 'client_id', label: 'Client ID', filterable: true, operators: ['eq'] },
		{ key: 'access_token_expires_at', label: 'Expires At', sortable: true },
		{ key: 'revoked_at', label: 'Revoked At' },
	]}
	{actions}
/>
