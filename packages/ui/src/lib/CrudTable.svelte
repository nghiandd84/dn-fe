<script lang="ts">
	import type { Column, FormField, CrudActions } from './types.js';
	import { fingerprint } from './fingerprint.js';
	import { get } from 'svelte/store';
	import { LL } from '$i18n/i18n-util';
	import ConfirmModal from './ConfirmModal.svelte';

	let {
		resource,
		apiPrefix = '/api/admin',
		columns,
		formFields = [],
		actions = { create: false, edit: false, delete: false },
		extraParams = {},
		detailSnippet,
		onDetail,
		editSnippet,
		onEdit,
		onCreateOpen
	}: {
		resource: string;
		/** API route prefix, e.g. '/api/admin' or '/api/lookup'. Default: '/api/admin' */
		apiPrefix?: string;
		columns: Column[];
		formFields?: FormField[];
		actions?: CrudActions;
		extraParams?: Record<string, string>;
		detailSnippet?: import('svelte').Snippet<[any]>;
		onDetail?: (item: any) => void;
		editSnippet?: import('svelte').Snippet<[any, Record<string, any>]>;
		onEdit?: (item: any, formData: Record<string, any>) => void;
		onCreateOpen?: (formData: Record<string, any>) => void;
	} = $props();

	let items: any[] = $state([]);
	let totalPage = $state(0);
	let page = $state(1);
	let pageSize = $state(10);
	let orderName = $state('');
	let orderDir = $state('asc');
	let filters: Record<string, { op: string; value: string }> = $state({});
	let filterCondition = $state('and');

	const OPERATORS = [
		{ value: 'li', label: 'Like' },
		{ value: 'eq', label: '=' },
		{ value: 'neq', label: '≠' },
		{ value: 'sw', label: 'Starts with' },
		{ value: 'in', label: 'In' },
		{ value: 'nin', label: 'Not in' },
		{ value: 'lt', label: '<' },
		{ value: 'lte', label: '≤' },
		{ value: 'gt', label: '>' },
		{ value: 'gte', label: '≥' },
	];
	let showModal = $state(false);
	let editingItem: any = $state(null);
	let formData: Record<string, any> = $state({});
	let loading = $state(false);
	let remoteOptionsCache: Record<string, { value: string; label: string }[]> = $state({});
	let showDetail = $state(false);
	let detailItem: any = $state(null);

	function getNestedValue(obj: any, path: string): any {
		return path.split('.').reduce((cur, key) => cur?.[key], obj);
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
			const activeFilters = Object.entries(filters).filter(([, f]) => f.value.trim());
			if (activeFilters.length) {
				params.set('_condition', filterCondition);
				for (const [k, f] of activeFilters) {
					params.set(k, `${f.op}|${f.value.trim()}`);
				}
			}
		}
		for (const [k, v] of Object.entries(extraParams)) {
			params.set(k, v);
		}
		const res = await fetch(`${apiPrefix}/${resource}?${params}`, {
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
			? `${apiPrefix}/${resource}/${editingItem.id}`
			: `${apiPrefix}/${resource}`;
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

	// ── Delete confirm modal ─────────────────────────────────────────────────
	let confirmDeleteOpen = $state(false);
	let deletingId = $state<string | null>(null);

	function requestDelete(id: string) {
		deletingId = id;
		confirmDeleteOpen = true;
	}

	async function confirmDelete() {
		confirmDeleteOpen = false;
		if (!deletingId) return;
		const id = deletingId;
		// keep deletingId set so the row stays highlighted during the request
		await fetch(`${apiPrefix}/${resource}/${id}`, {
			method: 'DELETE',
			headers: { 'X-Client-Fingerprint': get(fingerprint) }
		});
		deletingId = null;
		await fetchData();
	}

	function cancelDelete() {
		confirmDeleteOpen = false;
		deletingId = null;
	}

	function openCreate() {
		editingItem = null;
		formData = {};
		loadRemoteOptions();
		onCreateOpen?.(formData);
		showModal = true;
	}

	function openEdit(item: any) {
		editingItem = item;
		formData = { ...item };
		loadRemoteOptions();
		onEdit?.(item, formData);
		showModal = true;
	}

	function openDetail(item: any) {
		detailItem = item;
		showDetail = true;
		onDetail?.(item);
	}

	async function loadRemoteOptions() {
		const remoteFields = formFields.filter(f => f.type === 'select-remote' && f.remoteOptions);
		for (const field of remoteFields) {
			const { url, valueKey, labelKey } = field.remoteOptions!;
			if (remoteOptionsCache[field.key]) continue; // already loaded
			try {
				const allRows: any[] = [];
				let currentPage = 1;
				let totalPages = 1;
				do {
					const res = await fetch(`${url}?page_size=20&page=${currentPage}`, {
						headers: { 'X-Client-Fingerprint': get(fingerprint) }
					});
					const json = await res.json();
					const rows = json.data?.result || [];
					allRows.push(...rows);
					totalPages = json.data?.total_page || 1;
					currentPage++;
				} while (currentPage <= totalPages);
				remoteOptionsCache[field.key] = allRows.map((r: any) => ({ value: r[valueKey], label: r[labelKey] }));
			} catch {
				remoteOptionsCache[field.key] = [];
			}
		}
	}

	function sort(col: string) {
		if (orderName === col) {
			orderDir = orderDir === 'asc' ? 'desc' : 'asc';
		} else {
			orderName = col;
			orderDir = 'asc';
		}
		fetchData();
	}

	$effect(() => {
		fetchData();
	});

	const tableColumns = $derived(columns.filter(c => !c.hideInTable));
</script>

<div class="crud-table">
	<div class="toolbar">
		{#if actions.create}
			<button class="btn btn-primary" onclick={openCreate}>{$LL.crud_table.create()}</button>
		{/if}
		<div class="filter-bar">
			{#each tableColumns.filter(c => c.filterable) as col}
				<div class="filter-field">
					<span class="filter-label">{col.label}</span>
					<select
						class="filter-op"
						value={filters[col.key]?.op ?? 'li'}
						onchange={(e) => {
							filters[col.key] = { op: (e.target as HTMLSelectElement).value, value: filters[col.key]?.value ?? '' };
						}}
					>
						{#each (col.operators ? OPERATORS.filter(o => col.operators!.includes(o.value as any)) : OPERATORS) as op}
							<option value={op.value}>{op.label}</option>
						{/each}
					</select>
					<input
						class="filter-val"
						type="text"
						placeholder={$LL.crud_table.filter_value_placeholder()}
						value={filters[col.key]?.value ?? ''}
						oninput={(e) => {
							filters[col.key] = { op: filters[col.key]?.op ?? 'li', value: (e.target as HTMLInputElement).value };
						}}
					/>
				</div>
			{/each}
			{#if tableColumns.some(c => c.filterable)}
				<select class="filter-condition" bind:value={filterCondition}>
					<option value="and">{$LL.crud_table.and()}</option>
					<option value="or">{$LL.crud_table.or()}</option>
				</select>
				<button class="btn" onclick={() => { page = 1; fetchData(); }}>{$LL.crud_table.filter()}</button>
				<button class="btn" onclick={() => { filters = {}; page = 1; fetchData(); }}>{$LL.crud_table.clear()}</button>
			{/if}
		</div>
	</div>

	<table>
		<thead>
			<tr>
				{#each tableColumns as col}
					<th>
						{#if col.sortable}
							<button class="sort-btn" onclick={() => sort(col.key)}>
								{col.label} {orderName === col.key ? (orderDir === 'asc' ? '↑' : '↓') : ''}
							</button>
						{:else}
							{col.label}
						{/if}
					</th>
				{/each}
				{#if actions.edit || actions.delete || actions.detail}
					<th>{$LL.crud_table.actions()}</th>
				{/if}
			</tr>
		</thead>
		<tbody>
			{#if loading}
				<tr><td colspan={tableColumns.length + 1}>{$LL.crud_table.loading()}</td></tr>
			{:else if items.length === 0}
				<tr><td colspan={tableColumns.length + 1}>{$LL.crud_table.no_data()}</td></tr>
			{:else}
				{#each items as item}
					<tr class:row-deleting={deletingId === item.id}>
						{#each tableColumns as col}
							<td>{#if col.format}<span class="cell-formatted">{@html col.format(item[col.key], item)}</span>{:else}{col.displayKey ? (getNestedValue(item, col.displayKey) ?? item[col.key] ?? '') : (item[col.key] ?? '')}{/if}</td>
						{/each}
						{#if actions.edit || actions.delete || actions.detail}
							<td class="actions">
								{#if actions.detail}
									<button class="btn btn-sm btn-info" onclick={() => openDetail(item)}>{$LL.crud_table.view()}</button>
								{/if}
								{#if actions.edit}
									<button class="btn btn-sm" onclick={() => openEdit(item)}>{$LL.crud_table.edit()}</button>
								{/if}
								{#if actions.delete}
									<button class="btn btn-sm btn-danger" onclick={() => requestDelete(item.id)}>{$LL.crud_table.delete()}</button>
								{/if}
							</td>
						{/if}
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
		<div class="modal" class:modal-wide={!!editSnippet} onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" tabindex="-1">
			<h3>{editingItem ? $LL.crud_table.edit_title({ resource }) : $LL.crud_table.create_title({ resource })}</h3>
			<form onsubmit={(e) => { e.preventDefault(); handleSave(); }}>
				{#each formFields as field}
					<div class="form-group" class:form-group-checkbox={field.type === 'checkbox'}>
						<label for={field.key}>{field.label}</label>
						{#if field.type === 'select'}
							<select id={field.key} bind:value={formData[field.key]}>
								{#each field.options || [] as opt}
									<option value={opt.value}>{opt.label}</option>
								{/each}
							</select>
						{:else if field.type === 'select-remote'}
							<select id={field.key} bind:value={formData[field.key]}>
								<option value="">{$LL.crud_table.select_placeholder()}</option>
								{#each remoteOptionsCache[field.key] || [] as opt}
									<option value={opt.value}>{opt.label}</option>
								{/each}
							</select>
						{:else if field.type === 'checkbox'}
							<label class="toggle">
								<input type="checkbox" bind:checked={formData[field.key]} />
								<span class="toggle-options">
									<span class="toggle-opt toggle-opt-no">{$LL.crud_table.no()}</span>
									<span class="toggle-opt toggle-opt-yes">{$LL.crud_table.yes()}</span>
								</span>
							</label>
						{:else if field.type === 'tags'}
							<input
								id={field.key}
								type="text"
								placeholder={$LL.crud_table.tags_placeholder()}
								value={Array.isArray(formData[field.key]) ? formData[field.key].join(', ') : formData[field.key] || ''}
								oninput={(e) => { formData[field.key] = (e.target as HTMLInputElement).value.split(',').map(s => s.trim()).filter(Boolean); }}
							/>
						{:else}
							<input
								id={field.key}
								type={field.type}
								required={field.required}
								bind:value={formData[field.key]}
							/>
						{/if}
					</div>
				{/each}
				{#if editSnippet}
					<div class="edit-snippet">
						{@render editSnippet(editingItem, formData)}
					</div>
				{/if}
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
		<div class="modal detail-modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" tabindex="-1">
			<h3>{$LL.crud_table.detail_title()}</h3>
			{#if detailSnippet}
				{@render detailSnippet(detailItem)}
			{:else}
				<dl class="detail-list">
					{#each columns as col}
						<div class="detail-row">
							<dt>{col.label}</dt>
							<dd>{#if col.format}{@html col.format(detailItem[col.key], detailItem)}{:else}{col.displayKey ? (getNestedValue(detailItem, col.displayKey) ?? detailItem[col.key] ?? '—') : (detailItem[col.key] ?? '—')}{/if}</dd>
						</div>
					{/each}
				</dl>
			{/if}
			<div class="modal-actions">
				<button class="btn" onclick={() => showDetail = false}>{$LL.crud_table.close()}</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.crud-table { width: 100%; }
	.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem; }
	.filter-bar { display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; }
	.filter-field { display: flex; align-items: center; gap: 0.25rem; background: #f8f9fa; border: 1px solid #ddd; border-radius: 4px; padding: 0.2rem 0.4rem; }
	.filter-label { font-size: 0.78rem; color: #555; white-space: nowrap; }
	.filter-op { padding: 0.2rem 0.3rem; border: none; background: transparent; font-size: 0.82rem; cursor: pointer; max-width: 90px; }
	.filter-val { padding: 0.2rem 0.3rem; border: none; border-left: 1px solid #ddd; background: transparent; font-size: 0.82rem; width: 100px; outline: none; }
	.filter-condition { padding: 0.4rem; border: 1px solid #ddd; border-radius: 4px; font-size: 0.85rem; }
	table { width: 100%; border-collapse: collapse; }
	th, td { padding: 0.6rem; text-align: left; border-bottom: 1px solid #eee; font-size: 0.9rem; }
	.cell-formatted { display: flex; }
	th { background: #f8f9fa; font-weight: 600; }
	tr:hover { background: #f5f5f5; }
	.sort-btn { background: none; border: none; cursor: pointer; font-weight: 600; font-size: 0.9rem; }
	.actions { display: flex; gap: 0.3rem; }
	.pagination { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 1rem; }
	.btn { padding: 0.4rem 0.8rem; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; background: #fff; }
	.btn-primary { background: #4f46e5; color: #fff; border-color: #4f46e5; }
	.btn-danger { background: #dc2626; color: #fff; border-color: #dc2626; }
	.btn-sm { padding: 0.2rem 0.5rem; font-size: 0.8rem; }
	.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; }
	.modal { background: #fff; padding: 1.5rem; border-radius: 8px; min-width: 400px; max-width: 90vw; }
	.modal-wide { min-width: 700px; }
	.edit-snippet { margin-top: 1rem; border-top: 1px solid #e5e7eb; padding-top: 1rem; }
	.form-group { margin-bottom: 0.8rem; }
	.form-group label { display: block; margin-bottom: 0.3rem; font-weight: 500; font-size: 0.85rem; }
	.form-group-checkbox { display: flex; align-items: center; gap: 0.75rem; }
	.form-group-checkbox label { margin-bottom: 0; }
	.form-group input, .form-group select { width: 100%; padding: 0.4rem; border: 1px solid #ddd; border-radius: 4px; }
	.modal-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }
	/* Toggle switch */
	.toggle { display: inline-flex; align-items: center; gap: 0.6rem; cursor: pointer; user-select: none; }
	.toggle input { position: absolute; opacity: 0; width: 0; height: 0; }
	.toggle-options { display: inline-flex; border: 1px solid #d1d5db; border-radius: 6px; overflow: hidden; font-size: 0.82rem; font-weight: 600; }
	.toggle-opt { padding: 0.2rem 0.65rem; color: #9ca3af; background: #f9fafb; transition: background 0.15s, color 0.15s; }
	.toggle input:not(:checked) ~ .toggle-options .toggle-opt-no  { background: #4f46e5; color: #fff; }
	.toggle input:checked       ~ .toggle-options .toggle-opt-yes { background: #4f46e5; color: #fff; }
	.detail-modal { min-width: 420px; }
	.detail-list { display: grid; gap: 0; margin: 0; }
	.detail-row { display: grid; grid-template-columns: 160px 1fr; gap: 0.5rem; padding: 0.5rem 0; border-bottom: 1px solid #eee; }
	.detail-row:last-child { border-bottom: none; }
	dt { font-weight: 600; font-size: 0.85rem; color: #555; }
	dd { font-size: 0.9rem; color: #111; word-break: break-all; margin: 0; }
	.btn-info { background: #0ea5e9; color: #fff; border-color: #0ea5e9; }
	.row-deleting { background: #fee2e2 !important; opacity: 0.6; transition: background 0.2s, opacity 0.2s; }
	.row-deleting td { color: #b91c1c; }
</style>

{#if confirmDeleteOpen}
	<ConfirmModal
		message={$LL.crud_table.delete_confirm()}
		onconfirm={confirmDelete}
		oncancel={cancelDelete}
	/>
{/if}
