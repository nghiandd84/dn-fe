<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
</script>

<h1>Users</h1>
<CrudTable
	resource="users"
	columns={[
		{ key: 'email', label: 'Email', sortable: true, filterable: true, operators: ['eq', 'li'] },
		{ key: 'language', label: 'Language', filterable: true, operators: ['eq', 'neq'] },
		{ key: 'age', label: 'Age', sortable: true },
	]}
	actions={{ delete: true, detail: true }}
/>
