# CrudTable Component

Reusable CRUD table component for all admin resource pages.

**Location:** `src/lib/components/CrudTable.svelte`

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `resource` | `string` | Yes | API resource name (e.g. `"clients"`, `"roles"`) |
| `columns` | `Column[]` | Yes | Table column definitions |
| `formFields` | `FormField[]` | No | Form fields for create/edit modal |
| `actions` | `CrudActions` | No | Which actions to enable |

## Column Definition

```ts
interface Column {
  key: string;        // Field key in data object
  label: string;      // Display header
  sortable?: boolean; // Enable sort on this column
  filterable?: boolean; // Show filter input for this column
}
```

## FormField Definition

```ts
interface FormField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'email' | 'number' | 'select' | 'tags' | 'checkbox';
  required?: boolean;
  options?: { value: string; label: string }[];  // for select type
}
```

## CrudActions

```ts
interface CrudActions {
  create?: boolean;
  edit?: boolean;
  delete?: boolean;
}
```

## Features

- **Pagination:** page/page_size controls
- **Sorting:** Click column headers (sortable columns)
- **Filtering:** Input fields with `operator|value` format (e.g. `eq|admin`, `li|test`)
- **Filter condition:** AND/OR toggle for combining filters
- **Create/Edit modal:** Dynamic form generated from `formFields`
- **Delete confirmation:** Browser confirm dialog
- **Fingerprint:** Automatically attaches `X-Client-Fingerprint` header

## Example Usage

```svelte
<script lang="ts">
  import CrudTable from '$lib/components/CrudTable.svelte';
</script>

<CrudTable
  resource="clients"
  columns={[
    { key: 'name', label: 'Name', sortable: true, filterable: true },
    { key: 'email', label: 'Email', sortable: true, filterable: true },
  ]}
  formFields={[
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'redirect_uris', label: 'Redirect URIs', type: 'tags' },
  ]}
  actions={{ create: true, edit: true, delete: true }}
/>
```

## API Calls

The component calls:
- `GET /api/admin/{resource}?page=X&page_size=Y&order_name=Z&...` for listing
- `POST /api/admin/{resource}` for create
- `PATCH /api/admin/{resource}/{id}` for edit
- `DELETE /api/admin/{resource}/{id}` for delete
