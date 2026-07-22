<script lang="ts">
	import { LL } from '$i18n/i18n-util';
	import { fingerprint } from '$lib/fingerprint';
	import { get } from 'svelte/store';
	import ConfirmModal from '@dn-fe/ui/ConfirmModal.svelte';

	let { data } = $props();
	const typeCode = data.typeCode;

	// ─── Table state ─────────────────────────────────────────────────────────
	let items: any[] = $state([]);
	let totalPage = $state(0);
	let page = $state(1);
	let pageSize = $state(10);
	let orderName = $state('');
	let orderDir = $state('asc');
	let loading = $state(false);
	let filters: Record<string, { op: string; value: string }> = $state({});
	let filterCondition = $state('and');

	// ─── Modal state ─────────────────────────────────────────────────────────
	let showModal = $state(false);
	let editingItem: any = $state(null);
	let formData: Record<string, any> = $state({});
	let confirmDeleteOpen = $state(false);
	let deletingId = $state<string | null>(null);
	let showDetail = $state(false);
	let detailItem: any = $state(null);

	function boolDisplay(v: any): string {
		return v === true ? '✓' : v === false ? '✗' : '—';
	}

	async function fetchData() {
		loading = true;
		const params = new URLSearchParams();
		params.set('page', String(page));
		params.set('page_size', String(pageSize));
		if (orderName) {
			params.set('order_name', orderName);
			params.set('order_direction', orderDir);
		}
		if (Object.keys(filters).length) {
			const active = Object.entries(filters).filter(([, f]) => f.value.trim());
			if (active.length) {
				params.set('_condition', filterCondition);
				for (const [k, f] of active) params.set(k, `${f.op}|${f.value.trim()}`);
			}
		}
		const res = await fetch(`/api/lookup/lookup-types/${typeCode}/items?${params}`, {
			headers: { 'X-Client-Fingerprint': get(fingerprint) }
		});
		const json = await res.json();
		items = json.data?.result || [];
		totalPage = json.data?.total_page || 0;
		loading = false;
	}

	async function handleSave() {
		const fp = get(fingerprint);
		const url = editingItem
			? `/api/lookup/lookup-types/${typeCode}/items/${editingItem.id}`
			: `/api/lookup/lookup-types/${typeCode}/items`;
		const method = editingItem ? 'PATCH' : 'POST';
		await fetch(url, {
			method,
			headers: { 'Content-Type': 'application/json', 'X-Client-Fingerprint': fp },
			body: JSON.stringify(formData)
		});
		showModal = false;
		editingItem = null;
		formData = {};
		await fetchData();
	}

	function requestDelete(id: string) {
		deletingId = id;
		confirmDeleteOpen = true;
	}

	async function confirmDelete() {
		confirmDeleteOpen = false;
		if (!deletingId) return;
		const id = deletingId;
		await fetch(`/api/lookup/lookup-types/${typeCode}/items/${id}`, {
			method: 'DELETE',
			headers: { 'X-Client-Fingerprint': get(fingerprint) }
		});
		deletingId = null;
		await fetchData();
	}

	function openCreate() {
		editingItem = null;
		formData = { is_active: true, is_default: false, sort_order: 0 };
		showModal = true;
	}

	function openEdit(item: any) {
		editingItem = item;
		formData = { ...item };
		showModal = true;
	}

	function sort(col: string) {
		if (orderName === col) orderDir = orderDir === 'asc' ? 'desc' : 'asc';
		else { orderName = col; orderDir = 'asc'; }
		fetchData();
	}

	$effect(() => {
		fetchData();
	});
</script>

<div class="page-header">
	<a href="/admin/lookup-types" class="back-link">{$LL.lookup_items_page.back()}</a>
	<h1>{$LL.lookup_items_page.title()} — <span class="type-code">{typeCode}</span></h1>
</div>

