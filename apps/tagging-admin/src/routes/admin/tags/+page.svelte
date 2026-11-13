<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { LL } from '$i18n/i18n-util';
	import { maskToCrudActions } from '@dn-fe/ui/types';
	import { fingerprint } from '$lib/fingerprint';
	import { get } from 'svelte/store';

	let { data } = $props();
	const actions = $derived(maskToCrudActions((data as any).authMasks?.['tags'] ?? 0));

	function formatDate(v: string | null): string {
		if (!v) return '—';
		try { return new Date(v).toLocaleString(); } catch { return v; }
	}

	function formatBool(v: boolean | null): string {
		if (v == null) return '—';
		return v ? '✓' : '✗';
	}

	// ── Shared group search (used by both filter bar and create/edit form) ─────
	async function fetchGroups(query: string): Promise<{ id: string; name: string; code: string }[]> {
		try {
			const params = new URLSearchParams({ page: '1', page_size: '10' });
			if (query.trim()) params.set('name', `li|${query.trim()}`);
			const res = await fetch(`/api/tagging/tag-groups?${params}`, {
				headers: { 'X-Client-Fingerprint': get(fingerprint) }
			});
			const json = await res.json();
			return (json.data?.result ?? []).map((r: any) => ({ id: r.id, name: r.name, code: r.code }));
		} catch {
			return [];
		}
	}

	async function loadGroupLabel(id: string): Promise<string | null> {
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

	// ── Standalone group-name filter (above the table) ────────────────────────
	let filterSearch = $state('');
	let filterResults = $state<{ id: string; name: string; code: string }[]>([]);
	let filterSearching = $state(false);
	let filterDropdownOpen = $state(false);
	let filterSearchTimer: ReturnType<typeof setTimeout> | null = null;
	let filterGroupId = $state<string | null>(null);
	let filterGroupName = $state<string | null>(null);

	function onFilterInput(e: Event) {
		filterSearch = (e.target as HTMLInputElement).value;
		filterGroupId = null;
		filterGroupName = null;
		filterDropdownOpen = true;
		if (filterSearchTimer) clearTimeout(filterSearchTimer);
		filterSearchTimer = setTimeout(async () => {
			filterSearching = true;
			filterResults = await fetchGroups(filterSearch);
			filterSearching = false;
		}, 250);
	}

	function selectFilterGroup(opt: { id: string; name: string; code: string }) {
		filterGroupId = opt.id;
		filterGroupName = opt.name;
		filterSearch = opt.name;
		filterDropdownOpen = false;
	}

	function clearFilterGroup() {
		filterGroupId = null;
		filterGroupName = null;
		filterSearch = '';
		filterDropdownOpen = false;
		filterResults = [];
	}

	const tableExtraParams = $derived(
		filterGroupId
			? { includes: 'tag_group', tag_group_id: `eq|${filterGroupId}` }
			: { includes: 'tag_group' }
	);

	// ── Edit/create form group selector ───────────────────────────────────────
	let groupSearch = $state('');
	let groupResults = $state<{ id: string; name: string; code: string }[]>([]);
	let groupSearching = $state(false);
	let groupDropdownOpen = $state(false);
	let groupSearchTimer: ReturnType<typeof setTimeout> | null = null;

	function onGroupInput(e: Event, formData: Record<string, any>) {
		groupSearch = (e.target as HTMLInputElement).value;
		formData.tag_group_id = null;
		groupDropdownOpen = true;
		if (groupSearchTimer) clearTimeout(groupSearchTimer);
		groupSearchTimer = setTimeout(async () => {
			groupSearching = true;
			groupResults = await fetchGroups(groupSearch);
			groupSearching = false;
		}, 250);
	}

	function selectGroup(opt: { id: string; name: string; code: string }, formData: Record<string, any>) {
		formData.tag_group_id = opt.id;
		groupSearch = `${opt.name} (${opt.code})`;
		groupDropdownOpen = false;
	}

	function clearGroup(formData: Record<string, any>) {
		formData.tag_group_id = null;
		groupSearch = '';
		groupDropdownOpen = false;
		groupResults = [];
	}

	function onEditOpen(item: any, _formData: Record<string, any>) {
		if (item?.tag_group_id) {
			groupSearch = item.tag_group_id;
			loadGroupLabel(item.tag_group_id).then((label) => { if (label) groupSearch = label; });
		} else {
			groupSearch = '';
		}
		groupDropdownOpen = false;
		groupResults = [];
		fetchGroups('').then((r) => { groupResults = r; });
	}

	function onCreateOpen(_formData: Record<string, any>) {
		groupSearch = '';
		groupDropdownOpen = false;
		groupResults = [];
		fetchGroups('').then((r) => { groupResults = r; });
	}

	// ── Click group name in table row to filter ───────────────────────────────
	function onTableClick(e: MouseEvent) {
		const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button.group-link');
		if (btn) {
			filterGroupId = btn.dataset.groupId!;
			filterGroupName = btn.dataset.groupName!;
			filterSearch = btn.dataset.groupName!;
			filterDropdownOpen = false;
		}
	}
</script>

<h1>{$LL.tags_page.title()}</h1>

<!-- ── Standalone group-name filter ───────────────────────────────────────── -->
<div class="group-filter-bar">
	<span class="filter-bar-label">{$LL.tags_page.col_tag_group()}:</span>
	<div class="filter-combobox-wrapper">
		<div class="combobox-input-row" class:active={filterGroupId !== null}>
			<input
				type="text"
				class="combobox-input"
				placeholder="Search group by name…"
				value={filterSearch}
				oninput={onFilterInput}
				onfocus={() => { filterDropdownOpen = true; if (filterResults.length === 0) fetchGroups('').then((r) => { filterResults = r; }); }}
				onblur={() => setTimeout(() => { filterDropdownOpen = false; }, 150)}
				autocomplete="off"
			/>
			{#if filterSearch}
				<button type="button" class="combobox-clear" onclick={clearFilterGroup} title="Clear" aria-label="Clear group filter">✕</button>
			{/if}
		</div>

		{#if filterDropdownOpen}
			<ul class="combobox-dropdown" role="listbox">
				{#if filterSearching}
					<li class="combobox-status">Searching…</li>
				{:else if filterResults.length === 0}
					<li class="combobox-status">No results</li>
				{:else}
					{#each filterResults as opt}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<li
							class="combobox-option"
							class:combobox-option-selected={filterGroupId === opt.id}
							role="option"
							aria-selected={filterGroupId === opt.id}
							onmousedown={() => selectFilterGroup(opt)}
						>
							<span class="opt-name">{opt.name}</span>
							<span class="opt-code">{opt.code}</span>
						</li>
					{/each}
				{/if}
			</ul>
		{/if}
	</div>

	{#if filterGroupId}
		<span class="active-filter-badge">Filtering: <strong>{filterGroupName}</strong></span>
	{/if}
</div>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onclick={onTableClick}>
<CrudTable
	resource="tags"
	apiPrefix="/api/tagging"
	columns={[
		{ key: 'id', label: $LL.tags_page.col_id(), sortable: false, hideInTable: true },
		{
			key: 'name',
			label: $LL.tags_page.col_name(),
			sortable: true,
			filterable: true,
			operators: ['eq', 'li', 'sw']
		},
		{
			key: 'slug',
			label: $LL.tags_page.col_slug(),
			sortable: true,
			filterable: true,
			operators: ['eq', 'li', 'sw']
		},
		{
			key: 'color',
			label: $LL.tags_page.col_color(),
			sortable: false,
			format: (v) => v ?? '—'
		},
		{
			key: 'tag_group_id',
			label: $LL.tags_page.col_tag_group(),
			sortable: false,
			format: (_v, row) => {
				const name = row?.tag_group?.name;
				const id = row?.tag_group_id;
				if (!name) return id ?? '—';
				return `<button class="group-link" data-group-id="${id}" data-group-name="${name}">${name}</button>`;
			}
		},
		{
			key: 'is_active',
			label: $LL.tags_page.col_is_active(),
			sortable: true,
			filterable: true,
			operators: ['eq'],
			format: formatBool
		},
		{
			key: 'usage_count',
			label: $LL.tags_page.col_usage_count(),
			sortable: true,
			format: (v) => String(v ?? 0)
		},
		{
			key: 'created_at',
			label: $LL.tags_page.col_created_at(),
			sortable: true,
			hideInTable: true,
			format: formatDate
		}
	]}
	formFields={[]}
	extraParams={tableExtraParams}
	{actions}
	onEdit={onEditOpen}
	onCreateOpen={onCreateOpen}
>
	{#snippet editSnippet(_editingItem, formData)}
		<!-- 1. Tag Group — searchable combobox -->
		<div class="form-group group-selector">
			<label class="field-label" for="field-tag-group-id">
				{$LL.tags_page.col_tag_group()} <span class="required-mark">*</span>
			</label>
			<div class="combobox-wrapper">
				<div class="combobox-input-row">
					<input
						id="field-tag-group-id"
						type="text"
						class="combobox-input"
						placeholder="Search by name…"
						value={groupSearch}
						oninput={(e) => onGroupInput(e, formData)}
						onfocus={() => { groupDropdownOpen = true; if (groupResults.length === 0) fetchGroups('').then((r) => { groupResults = r; }); }}
						onblur={() => setTimeout(() => { groupDropdownOpen = false; }, 150)}
						autocomplete="off"
					/>
					{#if formData.tag_group_id || groupSearch}
						<button type="button" class="combobox-clear" onclick={() => clearGroup(formData)} title="Clear" aria-label="Clear tag group selection">✕</button>
					{/if}
				</div>

				{#if formData.tag_group_id}
					<div class="selected-badge">
						<span class="selected-id">{formData.tag_group_id}</span>
					</div>
				{/if}

				{#if groupDropdownOpen}
					<ul class="combobox-dropdown" role="listbox">
						{#if groupSearching}
							<li class="combobox-status">Searching…</li>
						{:else if groupResults.length === 0}
							<li class="combobox-status">No results</li>
						{:else}
							{#each groupResults as opt}
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<li
									class="combobox-option"
									class:combobox-option-selected={formData.tag_group_id === opt.id}
									role="option"
									aria-selected={formData.tag_group_id === opt.id}
									onmousedown={() => selectGroup(opt, formData)}
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

		<!-- 2. Name -->
		<div class="form-group">
			<label class="field-label" for="field-name">{$LL.tags_page.col_name()} <span class="required-mark">*</span></label>
			<input id="field-name" type="text" required bind:value={formData.name} />
		</div>

		<!-- 3. Slug -->
		<div class="form-group">
			<label class="field-label" for="field-slug">{$LL.tags_page.col_slug()} <span class="required-mark">*</span></label>
			<input id="field-slug" type="text" required bind:value={formData.slug} />
		</div>

		<!-- 4. Color -->
		<div class="form-group">
			<label class="field-label" for="field-color">{$LL.tags_page.col_color()}</label>
			<input id="field-color" type="text" bind:value={formData.color} />
		</div>

		<!-- 5. Description -->
		<div class="form-group">
			<label class="field-label" for="field-description">{$LL.tags_page.col_description()}</label>
			<input id="field-description" type="text" bind:value={formData.description} />
		</div>

		<!-- 6. Sort order -->
		<div class="form-group">
			<label class="field-label" for="field-sort-order">
				{$LL.tags_page.col_sort_order()}
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
				<span class="meta-label">{$LL.tags_page.col_id()}</span>
				<span class="mono">{item.id}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.tags_page.col_tag_group()}</span>
				<span>
					{#if item.tag_group?.name}
						<span>{item.tag_group.name}</span>
						<span class="mono sub-id">{item.tag_group_id ?? '—'}</span>
					{:else}
						<span class="mono">{item.tag_group_id ?? '—'}</span>
					{/if}
				</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.tags_page.col_name()}</span>
				<span>{item.name ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.tags_page.col_slug()}</span>
				<span class="mono">{item.slug ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.tags_page.col_color()}</span>
				<span>
					{#if item.color}
						<span class="color-swatch" style="background: {item.color}; display: inline-block; width: 1rem; height: 1rem; border-radius: 2px; margin-right: 0.3rem; vertical-align: middle;"></span>
						{item.color}
					{:else}
						—
					{/if}
				</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.tags_page.col_description()}</span>
				<span>{item.description ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.tags_page.col_sort_order()}</span>
				<span>{item.sort_order ?? 0}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.tags_page.col_is_active()}</span>
				<span class="status-badge status-{item.is_active ? 'active' : 'inactive'}">{formatBool(item.is_active)}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.tags_page.col_alias_of()}</span>
				<span class="mono">{item.alias_of ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.tags_page.col_usage_count()}</span>
				<span>{item.usage_count ?? 0}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.tags_page.col_tenant_id()}</span>
				<span class="mono">{item.tenant_id ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.tags_page.col_created_at()}</span>
				<span>{formatDate(item.created_at)}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.tags_page.col_updated_at()}</span>
				<span>{formatDate(item.updated_at)}</span>
			</div>
		</div>
	{/snippet}
</CrudTable>
</div>

<style>
	.status-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.78rem; font-weight: 600; }
	.status-active   { background: #dcfce7; color: #15803d; }
	.status-inactive { background: #fee2e2; color: #dc2626; }
	.sub-id { display: block; font-size: 0.72rem; color: #9ca3af; margin-top: 0.1rem; }

	/* ── Standalone group-name filter bar ───────────────────────────── */
	.group-filter-bar {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 0.75rem;
		flex-wrap: wrap;
	}
	.filter-bar-label {
		font-size: 0.85rem;
		font-weight: 600;
		color: #374151;
		white-space: nowrap;
	}
	.filter-combobox-wrapper {
		position: relative;
		width: 260px;
	}
	.active-filter-badge {
		font-size: 0.82rem;
		background: #eff6ff;
		border: 1px solid #bfdbfe;
		color: #1e40af;
		border-radius: 4px;
		padding: 0.2rem 0.6rem;
	}

	/* Clickable group name in table */
	:global(button.group-link) {
		background: none;
		border: none;
		padding: 0;
		color: #4f46e5;
		font-size: inherit;
		font-weight: 500;
		cursor: pointer;
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	:global(button.group-link:hover) { color: #3730a3; }

	/* ── Combobox (shared by filter bar and edit form) ──────────────── */
	.group-selector { position: relative; }

	.field-label {
		display: block;
		margin-bottom: 0.3rem;
		font-weight: 500;
		font-size: 0.85rem;
	}
	.required-mark { color: #dc2626; }

	.combobox-wrapper { position: relative; }

	.combobox-input-row {
		display: flex;
		align-items: center;
		border: 1px solid #ddd;
		border-radius: 4px;
		background: #fff;
		overflow: hidden;
	}
	.combobox-input-row.active { border-color: #6366f1; }

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
	.combobox-clear:hover { color: #dc2626; }

	.selected-badge { margin-top: 0.25rem; font-size: 0.75rem; color: #6b7280; }
	.selected-id { font-family: monospace; background: #f3f4f6; padding: 0.1rem 0.35rem; border-radius: 3px; }

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

	.combobox-status { padding: 0.5rem 0.75rem; font-size: 0.85rem; color: #9ca3af; font-style: italic; }

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
	.combobox-option-selected { background: #eff6ff; }

	.opt-name { font-weight: 500; color: #111827; }
	.opt-code { font-size: 0.78rem; font-family: monospace; color: #6b7280; background: #f3f4f6; padding: 0.1rem 0.35rem; border-radius: 3px; }

	#field-sort-order { width: 100%; padding: 0.4rem; border: 1px solid #ddd; border-radius: 4px; }

	/* Inputs rendered directly in editSnippet */
	.form-group input[type="text"],
	.form-group select { width: 100%; padding: 0.4rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
</style>
