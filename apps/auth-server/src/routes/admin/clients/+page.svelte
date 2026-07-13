<script lang="ts">
	import CrudTable from '$lib/components/CrudTable.svelte';
</script>

<h1>Clients</h1>
<CrudTable
	resource="clients"
	columns={[
		{ key: 'name', label: 'Name', sortable: true, filterable: true, operators: ['li', 'eq', 'sw'] },
		{ key: 'email', label: 'Email', sortable: true, filterable: true, operators: ['eq', 'li'] },
		{ key: 'client_key', label: 'Client Key' },
	]}
	formFields={[
		{ key: 'name', label: 'Name', type: 'text', required: true },
		{ key: 'client_secret', label: 'Secret', type: 'password', required: true },
		{ key: 'email', label: 'Email', type: 'email' },
		{ key: 'description', label: 'Description', type: 'text' },
		{ key: 'redirect_uris', label: 'Redirect URIs', type: 'tags' },
		{ key: 'allowed_grants', label: 'Allowed Grants', type: 'tags' },
	]}
	actions={{ create: true, edit: true, delete: true, detail: true }}
/>