<div class="crud-table">
	<div class="toolbar">
		<button class="btn btn-primary" onclick={openCreate}>{$LL.crud_table.create()}</button>
		<div class="filter-bar">
			<div class="filter-field">
				<span class="filter-label">{$LL.lookup_items_page.col_code()}</span>
				<select class="filter-op" value={filters['code']?.op ?? 'li'}
					onchange={(e) => { filters['code'] = { op: (e.target as HTMLSelectElement).value, value: filters['code']?.value ?? '' }; }}>
					<option value="li">Like</option><option value="eq">=</option><option value="sw">Starts with</option>
				</select>
				<input class="filter-val" type="text" placeholder={$LL.crud_table.filter_value_placeholder()}
					value={filters['code']?.value ?? ''}
					oninput={(e) => { filters['code'] = { op: filters['code']?.op ?? 'li', value: (e.target as HTMLInputElement).value }; }} />
			</div>
			<div class="filter-field">
				<span class="filter-label">{$LL.lookup_items_page.col_name()}</span>
				<select class="filter-op" value={filters['name']?.op ?? 'li'}
					onchange={(e) => { filters['name'] = { op: (e.target as HTMLSelectElement).value, value: filters['name']?.value ?? '' }; }}>
					<option value="li">Like</option><option value="eq">=</option>
				</select>
				<input class="filter-val" type="text" placeholder={$LL.crud_table.filter_value_placeholder()}
					value={filters['name']?.value ?? ''}
					oninput={(e) => { filters['name'] = { op: filters['name']?.op ?? 'li', value: (e.target as HTMLInputElement).value }; }} />
			</div>
			<button class="btn" onclick={() => { page = 1; fetchData(); }}>{$LL.crud_table.filter()}</button>
			<button class="btn" onclick={() => { filters = {}; page = 1; fetchData(); }}>{$LL.crud_table.clear()}</button>
		</div>
	</div>

	<table>
		<thead>
			<tr>
				<th><button class="sort-btn" onclick={() => sort('code')}>{$LL.lookup_items_page.col_code()} {orderName === 'code' ? (orderDir === 'asc' ? '↑' : '↓') : ''}</button></th>
				<th><button class="sort-btn" onclick={() => sort('name')}>{$LL.lookup_items_page.col_name()} {orderName === 'name' ? (orderDir === 'asc' ? '↑' : '↓') : ''}</button></th>
				<th><button class="sort-btn" onclick={() => sort('sort_order')}>{$LL.lookup_items_page.col_sort_order()} {orderName === 'sort_order' ? (orderDir === 'asc' ? '↑' : '↓') : ''}</button></th>
				<th>{$LL.lookup_items_page.col_active()}</th>
				<th>{$LL.lookup_items_page.col_is_default()}</th>
				<th>{$LL.crud_table.actions()}</th>
			</tr>
		</thead>
		<tbody>
			{#if loading}
				<tr><td colspan="6">{$LL.crud_table.loading()}</td></tr>
			{:else if items.length === 0}
				<tr><td colspan="6">{$LL.crud_table.no_data()}</td></tr>
			{:else}
				{#each items as item}
					<tr class:row-deleting={deletingId === item.id}>
						<td><span class="code-badge">{item.code}</span></td>
						<td>{item.name}</td>
						<td>{item.sort_order ?? 0}</td>
						<td>{boolDisplay(item.is_active)}</td>
						<td>{boolDisplay(item.is_default)}</td>
						<td class="actions">
							<button class="btn btn-sm btn-info" onclick={() => { detailItem = item; showDetail = true; }}>{$LL.crud_table.view()}</button>
							<button class="btn btn-sm" onclick={() => openEdit(item)}>{$LL.crud_table.edit()}</button>
							<a href="/admin/lookup-types/{typeCode}/items/{item.id}/translations" class="btn btn-sm btn-secondary">{$LL.lookup_items_page.view_translations()}</a>
							<button class="btn btn-sm btn-danger" onclick={() => requestDelete(item.id)}>{$LL.crud_table.delete()}</button>
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>

	<div class="pagination">
		<button disabled={page <= 1} onclick={() => { page--; fetchData(); }}>{$LL.crud_table.prev()}</button>
		<span>{$LL.crud_table.page_of({ page, total: totalPage })}</span>
		<button disabled={page >= totalPage} onclick={() => { page++; fetchData(); }}>{$LL.crud_table.next()}</button>
	</div>
</div>

{#if showModal}
	<div class="modal-overlay" onclick={() => showModal = false} role="presentation">
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" tabindex="-1">
			<h3>{editingItem ? $LL.crud_table.edit_title({ resource: 'item' }) : $LL.crud_table.create_title({ resource: 'item' })}</h3>
			<form onsubmit={(e) => { e.preventDefault(); handleSave(); }}>
				<div class="form-group">
					<label for="code">{$LL.lookup_items_page.col_code()}</label>
					<input id="code" type="text" required bind:value={formData.code} />
				</div>
				<div class="form-group">
					<label for="name">{$LL.lookup_items_page.col_name()}</label>
					<input id="name" type="text" required bind:value={formData.name} />
				</div>
				<div class="form-group">
					<label for="sort_order">{$LL.lookup_items_page.col_sort_order()}</label>
					<input id="sort_order" type="number" bind:value={formData.sort_order} />
				</div>
				<div class="form-group form-group-checkbox">
					<label>{$LL.lookup_items_page.col_active()}</label>
					<label class="toggle">
						<input type="checkbox" bind:checked={formData.is_active} />
						<span class="toggle-options">
							<span class="toggle-opt toggle-opt-no">{$LL.crud_table.no()}</span>
							<span class="toggle-opt toggle-opt-yes">{$LL.crud_table.yes()}</span>
						</span>
					</label>
				</div>
				<div class="form-group form-group-checkbox">
					<label>{$LL.lookup_items_page.col_is_default()}</label>
					<label class="toggle">
						<input type="checkbox" bind:checked={formData.is_default} />
						<span class="toggle-options">
							<span class="toggle-opt toggle-opt-no">{$LL.crud_table.no()}</span>
							<span class="toggle-opt toggle-opt-yes">{$LL.crud_table.yes()}</span>
						</span>
					</label>
				</div>
				<div class="modal-actions">
					<button type="button" class="btn" onclick={() => showModal = false}>{$LL.crud_table.cancel()}</button>
					<button type="submit" class="btn btn-primary">{$LL.crud_table.save()}</button>
				</div>
			</form>
		</div>
	</div>
{/if}

{#if showDetail && detailItem}
	<div class="modal-overlay" onclick={() => showDetail = false} role="presentation">
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" tabindex="-1">
			<h3>{$LL.crud_table.detail_title()}</h3>
			<dl class="detail-list">
				<div class="detail-row"><dt>ID</dt><dd class="mono">{detailItem.id}</dd></div>
				<div class="detail-row"><dt>{$LL.lookup_items_page.col_code()}</dt><dd><span class="code-badge">{detailItem.code}</span></dd></div>
				<div class="detail-row"><dt>{$LL.lookup_items_page.col_name()}</dt><dd>{detailItem.name}</dd></div>
				<div class="detail-row"><dt>{$LL.lookup_items_page.col_sort_order()}</dt><dd>{detailItem.sort_order ?? 0}</dd></div>
				<div class="detail-row"><dt>{$LL.lookup_items_page.col_active()}</dt><dd>{boolDisplay(detailItem.is_active)}</dd></div>
				<div class="detail-row"><dt>{$LL.lookup_items_page.col_is_default()}</dt><dd>{boolDisplay(detailItem.is_default)}</dd></div>
				<div class="detail-row"><dt>URL</dt><dd class="mono">{detailItem.url || '—'}</dd></div>
				<div class="detail-row"><dt>Meta</dt><dd class="mono">{JSON.stringify(detailItem.meta) || '—'}</dd></div>
				<div class="detail-row"><dt>Tenants</dt><dd>{detailItem.tenants?.join(', ') || '—'}</dd></div>
				<div class="detail-row">
					<dt>{$LL.lookup_items_page.view_translations()}</dt>
					<dd><a href="/admin/lookup-types/{typeCode}/items/{detailItem.id}/translations" class="btn-link">{$LL.lookup_items_page.view_translations()} →</a></dd>
				</div>
			</dl>
			<div class="modal-actions">
				<button class="btn" onclick={() => showDetail = false}>{$LL.crud_table.close()}</button>
			</div>
		</div>
	</div>
{/if}

{#if confirmDeleteOpen}
	<ConfirmModal
		message={$LL.crud_table.delete_confirm()}
		onconfirm={confirmDelete}
		oncancel={() => { confirmDeleteOpen = false; deletingId = null; }}
	/>
{/if}

<style>
	.page-header { margin-bottom: 1.5rem; }
	.back-link { font-size: 0.85rem; color: #6b7280; display: inline-block; margin-bottom: 0.5rem; }
	h1 { font-size: 1.4rem; font-weight: 700; }
	.type-code { background: #f0f9ff; color: #0369a1; font-family: monospace; padding: 0.1rem 0.5rem; border-radius: 4px; border: 1px solid #bae6fd; font-size: 1rem; }
	.crud-table { width: 100%; }
	.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem; }
	.filter-bar { display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; }
	.filter-field { display: flex; align-items: center; gap: 0.25rem; background: #f8f9fa; border: 1px solid #ddd; border-radius: 4px; padding: 0.2rem 0.4rem; }
	.filter-label { font-size: 0.78rem; color: #555; white-space: nowrap; }
	.filter-op { padding: 0.2rem 0.3rem; border: none; background: transparent; font-size: 0.82rem; cursor: pointer; max-width: 90px; }
	.filter-val { padding: 0.2rem 0.3rem; border: none; border-left: 1px solid #ddd; background: transparent; font-size: 0.82rem; width: 100px; outline: none; }
	table { width: 100%; border-collapse: collapse; }
	th, td { padding: 0.6rem; text-align: left; border-bottom: 1px solid #eee; font-size: 0.9rem; }
	th { background: #f8f9fa; font-weight: 600; }
	tr:hover { background: #f5f5f5; }
	.sort-btn { background: none; border: none; cursor: pointer; font-weight: 600; font-size: 0.9rem; }
	.actions { display: flex; gap: 0.3rem; flex-wrap: wrap; }
	.pagination { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 1rem; }
	.btn { padding: 0.4rem 0.8rem; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; background: #fff; text-decoration: none; font-size: 0.85rem; display: inline-flex; align-items: center; }
	.btn-primary { background: #4f46e5; color: #fff; border-color: #4f46e5; }
	.btn-danger { background: #dc2626; color: #fff; border-color: #dc2626; }
	.btn-secondary { background: #f8f9fa; color: #374151; border-color: #d1d5db; }
	.btn-info { background: #0ea5e9; color: #fff; border-color: #0ea5e9; }
	.btn-sm { padding: 0.2rem 0.5rem; font-size: 0.78rem; }
	.code-badge { background: #f0f9ff; color: #0369a1; font-family: monospace; font-weight: 600; padding: 0.1rem 0.4rem; border-radius: 4px; border: 1px solid #bae6fd; font-size: 0.82rem; }
	.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; }
	.modal { background: #fff; padding: 1.5rem; border-radius: 8px; min-width: 420px; max-width: 90vw; }
	.form-group { margin-bottom: 0.8rem; }
	.form-group label { display: block; margin-bottom: 0.3rem; font-weight: 500; font-size: 0.85rem; }
	.form-group-checkbox { display: flex; align-items: center; gap: 0.75rem; }
	.form-group-checkbox label { margin-bottom: 0; }
	.form-group input { width: 100%; padding: 0.4rem; border: 1px solid #ddd; border-radius: 4px; }
	.modal-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }
	.toggle { display: inline-flex; align-items: center; gap: 0.6rem; cursor: pointer; user-select: none; }
	.toggle input { position: absolute; opacity: 0; width: 0; height: 0; }
	.toggle-options { display: inline-flex; border: 1px solid #d1d5db; border-radius: 6px; overflow: hidden; font-size: 0.82rem; font-weight: 600; }
	.toggle-opt { padding: 0.2rem 0.65rem; color: #9ca3af; background: #f9fafb; transition: background 0.15s, color 0.15s; }
	.toggle input:not(:checked) ~ .toggle-options .toggle-opt-no { background: #4f46e5; color: #fff; }
	.toggle input:checked ~ .toggle-options .toggle-opt-yes { background: #4f46e5; color: #fff; }
	.detail-list { display: grid; gap: 0; margin: 0; }
	.detail-row { display: grid; grid-template-columns: 120px 1fr; gap: 0.5rem; padding: 0.5rem 0; border-bottom: 1px solid #eee; }
	.detail-row:last-child { border-bottom: none; }
	dt { font-weight: 600; font-size: 0.85rem; color: #555; }
	dd { font-size: 0.9rem; color: #111; word-break: break-all; margin: 0; }
	.mono { font-family: monospace; font-size: 0.8rem; }
	.btn-link { color: #4f46e5; font-weight: 600; font-size: 0.85rem; }
	.row-deleting { background: #fee2e2 !important; opacity: 0.6; }
</style>
