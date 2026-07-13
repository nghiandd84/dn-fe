<script lang="ts">
	import CrudTable from '$lib/components/CrudTable.svelte';
</script>

<h1>Auth Codes</h1>
<CrudTable
	resource="auth-codes"
	columns={[
		{ key: 'code', label: 'Code' },
		{ key: 'client_id', label: 'Client ID', filterable: true, operators: ['eq'] },
		{ key: 'user_id', label: 'User ID', filterable: true, operators: ['eq'] },
		{ key: 'expires_at', label: 'Expires At', sortable: true },
	]}
	formFields={[
		{ key: 'client_id', label: 'Client ID', type: 'text' },
		{ key: 'user_id', label: 'User ID', type: 'text' },
		{ key: 'redirect_uri', label: 'Redirect URI', type: 'text' },
		{ key: 'scopes', label: 'Scopes', type: 'tags' },
	]}
	actions={{ create: true, delete: true, detail: true }}
/>
