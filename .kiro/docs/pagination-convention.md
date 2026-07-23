# Pagination Convention

## Rule: Maximum `page_size` is 20

All paginated API calls must use a `page_size` of **20 or less**.  
Never set `page_size` higher than 20 — the backend will reject or ignore it.

---

## Standard pagination params

| Param            | Type     | Default | Max |
|------------------|----------|---------|-----|
| `page`           | `number` | `1`     | —   |
| `page_size`      | `number` | `10`    | `20` |
| `order_name`     | `string` | —       | —   |
| `order_direction`| `'asc'` \| `'desc'` | `'asc'` | — |

---

## Examples

```ts
// ✅ Correct
params.set('page', String(page));
params.set('page_size', '20');

// ❌ Wrong — exceeds maximum
params.set('page_size', '100');
params.set('page_size', '50');
```

---

## Fetching all records (e.g. for dropdowns or inline panels)

When you need all records (e.g. loading all translations for display), paginate through pages instead of requesting a large `page_size`:

```ts
const allRows: any[] = [];
let currentPage = 1;
let totalPages = 1;

do {
    const res = await fetch(`/api/.../resource?page=${currentPage}&page_size=20`, ...);
    const json = await res.json();
    allRows.push(...(json.data?.result || []));
    totalPages = json.data?.total_page || 1;
    currentPage++;
} while (currentPage <= totalPages);
```
