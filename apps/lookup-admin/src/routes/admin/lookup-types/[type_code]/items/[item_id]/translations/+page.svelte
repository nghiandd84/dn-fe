<script lang="ts">
	import { LL } from '$i18n/i18n-util';
	import { fingerprint } from '$lib/fingerprint';
	import { get } from 'svelte/store';
	import ConfirmModal from '@dn-fe/ui/ConfirmModal.svelte';

	let { data } = $props();
	const typeCode = data.typeCode;
	const itemId = data.itemId;
	const itemCode = data.itemCode;
	const itemName = data.itemName;
	const backHref = data.from === 'items'
		? '/admin/items'
		: `/admin/lookup-types/${data.typeCode}/items`;

	const LOCALES = [
		{ value: 'en-US', label: 'en-US — English (US)' },
		{ value: 'en-GB', label: 'en-GB — English (UK)' },
		{ value: 'vi-VN', label: 'vi-VN — Vietnamese' },
		{ value: 'zh-CN', label: 'zh-CN — Chinese (Simplified)' },
		{ value: 'zh-TW', label: 'zh-TW — Chinese (Traditional)' },
		{ value: 'ja-JP', label: 'ja-JP — Japanese' },
		{ value: 'ko-KR', label: 'ko-KR — Korean' },
		{ value: 'fr-FR', label: 'fr-FR — French' },
		{ value: 'de-DE', label: 'de-DE — German' },
		{ value: 'es-ES', label: 'es-ES — Spanish (Spain)' },
		{ value: 'es-MX', label: 'es-MX — Spanish (Mexico)' },
		{ value: 'pt-BR', label: 'pt-BR — Portuguese (Brazil)' },
		{ value: 'pt-PT', label: 'pt-PT — Portuguese (Portugal)' },
		{ value: 'it-IT', label: 'it-IT — Italian' },
		{ value: 'nl-NL', label: 'nl-NL — Dutch' },
		{ value: 'pl-PL', label: 'pl-PL — Polish' },
		{ value: 'ru-RU', label: 'ru-RU — Russian' },
		{ value: 'ar-SA', label: 'ar-SA — Arabic (Saudi Arabia)' },
		{ value: 'th-TH', label: 'th-TH — Thai' },
		{ value: 'id-ID', label: 'id-ID — Indonesian' },
		{ value: 'ms-MY', label: 'ms-MY — Malay' },
		{ value: 'tr-TR', label: 'tr-TR — Turkish' },
		{ value: 'hi-IN', label: 'hi-IN — Hindi' },
	];

	// ─── Table state ─────────────────────────────────────────────────────────
	let items: any[] = $state([]);
	let totalPage = $state(0);
	let page = $state(1);
	let pageSize = $state(20);
	let loading = $state(false);

	// ─── Modal state ─────────────────────────────────────────────────────────
	let showModal = $state(false);
	let editingItem: any = $state(null);
	let formData: Record<string, any> = $state({});
	let confirmDeleteOpen = $state(false);
	let deletingId = $state<string | null>(null);

	async function fetchData() {
		loading = true;
		const params = new URLSearchParams();
		params.set('page', String(page));
		params.set('page_size', String(pageSize));
		const res = await fetch(
			`/api/lookup/lookup-types/${typeCode}/items/${itemId}/translations?${params}`,
			{ headers: { 'X-Client-Fingerprint': get(fingerprint) } }
		);
		const json = await res.json();
		items = json.data?.result || [];
		totalPage = json.data?.total_page || 0;
		loading = false;
	}

	async function handleSave() {
		const fp = get(fingerprint);
		const url = editingItem
			? `/api/lookup/lookup-types/${typeCode}/items/${itemId}/translations/${editingItem.id}`
			: `/api/lookup/lookup-types/${typeCode}/items/${itemId}/translations`;
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
		await fetch(`/api/lookup/lookup-types/${typeCode}/items/${itemId}/translations/${id}`, {
			method: 'DELETE',
			headers: { 'X-Client-Fingerprint': get(fingerprint) }
		});
		deletingId = null;
		await fetchData();
	}

	function openCreate() {
		editingItem = null;
		formData = {};
		showModal = true;
	}

	function openEdit(item: any) {
		editingItem = item;
		formData = { ...item };
		showModal = true;
	}

	$effect(() => {
		fetchData();
	});
</script>

