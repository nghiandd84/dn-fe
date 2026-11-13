<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { LL } from '$i18n/i18n-util';
	import { maskToCrudActions } from '@dn-fe/ui/types';
	import { fingerprint } from '$lib/fingerprint';
	import { get } from 'svelte/store';

	let { data } = $props();
	const actions = $derived(maskToCrudActions((data as any).authMasks?.['tag-groups'] ?? 0));

	function formatDate(v: string | null): string {
		if (!v) return '—';
		try { return new Date(v).toLocaleString(); } catch { return v; }
	}

	// ── Searchable parent selector state ──────────────────────────────────────
	let parentSearch = $state('');
	let parentResults = $state<{ id: string; name: string; code: string }[]>([]);
	let parentSearching = $state(false);
	let parentDropdownOpen = $state(false);
	let parentSearchTimer: ReturnType<typeof setTimeout> | null = null;
	let currentEditingId = $state<string | null>(null);

	async function searchParents(query: string) {
		parentSearching = true;
		try {
			const params = new URLSearchParams({ page: '1', page_size: '10' });
			if (query.trim()) params.set('name', `li|${query.trim()}`);
			const res = await fetch(`/api/tagging/tag-groups?${params}`, {
				headers: { 'X-Client-Fingerprint': get(fingerprint) }
			});
			const json = await res.json();
			const rows: any[] = json.data?.result ?? [];
			// Cannot select self as parent
			parentResults = rows
				.filter((r) => r.id !== currentEditingId)
				.map((r) => ({ id: r.id, name: r.name, code: r.code }));
		} catch {
			parentResults = [];
		} finally {
			parentSearching = false;
		}
	}

	function onParentInput(e: Event, formData: Record<string, any>) {
		const value = (e.target as HTMLInputElement).value;
		parentSearch = value;
		// Clear the bound id when user types manually
		formData.parent_id = null;
		parentDropdownOpen = true;
		if (parentSearchTimer) clearTimeout(parentSearchTimer);
		parentSearchTimer = setTimeout(() => searchParents(value), 250);
	}

	function selectParent(opt: { id: string; name: string; code: string }, formData: Record<string, any>) {
		formData.parent_id = opt.id;
		parentSearch = `${opt.name} (${opt.code})`;
		parentDropdownOpen = false;
	}

	function clearParent(formData: Record<string, any>) {
		formData.parent_id = null;
		parentSearch = '';
		parentDropdownOpen = false;
		parentResults = [];
	}

	function onEditOpen(item: any, formData: Record<string, any>) {
		currentEditingId = item?.id ?? null;
		if (item?.parent_id) {
			// Show a placeholder — will be resolved if user opens dropdown
			parentSearch = item.parent_id;
			loadParentLabel(item.parent_id).then((label) => {
				if (label) parentSearch = label;
			});
		} else {
			parentSearch = '';
		}
		parentDropdownOpen = false;
		parentResults = [];
		// Pre-load some results
		searchParents('');
	}

	async function loadParentLabel(id: string): Promise<string | null> {
		try {
			const res = await fetch(`/api/tagging/tag-groups/${id}`, {
				headers: { 'X-Client-Fingerprint': get(fingerprint) }
			});
			const json = await res.json();
			const g = json.data;
			if (g?.name) return `${g.name} (${g.code})`;
		} catch { /* ignore */ }
		return null;
	}

	function onCreateOpen(formData: Record<string, any>) {
		currentEditingId = null;
		parentSearch = '';
		parentDropdownOpen = false;
		parentResults = [];
		searchParents('');
	}
</script>

<h1>{$LL.tag_groups_page.title()}</h1>

<CrudTable
	resource="tag-groups"
	apiPrefix="/api/tagging"
	columns={[
		{ key: 'id', label: $LL.tag_groups_page.col_id(), sortable: false, hideInTable: true },
		{
			key: 'code',
			label: $LL.tag_groups_page.col_code(),
			sortable: true,
			filterable: true,
			operators: ['eq', 'li', 'sw']
		},
		{
			key: 'name',
			label: $LL.tag_groups_page.col_name(),
			sortable: true,
			filterable: true,
			operators: ['eq', 'li', 'sw']
		},
		{
			key: 'description',
			label: $LL.tag_groups_page.col_description(),
			sortable: false,
			format: (v) => v ?? '—'
		},
		{
			key: 'parent_id',
			label: $LL.tag_groups_page.col_parent_group(),
			sortable: false,
			format: (v) => v ?? '—'
		},
		{
			key: 'sort_order',
			label: $LL.tag_groups_page.col_sort_order(),
			sortable: true,
			format: (v) => v ?? '0'
		},
		{
			key: 'created_at',
			label: $LL.tag_groups_page.col_created_at(),
			sortable: true,
			hideInTable: true,
			format: formatDate
		}
	]}
	formFields={[
		{ key: 'code', label: $LL.tag_groups_page.col_code(), type: 'text', required: true },
		{ key: 'name', label: $LL.tag_groups_page.col_name(), type: 'text', required: true },
		{ key: 'description', label: $LL.tag_groups_page.col_description(), type: 'text' }
	]}
	{actions}
	onEdit={onEditOpen}
	onCreateOpen={onCreateOpen}
