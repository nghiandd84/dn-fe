<script lang="ts">
	import { LL } from '$i18n/i18n-util';
	import { fingerprint } from '$lib/fingerprint';
	import { get } from 'svelte/store';
	import ConfirmModal from '@dn-fe/ui/ConfirmModal.svelte';

	let { data } = $props();
	const typeCode = $derived(data.typeCode);

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

	// ─── Inline translations ──────────────────────────────────────────────────
	let translations: any[] = $state([]);
	let translationsLoading = $state(false);

	async function loadTranslations(itemId: string) {
		translationsLoading = true;
		const allRows: any[] = [];
		let currentPage = 1;
		let totalPages = 1;
		do {
			const res = await fetch(
				`/api/lookup/lookup-types/${typeCode}/items/${itemId}/translations?page=${currentPage}&page_size=20`,
				{ headers: { 'X-Client-Fingerprint': get(fingerprint) } }
			);
			const json = await res.json();
			allRows.push(...(json.data?.result || []));
			totalPages = json.data?.total_page || 1;
			currentPage++;
		} while (currentPage <= totalPages);
		translations = allRows;
		translationsLoading = false;
	}

	function openDetail(item: any) {
		detailItem = item;
		showDetail = true;
		translations = [];
		loadTranslations(item.id);
	}

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
							<button class="btn btn-sm btn-info" onclick={() => openDetail(item)}>{$LL.crud_table.view()}</button>
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
	<div class="modal-overlay" role="presentation">
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="modal form-modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" tabindex="-1">

			<div class="detail-header">
				<div class="detail-title-row">
					<h3 class="detail-name">
						{editingItem ? $LL.crud_table.edit_title({ resource: 'item' }) : $LL.crud_table.create_title({ resource: 'item' })}
					</h3>
				</div>
			</div>

			<form onsubmit={(e) => { e.preventDefault(); handleSave(); }}>
				<div class="detail-sections">

					<section class="detail-section">
						<h4 class="section-title">General</h4>
						<div class="form-grid">
							<div class="form-cell">
								<label class="cell-label" for="code">{$LL.lookup_items_page.col_code()} <span class="required">*</span></label>
								<input id="code" class="cell-input" type="text" required bind:value={formData.code} placeholder="e.g. USD" />
							</div>
							<div class="form-cell">
								<label class="cell-label" for="sort_order">{$LL.lookup_items_page.col_sort_order()}</label>
								<input id="sort_order" class="cell-input" type="number" bind:value={formData.sort_order} placeholder="0" />
							</div>
							<div class="form-cell full-width">
								<label class="cell-label" for="name">{$LL.lookup_items_page.col_name()} <span class="required">*</span></label>
								<input id="name" class="cell-input" type="text" required bind:value={formData.name} placeholder="Display name" />
							</div>
							<div class="form-cell full-width">
								<label class="cell-label" for="url">URL</label>
								<input id="url" class="cell-input" type="text" bind:value={formData.url} placeholder="https://..." />
							</div>
						</div>
					</section>

					<section class="detail-section">
						<h4 class="section-title">Flags</h4>
						<div class="form-grid">
							<div class="form-cell toggle-cell">
								<span class="cell-label">{$LL.lookup_items_page.col_active()}</span>
								<label class="toggle">
									<input type="checkbox" bind:checked={formData.is_active} />
									<span class="toggle-options">
										<span class="toggle-opt toggle-opt-no">{$LL.crud_table.no()}</span>
										<span class="toggle-opt toggle-opt-yes">{$LL.crud_table.yes()}</span>
									</span>
								</label>
							</div>
							<div class="form-cell toggle-cell">
								<span class="cell-label">{$LL.lookup_items_page.col_is_default()}</span>
								<label class="toggle">
									<input type="checkbox" bind:checked={formData.is_default} />
									<span class="toggle-options">
										<span class="toggle-opt toggle-opt-no">{$LL.crud_table.no()}</span>
										<span class="toggle-opt toggle-opt-yes">{$LL.crud_table.yes()}</span>
									</span>
								</label>
							</div>
						</div>
					</section>

					<section class="detail-section">
						<div class="section-title-row">
							<h4 class="section-title">Meta</h4>
							<button type="button" class="add-meta-btn" onclick={() => {
								if (!formData.meta) formData.meta = {};
								formData.meta = { ...formData.meta, '': '' };
							}}>+ Add field</button>
						</div>
						{#if formData.meta && Object.keys(formData.meta).length > 0}
							<div class="meta-editor">
								{#each Object.entries(formData.meta) as [key, value], i}
									<div class="meta-row-edit">
										<input
											class="meta-key-input"
											type="text"
											placeholder="key"
											value={key}
											oninput={(e) => {
												const newKey = (e.target as HTMLInputElement).value;
												const entries = Object.entries(formData.meta);
												entries[i] = [newKey, value];
												formData.meta = Object.fromEntries(entries);
											}}
										/>
										<span class="meta-sep">:</span>
										<input
											class="meta-val-input"
											type="text"
											placeholder="value"
											value={String(value)}
											oninput={(e) => {
												const entries = Object.entries(formData.meta);
												entries[i] = [key, (e.target as HTMLInputElement).value];
												formData.meta = Object.fromEntries(entries);
											}}
										/>
										<button type="button" class="meta-remove-btn" onclick={() => {
											const entries = Object.entries(formData.meta).filter((_, idx) => idx !== i);
											formData.meta = Object.fromEntries(entries);
										}}>✕</button>
									</div>
								{/each}
							</div>
						{:else}
							<p class="meta-empty">No metadata. Click "+ Add field" to add.</p>
						{/if}
					</section>

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
	<div class="modal-overlay" role="presentation">
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="modal detail-modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" tabindex="-1">
			<div class="detail-header">
				<div class="detail-title-row">
					<span class="code-badge code-badge-lg">{detailItem.code}</span>
					<h3 class="detail-name">{detailItem.name}</h3>
					<a
						href="/admin/lookup-types/{typeCode}/items/{detailItem.id}/translations"
						class="translations-btn"
					>
						🌐 {$LL.lookup_items_page.view_translations()}
					</a>
				</div>
				<div class="detail-badges">
					<span class="status-badge" class:active={detailItem.is_active} class:inactive={!detailItem.is_active}>
						{detailItem.is_active ? '✓ Active' : '✗ Inactive'}
					</span>
					{#if detailItem.is_default}
						<span class="default-badge">★ Default</span>
					{/if}
				</div>
			</div>

			<div class="detail-sections">
				<section class="detail-section">
					<h4 class="section-title">General</h4>
					<div class="detail-grid">
						<div class="detail-cell">
							<span class="cell-label">ID</span>
							<span class="cell-value mono">{detailItem.id}</span>
						</div>
						<div class="detail-cell">
							<span class="cell-label">{$LL.lookup_items_page.col_sort_order()}</span>
							<span class="cell-value">{detailItem.sort_order ?? 0}</span>
						</div>
						{#if detailItem.url}
							<div class="detail-cell full-width">
								<span class="cell-label">URL</span>
								<span class="cell-value mono">{detailItem.url}</span>
							</div>
						{/if}
						{#if detailItem.tenants?.length}
							<div class="detail-cell full-width">
								<span class="cell-label">Tenants</span>
								<div class="tag-list">
									{#each detailItem.tenants as t}
										<span class="tag">{t}</span>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</section>

				{#if detailItem.meta && Object.keys(detailItem.meta).length > 0}
					<section class="detail-section">
						<h4 class="section-title">Meta</h4>
						<div class="meta-grid">
							{#each Object.entries(detailItem.meta) as [key, value]}
								<div class="detail-cell">
									<span class="cell-label">{key}</span>
									<span class="cell-value mono">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
								</div>
							{/each}
						</div>
					</section>
				{/if}

				<section class="detail-section">
					<h4 class="section-title">Timestamps</h4>
					<div class="detail-grid">
						<div class="detail-cell">
							<span class="cell-label">Created</span>
							<span class="cell-value mono">{detailItem.created_at ?? '—'}</span>
						</div>
						<div class="detail-cell">
							<span class="cell-label">Updated</span>
							<span class="cell-value mono">{detailItem.updated_at ?? '—'}</span>
						</div>
					</div>
				</section>

				<section class="detail-section translations-section">
						<h4 class="section-title">Translations</h4>
						{#if translationsLoading}
							<p class="trans-loading">Loading…</p>
						{:else if translations.length === 0}
							<p class="trans-empty">No translations found.</p>
						{:else}
							<div class="trans-list">
								{#each translations as t}
									<div class="trans-row">
										<span class="locale-badge">{t.locale}</span>
										<span class="trans-name">{t.name}</span>
									</div>
								{/each}
							</div>
						{/if}
					</section>
			</div>

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
	.modal-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; padding: 0.75rem 1.5rem 1.25rem; border-top: 1px solid #e5e7eb; }
	.toggle { display: inline-flex; align-items: center; gap: 0.6rem; cursor: pointer; user-select: none; }
	.toggle input { position: absolute; opacity: 0; width: 0; height: 0; }
	.toggle-options { display: inline-flex; border: 1px solid #d1d5db; border-radius: 6px; overflow: hidden; font-size: 0.82rem; font-weight: 600; }
	.toggle-opt { padding: 0.2rem 0.65rem; color: #9ca3af; background: #f9fafb; transition: background 0.15s, color 0.15s; }
	.toggle input:not(:checked) ~ .toggle-options .toggle-opt-no { background: #4f46e5; color: #fff; }
	.toggle input:checked ~ .toggle-options .toggle-opt-yes { background: #4f46e5; color: #fff; }
	.mono { font-family: monospace; font-size: 0.8rem; }
	.row-deleting { background: #fee2e2 !important; opacity: 0.6; }

	/* ── Form modal ── */
	.form-modal { min-width: 480px; max-width: 620px; width: max-content; padding: 0; overflow: hidden; }
	.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
	.form-cell { background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 6px; padding: 0.4rem 0.6rem; display: flex; flex-direction: column; gap: 0.25rem; }
	.form-cell.full-width { grid-column: 1 / -1; }
	.form-cell.toggle-cell { flex-direction: row; align-items: center; justify-content: space-between; }
	.cell-input { border: none; background: transparent; font-size: 0.875rem; color: #111827; outline: none; width: 100%; padding: 0.1rem 0; }
	.cell-input:focus { border-bottom: 1px solid #4f46e5; }
	.cell-input::placeholder { color: #d1d5db; }
	.required { color: #ef4444; }
	.section-title-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.25rem; }
	.add-meta-btn { font-size: 0.75rem; font-weight: 600; color: #4f46e5; background: #ede9fe; border: 1px solid #ddd6fe; border-radius: 4px; padding: 0.15rem 0.5rem; cursor: pointer; }
	.add-meta-btn:hover { background: #ddd6fe; }
	.meta-editor { display: flex; flex-direction: column; gap: 0.35rem; }
	.meta-row-edit { display: flex; align-items: center; gap: 0.4rem; background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 6px; padding: 0.3rem 0.6rem; }
	.meta-key-input { font-size: 0.82rem; font-family: monospace; color: #6d28d9; border: none; background: transparent; outline: none; width: 120px; font-weight: 600; }
	.meta-sep { color: #9ca3af; font-weight: 700; }
	.meta-val-input { font-size: 0.82rem; font-family: monospace; color: #111827; border: none; background: transparent; outline: none; flex: 1; }
	.meta-remove-btn { font-size: 0.75rem; color: #9ca3af; background: none; border: none; cursor: pointer; padding: 0 0.2rem; line-height: 1; }
	.meta-remove-btn:hover { color: #ef4444; }
	.meta-empty { font-size: 0.82rem; color: #9ca3af; margin: 0; padding: 0.5rem 0; }

	/* ── Detail modal ── */
	.detail-modal { min-width: 480px; max-width: 680px; width: max-content; padding: 0; overflow: hidden; }
	.detail-header { padding: 1.25rem 1.5rem 1rem; background: #f8faff; border-bottom: 1px solid #e5e7eb; }
	.detail-title-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.6rem; flex-wrap: wrap; }
	.code-badge-lg { font-size: 0.9rem; padding: 0.2rem 0.6rem; }
	.detail-name { font-size: 1.1rem; font-weight: 700; color: #111827; margin: 0; flex: 1; }
	.translations-btn { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.3rem 0.75rem; background: #4f46e5; color: #fff; border-radius: 6px; font-size: 0.8rem; font-weight: 600; text-decoration: none; white-space: nowrap; margin-left: auto; border: none; cursor: pointer; }
	.translations-btn:hover { background: #4338ca; }
	.translations-btn:hover { background: #4338ca; }
	.detail-badges { display: flex; gap: 0.5rem; flex-wrap: wrap; }
	.status-badge { display: inline-flex; align-items: center; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
	.status-badge.active { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
	.status-badge.inactive { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
	.default-badge { display: inline-flex; align-items: center; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; background: #fef9c3; color: #854d0e; border: 1px solid #fde68a; }
	.detail-sections { padding: 0.75rem 1.5rem 0.5rem; display: flex; flex-direction: column; gap: 1rem; }
	.detail-section { display: flex; flex-direction: column; gap: 0.5rem; }
	.section-title { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; margin: 0 0 0.25rem; }
	.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
	.meta-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.5rem; }
	.detail-cell { background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 6px; padding: 0.4rem 0.6rem; display: flex; flex-direction: column; gap: 0.15rem; }
	.full-width { grid-column: 1 / -1; }
	.cell-label { font-size: 0.7rem; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; }
	.cell-value { font-size: 0.85rem; color: #111827; word-break: break-all; }
	.tag-list { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.15rem; }
	.tag { background: #ede9fe; color: #5b21b6; border: 1px solid #ddd6fe; border-radius: 4px; padding: 0.1rem 0.4rem; font-size: 0.78rem; font-weight: 500; }

	/* ── Inline translations panel ── */
	.translations-section { border-top: 1px solid #e5e7eb; padding-top: 0.75rem; }
	.trans-list { display: flex; flex-direction: column; gap: 0.3rem; }
	.trans-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.35rem 0.6rem; background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 6px; }
	.trans-name { font-size: 0.875rem; color: #111827; }
	.trans-loading { font-size: 0.82rem; color: #9ca3af; margin: 0; }
	.trans-empty { font-size: 0.82rem; color: #9ca3af; margin: 0; }
</style>
