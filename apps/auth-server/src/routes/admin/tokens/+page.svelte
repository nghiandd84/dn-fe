<script lang="ts">
	import CrudTable from '$lib/components/CrudTable.svelte';
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
	actions={{ detail: true }}
/>
