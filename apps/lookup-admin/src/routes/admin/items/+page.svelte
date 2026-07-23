<script lang="ts">
	import { LL } from '$i18n/i18n-util';
	import { fingerprint } from '$lib/fingerprint';
	import { get } from 'svelte/store';
	import ConfirmModal from '@dn-fe/ui/ConfirmModal.svelte';

	let { data } = $props();
	const lookupTypes: { code: string; name: string }[] = data.lookupTypes || [];

	// ─── Table state ──────────────────────────────────────────────────────────
	let items: any[] = $state([]);
	let totalPage = $state(0);
	let page = $state(1);
	let loading = $state(false);

	let selectedTypeCode = $state('');
	let filterCode = $state({ op: 'li', value: '' });
	let filterName = $state({ op: 'li', value: '' });

	const OPERATORS = [
		{ value: 'li', label: 'Like' },
		{ value: 'eq', label: '=' },
		{ value: 'sw', label: 'Starts with' },
	];

	// ─── Modal state ──────────────────────────────────────────────────────────
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

	function getTypeCode(item: any): string {
		return item.lookup_type?.code ?? item.type_code ?? '';
	}

	function boolDisplay(v: any): string {
		if (v === true)  return '<span style="color:#15803d;font-weight:600">✓</span>';
		if (v === false) return '<span style="color:#b91c1c;font-weight:600">✗</span>';
		return '—';
	}

	async function fetchData() {
		loading = true;
		const params = new URLSearchParams();
		params.set('page', String(page));
		params.set('page_size', '20');
		params.set('includes', 'lookup_type');
		if (selectedTypeCode)        params.set('type_code', `eq|${selectedTypeCode}`);
		if (filterCode.value.trim()) params.set('code', `${filterCode.op}|${filterCode.value.trim()}`);
		if (filterName.value.trim()) params.set('name', `${filterName.op}|${filterName.value.trim()}`);
		const res = await fetch(`/api/lookup/items?${params}`, {
			headers: { 'X-Client-Fingerprint': get(fingerprint) }
		});
		const json = await res.json();
		items = json.data?.result || [];
		totalPage = json.data?.total_page || 0;
		loading = false;
	}

	async function handleSave() {
		const fp = get(fingerprint);
		const tc = editingItem ? getTypeCode(editingItem) : selectedTypeCode;
		const url = editingItem
			? `/api/lookup/lookup-types/${tc}/items/${editingItem.id}`
			: `/api/lookup/lookup-types/${tc}/items`;
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

	function requestDelete(item: any) {
		deletingId = item.id;
		confirmDeleteOpen = true;
	}

	async function confirmDelete() {
		confirmDeleteOpen = false;
		if (!deletingId) return;
		const item = items.find(i => i.id === deletingId);
		const tc = item ? getTypeCode(item) : selectedTypeCode;
		await fetch(`/api/lookup/lookup-types/${tc}/items/${deletingId}`, {
			method: 'DELETE',
			headers: { 'X-Client-Fingerprint': get(fingerprint) }
		});
		deletingId = null;
		await fetchData();
	}

	function openEdit(item: any) {
		editingItem = item;
		formData = { ...item };
		showModal = true;
	}

	async function openDetail(item: any) {
		detailItem = item;
		showDetail = true;
		translations = [];
		translationsLoading = true;
		const tc = getTypeCode(item);
		const allRows: any[] = [];
		let currentPage = 1;
		let totalPages = 1;
		do {
			const res = await fetch(
				`/api/lookup/lookup-types/${tc}/items/${item.id}/translations?page=${currentPage}&page_size=20`,
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

	function search() { page = 1; fetchData(); }
	function clear() {
		selectedTypeCode = '';
		filterCode = { op: 'li', value: '' };
		filterName = { op: 'li', value: '' };
		page = 1;
		fetchData();
	}

	$effect(() => { fetchData(); });
</script>



<div class="page-header">
	<h1>{$LL.lookup_items_page.title()}</h1>
</div>

<div class="search-bar">
	<div class="filter-field">
		<span class="filter-label">{$LL.lookup_items_page.type_label()}</span>
		<select class="type-select" bind:value={selectedTypeCode} onchange={() => { page = 1; fetchData(); }}>
			<option value="">— All —</option>
			{#each lookupTypes as t}
				<option value={t.code}>{t.code} — {t.name}</option>
			{/each}
		</select>
	</div>
	<div class="filter-field">
		<span class="filter-label">{$LL.lookup_items_page.col_code()}</span>
		<select class="filter-op" bind:value={filterCode.op}>
			{#each OPERATORS as op}<option value={op.value}>{op.label}</option>{/each}
		</select>
		<input class="filter-val" type="text" placeholder="value" bind:value={filterCode.value}
			onkeydown={(e) => { if (e.key === 'Enter') search(); }} />
	</div>
	<div class="filter-field">
		<span class="filter-label">{$LL.lookup_items_page.col_name()}</span>
		<select class="filter-op" bind:value={filterName.op}>
			{#each OPERATORS as op}<option value={op.value}>{op.label}</option>{/each}
		</select>
		<input class="filter-val" type="text" placeholder="value" bind:value={filterName.value}
			onkeydown={(e) => { if (e.key === 'Enter') search(); }} />
	</div>
	<button class="btn btn-primary" onclick={search}>{$LL.crud_table.filter()}</button>
	<button class="btn" onclick={clear}>{$LL.crud_table.clear()}</button>
</div>

<table>
	<thead>
		<tr>
			<th>{$LL.lookup_items_page.type_label()}</th>
			<th>{$LL.lookup_items_page.col_code()}</th>
			<th>{$LL.lookup_items_page.col_name()}</th>
			<th>{$LL.lookup_items_page.col_sort_order()}</th>
			<th>{$LL.lookup_items_page.col_active()}</th>
			<th>{$LL.lookup_items_page.col_is_default()}</th>
			<th>{$LL.crud_table.actions()}</th>
		</tr>
	</thead>
	<tbody>
		{#if loading}
			<tr><td colspan="7">{$LL.crud_table.loading()}</td></tr>
		{:else if items.length === 0}
			<tr><td colspan="7">{$LL.crud_table.no_data()}</td></tr>
		{:else}
			{#each items as item}
				<tr class:row-deleting={deletingId === item.id}>
					<td><span class="type-badge">{getTypeCode(item)}</span></td>
					<td><span class="code-badge">{item.code}</span></td>
					<td>{item.name}</td>
					<td>{item.sort_order ?? 0}</td>
					<td>{@html boolDisplay(item.is_active)}</td>
					<td>{@html boolDisplay(item.is_default)}</td>
					<td class="actions">
						<button class="btn btn-sm btn-info" onclick={() => openDetail(item)}>{$LL.crud_table.view()}</button>
						<button class="btn btn-sm" onclick={() => openEdit(item)}>{$LL.crud_table.edit()}</button>
						<a href="/admin/lookup-types/{getTypeCode(item)}/items/{item.id}/translations?from=items" class="btn btn-sm btn-secondary">{$LL.lookup_items_page.view_translations()}</a>
						<button class="btn btn-sm btn-danger" onclick={() => requestDelete(item)}>{$LL.crud_table.delete()}</button>
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


{#if showModal}
	<div class="modal-overlay" role="presentation">
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="modal form-modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" tabindex="-1">
			<div class="detail-header">
				<div class="detail-title-row">
					<h3 class="detail-name">{editingItem ? $LL.crud_table.edit_title({ resource: 'item' }) : $LL.crud_table.create_title({ resource: 'item' })}</h3>
				</div>
			</div>
			<form onsubmit={(e) => { e.preventDefault(); handleSave(); }}>
				<div class="detail-sections">
					<section class="detail-section">
						<h4 class="section-title">General</h4>
						<div class="form-grid">
							<div class="form-cell">
								<label class="cell-label" for="fc">{$LL.lookup_items_page.col_code()} <span class="required">*</span></label>
								<input id="fc" class="cell-input" type="text" required bind:value={formData.code} placeholder="e.g. USD" />
							</div>
							<div class="form-cell">
								<label class="cell-label" for="fso">{$LL.lookup_items_page.col_sort_order()}</label>
								<input id="fso" class="cell-input" type="number" bind:value={formData.sort_order} placeholder="0" />
							</div>
							<div class="form-cell full-width">
								<label class="cell-label" for="fn">{$LL.lookup_items_page.col_name()} <span class="required">*</span></label>
								<input id="fn" class="cell-input" type="text" required bind:value={formData.name} placeholder="Display name" />
							</div>
							<div class="form-cell full-width">
								<label class="cell-label" for="fu">URL</label>
								<input id="fu" class="cell-input" type="text" bind:value={formData.url} placeholder="https://..." />
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
							<button type="button" class="add-meta-btn" onclick={() => { if (!formData.meta) formData.meta = {}; formData.meta = { ...formData.meta, '': '' }; }}>+ Add field</button>
						</div>
						{#if formData.meta && Object.keys(formData.meta).length > 0}
							<div class="meta-editor">
								{#each Object.entries(formData.meta) as [key, value], i}
									<div class="meta-row-edit">
										<input class="meta-key-input" type="text" placeholder="key" value={key}
											oninput={(e) => { const nk = (e.target as HTMLInputElement).value; const en = Object.entries(formData.meta); en[i] = [nk, value]; formData.meta = Object.fromEntries(en); }} />
										<span class="meta-sep">:</span>
										<input class="meta-val-input" type="text" placeholder="value" value={String(value)}
											oninput={(e) => { const en = Object.entries(formData.meta); en[i] = [key, (e.target as HTMLInputElement).value]; formData.meta = Object.fromEntries(en); }} />
										<button type="button" class="meta-remove-btn" onclick={() => { const en = Object.entries(formData.meta).filter((_, idx) => idx !== i); formData.meta = Object.fromEntries(en); }}>✕</button>
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
					<a href="/admin/lookup-types/{getTypeCode(detailItem)}/items/{detailItem.id}/translations?from=items" class="translations-btn">
						🌐 {$LL.lookup_items_page.view_translations()}
					</a>
				</div>
				<div class="detail-badges">
					<span class="status-badge" class:active={detailItem.is_active} class:inactive={!detailItem.is_active}>
						{detailItem.is_active ? '✓ Active' : '✗ Inactive'}
					</span>
					{#if detailItem.is_default}<span class="default-badge">★ Default</span>{/if}
				</div>
			</div>
			<div class="detail-sections">
				<section class="detail-section">
					<h4 class="section-title">General</h4>
					<div class="detail-grid">
						<div class="detail-cell"><span class="cell-label">ID</span><span class="cell-value mono">{detailItem.id}</span></div>
						<div class="detail-cell"><span class="cell-label">{$LL.lookup_items_page.col_sort_order()}</span><span class="cell-value">{detailItem.sort_order ?? 0}</span></div>
						{#if detailItem.url}<div class="detail-cell full-width"><span class="cell-label">URL</span><span class="cell-value mono">{detailItem.url}</span></div>{/if}
					</div>
				</section>
				{#if detailItem.meta && Object.keys(detailItem.meta).length > 0}
					<section class="detail-section">
						<h4 class="section-title">Meta</h4>
						<div class="meta-grid">
							{#each Object.entries(detailItem.meta) as [key, value]}
								<div class="detail-cell"><span class="cell-label">{key}</span><span class="cell-value mono">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span></div>
							{/each}
						</div>
					</section>
				{/if}
				<section class="detail-section">
					<h4 class="section-title">Timestamps</h4>
					<div class="detail-grid">
						<div class="detail-cell"><span class="cell-label">Created</span><span class="cell-value mono">{detailItem.created_at ?? '—'}</span></div>
						<div class="detail-cell"><span class="cell-label">Updated</span><span class="cell-value mono">{detailItem.updated_at ?? '—'}</span></div>
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
	h1 { font-size: 1.4rem; font-weight: 700; margin-bottom: 1rem; }
	.search-bar { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; margin-bottom: 1.25rem; padding: 0.75rem 1rem; background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 8px; }
	.filter-field { display: flex; align-items: center; gap: 0.25rem; background: #fff; border: 1px solid #ddd; border-radius: 4px; padding: 0.2rem 0.4rem; }
	.filter-label { font-size: 0.78rem; color: #555; white-space: nowrap; font-weight: 600; }
	.filter-op { padding: 0.2rem 0.3rem; border: none; background: transparent; font-size: 0.82rem; cursor: pointer; }
	.filter-val { padding: 0.2rem 0.3rem; border: none; border-left: 1px solid #ddd; background: transparent; font-size: 0.82rem; width: 120px; outline: none; }
	.type-select { padding: 0.2rem 0.4rem; border: none; border-left: 1px solid #ddd; background: transparent; font-size: 0.82rem; cursor: pointer; max-width: 220px; }
	table { width: 100%; border-collapse: collapse; }
	th, td { padding: 0.6rem; text-align: left; border-bottom: 1px solid #eee; font-size: 0.9rem; }
	th { background: #f8f9fa; font-weight: 600; }
	tr:hover { background: #f5f5f5; }
	.actions { display: flex; gap: 0.3rem; flex-wrap: wrap; }
	.pagination { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 1rem; }
	.btn { padding: 0.4rem 0.8rem; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; background: #fff; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; }
	.btn-primary { background: #4f46e5; color: #fff; border-color: #4f46e5; }
	.btn-danger { background: #dc2626; color: #fff; border-color: #dc2626; }
	.btn-secondary { background: #f8f9fa; color: #374151; border-color: #d1d5db; }
	.btn-info { background: #0ea5e9; color: #fff; border-color: #0ea5e9; }
	.btn-sm { padding: 0.2rem 0.5rem; font-size: 0.78rem; }
	.type-badge { background: #ede9fe; color: #5b21b6; font-family: monospace; font-weight: 600; padding: 0.1rem 0.4rem; border-radius: 4px; border: 1px solid #ddd6fe; font-size: 0.82rem; }
	.code-badge { background: #f0f9ff; color: #0369a1; font-family: monospace; font-weight: 600; padding: 0.1rem 0.4rem; border-radius: 4px; border: 1px solid #bae6fd; font-size: 0.82rem; }
	.row-deleting { background: #fee2e2 !important; opacity: 0.6; }
	.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; }
	.modal { background: #fff; border-radius: 8px; max-width: 90vw; }
	.modal-actions { display: flex; justify-content: flex-end; gap: 0.5rem; padding: 0.75rem 1.5rem 1.25rem; border-top: 1px solid #e5e7eb; }
	/* Form modal */
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
	.meta-remove-btn { font-size: 0.75rem; color: #9ca3af; background: none; border: none; cursor: pointer; padding: 0 0.2rem; }
	.meta-remove-btn:hover { color: #ef4444; }
	.meta-empty { font-size: 0.82rem; color: #9ca3af; margin: 0; padding: 0.5rem 0; }
	/* Toggle */
	.toggle { display: inline-flex; align-items: center; gap: 0.6rem; cursor: pointer; user-select: none; }
	.toggle input { position: absolute; opacity: 0; width: 0; height: 0; }
	.toggle-options { display: inline-flex; border: 1px solid #d1d5db; border-radius: 6px; overflow: hidden; font-size: 0.82rem; font-weight: 600; }
	.toggle-opt { padding: 0.2rem 0.65rem; color: #9ca3af; background: #f9fafb; transition: background 0.15s, color 0.15s; }
	.toggle input:not(:checked) ~ .toggle-options .toggle-opt-no { background: #4f46e5; color: #fff; }
	.toggle input:checked ~ .toggle-options .toggle-opt-yes { background: #4f46e5; color: #fff; }
	/* Detail modal */
	.detail-modal { min-width: 480px; max-width: 680px; width: max-content; padding: 0; overflow: hidden; }
	.detail-header { padding: 1.25rem 1.5rem 1rem; background: #f8faff; border-bottom: 1px solid #e5e7eb; }
	.detail-title-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.6rem; flex-wrap: wrap; }
	.code-badge-lg { font-size: 0.9rem; padding: 0.2rem 0.6rem; }
	.detail-name { font-size: 1.1rem; font-weight: 700; color: #111827; margin: 0; flex: 1; }
	.translations-btn { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.3rem 0.75rem; background: #4f46e5; color: #fff; border-radius: 6px; font-size: 0.8rem; font-weight: 600; text-decoration: none; white-space: nowrap; margin-left: auto; }
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
	.mono { font-family: monospace; font-size: 0.8rem; }
	.translations-section { border-top: 1px solid #e5e7eb; padding-top: 0.75rem; }
	.trans-list { display: flex; flex-direction: column; gap: 0.3rem; }
	.trans-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.35rem 0.6rem; background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 6px; }
	.locale-badge { background: #f0fdf4; color: #15803d; font-family: monospace; font-weight: 600; padding: 0.1rem 0.5rem; border-radius: 4px; border: 1px solid #bbf7d0; font-size: 0.82rem; }
	.trans-name { font-size: 0.875rem; color: #111827; }
	.trans-loading, .trans-empty { font-size: 0.82rem; color: #9ca3af; margin: 0; }
</style>
