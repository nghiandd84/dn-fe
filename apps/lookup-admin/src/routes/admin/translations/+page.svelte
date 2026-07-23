<script lang="ts">
	import { LL } from '$i18n/i18n-util';
	import { fingerprint } from '$lib/fingerprint';
	import { get } from 'svelte/store';

	// ─── Table state ─────────────────────────────────────────────────────────
	let items: any[] = $state([]);
	let totalPage = $state(0);
	let page = $state(1);
	let loading = $state(false);

	let filters = $state({
		locale:    { op: 'eq', value: '' },
		name:      { op: 'li', value: '' },
		item_code: { op: 'li', value: '' },
		type_code: { op: 'li', value: '' },
	});

	const OPERATORS = [
		{ value: 'li', label: 'Like' },
		{ value: 'eq', label: '=' },
		{ value: 'sw', label: 'Starts with' },
	];

	const LOCALES = [
		'', 'en-US', 'en-GB', 'vi-VN', 'zh-CN', 'zh-TW', 'ja-JP', 'ko-KR',
		'fr-FR', 'de-DE', 'es-ES', 'pt-BR', 'it-IT', 'ru-RU', 'ar-SA', 'th-TH', 'id-ID'
	];

	async function fetchData() {
		loading = true;
		const params = new URLSearchParams();
		params.set('page', String(page));
		params.set('page_size', '20');

		for (const [key, f] of Object.entries(filters)) {
			if (f.value.trim()) params.set(key, `${f.op}|${f.value.trim()}`);
		}

		const res = await fetch(`/api/lookup/translations?${params}`, {
			headers: { 'X-Client-Fingerprint': get(fingerprint) }
		});
		const json = await res.json();
		items = json.data?.result || [];
		totalPage = json.data?.total_page || 0;
		loading = false;
	}

	function search() { page = 1; fetchData(); }
	function clear() {
		filters = { locale: { op: 'eq', value: '' }, name: { op: 'li', value: '' }, item_code: { op: 'li', value: '' }, type_code: { op: 'li', value: '' } };
		page = 1;
		fetchData();
	}

	$effect(() => { fetchData(); });
</script>

<div class="page-header">
	<h1>{$LL.lookup_translations_page.title()}</h1>
</div>

<div class="search-bar">
	<div class="filter-field">
		<span class="filter-label">{$LL.lookup_translations_page.col_locale()}</span>
		<select
			class="filter-locale"
			bind:value={filters.locale.value}
			onchange={() => { page = 1; fetchData(); }}
		>
			{#each LOCALES as loc}
				<option value={loc}>{loc || '— All —'}</option>
			{/each}
		</select>
	</div>

	{#each [
		{ key: 'name',      label: $LL.lookup_translations_page.col_name() },
		{ key: 'item_code', label: $LL.lookup_items_page.col_code() },
		{ key: 'type_code', label: $LL.lookup_items_page.type_label() },
	] as field}
		<div class="filter-field">
			<span class="filter-label">{field.label}</span>
			<select
				class="filter-op"
				value={filters[field.key].op}
				onchange={(e) => { filters[field.key] = { ...filters[field.key], op: (e.target as HTMLSelectElement).value }; }}
			>
				{#each OPERATORS as op}
					<option value={op.value}>{op.label}</option>
				{/each}
			</select>
			<input
				class="filter-val"
				type="text"
				placeholder="value"
				value={filters[field.key].value}
				oninput={(e) => { filters[field.key] = { ...filters[field.key], value: (e.target as HTMLInputElement).value }; }}
				onkeydown={(e) => { if (e.key === 'Enter') search(); }}
			/>
		</div>
	{/each}

	<button class="btn btn-primary" onclick={search}>{$LL.crud_table.filter()}</button>
	<button class="btn" onclick={clear}>{$LL.crud_table.clear()}</button>
</div>

<table>
	<thead>
		<tr>
			<th>{$LL.lookup_translations_page.col_locale()}</th>
			<th>{$LL.lookup_items_page.type_label()}</th>
			<th>{$LL.lookup_items_page.col_code()}</th>
			<th>{$LL.lookup_items_page.col_name()}</th>
			<th>{$LL.lookup_translations_page.col_name()}</th>
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
				<tr>
					<td><span class="locale-badge">{item.locale}</span></td>
					<td><span class="type-badge">{item.type_code}</span></td>
					<td><span class="code-badge">{item.item_code}</span></td>
					<td>{item.item_name ?? '—'}</td>
					<td>{item.name}</td>
					<td class="actions">
						<a
							href="/admin/lookup-types/{item.type_code}/items/{item.item_id}/translations"
							class="btn btn-sm btn-secondary"
						>
							{$LL.lookup_items_page.view_translations()}
						</a>
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

<style>
	.page-header { margin-bottom: 1rem; }
	h1 { font-size: 1.4rem; font-weight: 700; }
	.search-bar { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; margin-bottom: 1.25rem; padding: 0.75rem 1rem; background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 8px; }
	.filter-field { display: flex; align-items: center; gap: 0.25rem; background: #fff; border: 1px solid #ddd; border-radius: 4px; padding: 0.2rem 0.4rem; }
	.filter-label { font-size: 0.78rem; color: #555; white-space: nowrap; font-weight: 600; }
	.filter-op { padding: 0.2rem 0.3rem; border: none; background: transparent; font-size: 0.82rem; cursor: pointer; }
	.filter-val { padding: 0.2rem 0.3rem; border: none; border-left: 1px solid #ddd; background: transparent; font-size: 0.82rem; width: 120px; outline: none; }
	.filter-locale { padding: 0.2rem 0.4rem; border: none; background: transparent; font-size: 0.82rem; cursor: pointer; border-left: 1px solid #ddd; }
	table { width: 100%; border-collapse: collapse; }
	th, td { padding: 0.6rem; text-align: left; border-bottom: 1px solid #eee; font-size: 0.9rem; }
	th { background: #f8f9fa; font-weight: 600; }
	tr:hover { background: #f5f5f5; }
	.actions { display: flex; gap: 0.3rem; }
	.pagination { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 1rem; }
	.btn { padding: 0.4rem 0.8rem; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; background: #fff; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; }
	.btn-primary { background: #4f46e5; color: #fff; border-color: #4f46e5; }
	.btn-secondary { background: #f8f9fa; color: #374151; border-color: #d1d5db; }
	.btn-sm { padding: 0.2rem 0.5rem; font-size: 0.78rem; }
	.locale-badge { background: #f0fdf4; color: #15803d; font-family: monospace; font-weight: 600; padding: 0.1rem 0.5rem; border-radius: 4px; border: 1px solid #bbf7d0; font-size: 0.82rem; }
	.type-badge { background: #ede9fe; color: #5b21b6; font-family: monospace; font-weight: 600; padding: 0.1rem 0.4rem; border-radius: 4px; border: 1px solid #ddd6fe; font-size: 0.82rem; }
	.code-badge { background: #f0f9ff; color: #0369a1; font-family: monospace; font-weight: 600; padding: 0.1rem 0.4rem; border-radius: 4px; border: 1px solid #bae6fd; font-size: 0.82rem; }
</style>