>
	{#snippet editSnippet(_editingItem, formData)}
		<!-- Searchable parent group selector -->
		<div class="form-group parent-selector">
			<label class="field-label" for="field-parent-id">
				{$LL.tag_groups_page.col_parent_group()}
			</label>
			<div class="combobox-wrapper">
				<div class="combobox-input-row">
					<input
						id="field-parent-id"
						type="text"
						class="combobox-input"
						placeholder="Search by name…"
						value={parentSearch}
						oninput={(e) => onParentInput(e, formData)}
						onfocus={() => { parentDropdownOpen = true; if (parentResults.length === 0) searchParents(parentSearch); }}
						onblur={() => setTimeout(() => { parentDropdownOpen = false; }, 150)}
						autocomplete="off"
					/>
					{#if formData.parent_id || parentSearch}
						<button
							type="button"
							class="combobox-clear"
							onclick={() => clearParent(formData)}
							title="Clear"
							aria-label="Clear parent selection"
						>✕</button>
					{/if}
				</div>

				{#if formData.parent_id}
					<div class="selected-badge">
						<span class="selected-id">{formData.parent_id}</span>
					</div>
				{/if}

				{#if parentDropdownOpen}
					<ul class="combobox-dropdown" role="listbox">
						{#if parentSearching}
							<li class="combobox-status">Searching…</li>
						{:else if parentResults.length === 0}
							<li class="combobox-status">No results</li>
						{:else}
							{#each parentResults as opt}
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<li
									class="combobox-option"
									class:combobox-option-selected={formData.parent_id === opt.id}
									role="option"
									aria-selected={formData.parent_id === opt.id}
									onmousedown={() => selectParent(opt, formData)}
								>
									<span class="opt-name">{opt.name}</span>
									<span class="opt-code">{opt.code}</span>
								</li>
							{/each}
						{/if}
					</ul>
				{/if}
			</div>
		</div>

		<!-- Sort order select -->
		<div class="form-group">
			<label class="field-label" for="field-sort-order">
				{$LL.tag_groups_page.col_sort_order()}
			</label>
			<select id="field-sort-order" bind:value={formData.sort_order}>
				<option value={1}>ASC</option>
				<option value={0}>DESC</option>
			</select>
		</div>
	{/snippet}

	{#snippet detailSnippet(item)}
		<div class="meta-detail">
			<div class="meta-row">
				<span class="meta-label">{$LL.tag_groups_page.col_id()}</span>
				<span class="mono">{item.id}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.tag_groups_page.col_code()}</span>
				<span class="mono">{item.code ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.tag_groups_page.col_name()}</span>
				<span>{item.name ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.tag_groups_page.col_description()}</span>
				<span>{item.description ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.tag_groups_page.col_parent_group()}</span>
				<span class="mono">{item.parent_id ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.tag_groups_page.col_sort_order()}</span>
				<span>{item.sort_order ?? 0}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.tag_groups_page.col_tenant_id()}</span>
				<span class="mono">{item.tenant_id ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.tag_groups_page.col_created_at()}</span>
				<span>{formatDate(item.created_at)}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.tag_groups_page.col_updated_at()}</span>
				<span>{formatDate(item.updated_at)}</span>
			</div>
		</div>
	{/snippet}
</CrudTable>

<style>
	/* ── Combobox / searchable select ───────────────────────────────── */
	.parent-selector {
		position: relative;
	}

	.field-label {
		display: block;
		margin-bottom: 0.3rem;
		font-weight: 500;
		font-size: 0.85rem;
	}

	.combobox-wrapper {
		position: relative;
	}

	.combobox-input-row {
		display: flex;
		align-items: center;
		border: 1px solid #ddd;
		border-radius: 4px;
		background: #fff;
		overflow: hidden;
	}

	.combobox-input {
		flex: 1;
		padding: 0.4rem 0.5rem;
		border: none;
		outline: none;
		font-size: 0.9rem;
		background: transparent;
	}

	.combobox-clear {
		padding: 0 0.5rem;
		border: none;
		background: transparent;
		color: #9ca3af;
		cursor: pointer;
		font-size: 0.85rem;
		line-height: 1;
	}

	.combobox-clear:hover {
		color: #dc2626;
	}

	.selected-badge {
		margin-top: 0.25rem;
		font-size: 0.75rem;
		color: #6b7280;
	}

	.selected-id {
		font-family: monospace;
		background: #f3f4f6;
		padding: 0.1rem 0.35rem;
		border-radius: 3px;
	}

	.combobox-dropdown {
		position: absolute;
		top: calc(100% + 2px);
		left: 0;
		right: 0;
		background: #fff;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
		list-style: none;
		margin: 0;
		padding: 0.25rem 0;
		z-index: 200;
		max-height: 220px;
		overflow-y: auto;
	}

	.combobox-status {
		padding: 0.5rem 0.75rem;
		font-size: 0.85rem;
		color: #9ca3af;
		font-style: italic;
	}

	.combobox-option {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.45rem 0.75rem;
		cursor: pointer;
		font-size: 0.88rem;
		transition: background 0.1s;
	}

	.combobox-option:hover,
	.combobox-option-selected {
		background: #eff6ff;
	}

	.opt-name {
		font-weight: 500;
		color: #111827;
	}

	.opt-code {
		font-size: 0.78rem;
		font-family: monospace;
		color: #6b7280;
		background: #f3f4f6;
		padding: 0.1rem 0.35rem;
		border-radius: 3px;
	}
</style>