<div class="page-header">
	<a href={backHref} class="back-link">{$LL.lookup_translations_page.back()}</a>
	<h1>{$LL.lookup_translations_page.title()}</h1>
	<div class="item-meta">
		<span class="meta-chip type-chip">{typeCode}</span>
		<span class="meta-sep">›</span>
		<span class="meta-chip code-chip">{itemCode || itemId}</span>
		{#if itemName}
			<span class="item-name">{itemName}</span>
		{/if}
	</div>
</div>

<div class="crud-table">
	<div class="toolbar">
		<button class="btn btn-primary" onclick={openCreate}>{$LL.crud_table.create()}</button>
	</div>

	<table>
		<thead>
			<tr>
				<th>{$LL.lookup_translations_page.col_locale()}</th>
				<th>{$LL.lookup_translations_page.col_name()}</th>
				<th>Created</th>
				<th>Updated</th>
				<th>{$LL.crud_table.actions()}</th>
			</tr>
		</thead>
		<tbody>
			{#if loading}
				<tr><td colspan="5">{$LL.crud_table.loading()}</td></tr>
			{:else if items.length === 0}
				<tr><td colspan="5">{$LL.crud_table.no_data()}</td></tr>
			{:else}
				{#each items as item}
					<tr class:row-deleting={deletingId === item.id}>
						<td><span class="locale-badge">{item.locale}</span></td>
						<td>{item.name}</td>
						<td class="mono">{item.created_at ?? '—'}</td>
						<td class="mono">{item.updated_at ?? '—'}</td>
						<td class="actions">
							<button class="btn btn-sm" onclick={() => openEdit(item)}>{$LL.crud_table.edit()}</button>
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
		<div class="modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" tabindex="-1">
			<h3>{editingItem ? $LL.crud_table.edit_title({ resource: 'translation' }) : $LL.crud_table.create_title({ resource: 'translation' })}</h3>
			<form onsubmit={(e) => { e.preventDefault(); handleSave(); }}>
				<div class="form-group">
					<label for="locale">{$LL.lookup_translations_page.col_locale()}</label>
					{#if editingItem}
						<div class="locale-readonly">
							<span class="locale-badge">{formData.locale}</span>
						</div>
					{:else}
						<select id="locale" required bind:value={formData.locale} class="locale-select">
							<option value="" disabled selected>{$LL.crud_table.select_placeholder()}</option>
							{#each LOCALES as loc}
								<option value={loc.value}>{loc.label}</option>
							{/each}
						</select>
					{/if}
				</div>
				<div class="form-group">
					<label for="tname">{$LL.lookup_translations_page.col_name()}</label>
					<input id="tname" type="text" required bind:value={formData.name} placeholder="Translated name" />
				</div>
				<div class="modal-actions">
					<button type="button" class="btn" onclick={() => showModal = false}>{$LL.crud_table.cancel()}</button>
					<button type="submit" class="btn btn-primary">{$LL.crud_table.save()}</button>
				</div>
			</form>
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
	.back-link { font-size: 0.85rem; color: #6b7280; display: inline-block; margin-bottom: 0.4rem; }
	h1 { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.4rem; }
	.item-meta { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
	.meta-chip { font-family: monospace; font-size: 0.82rem; font-weight: 600; padding: 0.15rem 0.5rem; border-radius: 4px; }
	.type-chip { background: #ede9fe; color: #5b21b6; border: 1px solid #ddd6fe; }
	.code-chip { background: #f0f9ff; color: #0369a1; border: 1px solid #bae6fd; }
	.meta-sep { color: #d1d5db; font-size: 0.9rem; }
	.item-name { font-size: 0.9rem; color: #374151; font-weight: 500; }
	.crud-table { width: 100%; }
	.toolbar { margin-bottom: 1rem; }
	table { width: 100%; border-collapse: collapse; }
	th, td { padding: 0.6rem; text-align: left; border-bottom: 1px solid #eee; font-size: 0.9rem; }
	th { background: #f8f9fa; font-weight: 600; }
	tr:hover { background: #f5f5f5; }
	.actions { display: flex; gap: 0.3rem; }
	.pagination { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 1rem; }
	.btn { padding: 0.4rem 0.8rem; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; background: #fff; font-size: 0.85rem; }
	.btn-primary { background: #4f46e5; color: #fff; border-color: #4f46e5; }
	.btn-danger { background: #dc2626; color: #fff; border-color: #dc2626; }
	.btn-sm { padding: 0.2rem 0.5rem; font-size: 0.78rem; }
	.locale-badge { background: #f0fdf4; color: #15803d; font-family: monospace; font-weight: 600; padding: 0.1rem 0.5rem; border-radius: 4px; border: 1px solid #bbf7d0; font-size: 0.82rem; }
	.mono { font-family: monospace; font-size: 0.8rem; color: #6b7280; }
	.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; }
	.modal { background: #fff; padding: 1.5rem; border-radius: 8px; min-width: 380px; max-width: 90vw; }
	.form-group { margin-bottom: 0.8rem; }
	.form-group label { display: block; margin-bottom: 0.3rem; font-weight: 500; font-size: 0.85rem; }
	.form-group input { width: 100%; padding: 0.4rem; border: 1px solid #ddd; border-radius: 4px; }
	.modal-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }
	.row-deleting { background: #fee2e2 !important; opacity: 0.6; }
	.locale-select { width: 100%; padding: 0.4rem; border: 1px solid #ddd; border-radius: 4px; font-size: 0.875rem; background: #fff; }
	.locale-readonly { padding: 0.3rem 0; }
</style>
