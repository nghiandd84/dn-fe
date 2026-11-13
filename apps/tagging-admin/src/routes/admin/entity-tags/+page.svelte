<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { LL } from '$i18n/i18n-util';
	import { maskToCrudActions } from '@dn-fe/ui/types';
	import { fingerprint } from '$lib/fingerprint';
	import { get } from 'svelte/store';

	let { data } = $props();
	const actions = $derived(maskToCrudActions((data as any).authMasks?.['entity-tags'] ?? 0));

	function formatDate(v: string | null): string {
		if (!v) return '—';
		try { return new Date(v).toLocaleString(); } catch { return v; }
	}

	// ── Tag search combobox ───────────────────────────────────────────────────
	let tagSearch = $state('');
	let tagResults = $state<{ id: string; name: string; slug: string }[]>([]);
	let tagSearching = $state(false);
	let tagDropdownOpen = $state(false);
	let tagSearchTimer: ReturnType<typeof setTimeout> | null = null;

	async function fetchTags(query: string): Promise<{ id: string; name: string; slug: string }[]> {
		try {
			const params = new URLSearchParams({ page: '1', page_size: '10', is_active: 'eq|true' });
			if (query.trim()) params.set('name', `li|${query.trim()}`);
			const res = await fetch(`/api/tagging/tags?${params}`, {
				headers: { 'X-Client-Fingerprint': get(fingerprint) }
			});
			const json = await res.json();
			return (json.data?.result ?? []).map((r: any) => ({ id: r.id, name: r.name, slug: r.slug }));
		} catch { return []; }
	}

	async function loadTagLabel(id: string): Promise<string | null> {
		try {
			const res = await fetch(`/api/tagging/tags/${id}`, {
				headers: { 'X-Client-Fingerprint': get(fingerprint) }
			});
			const json = await res.json();
			const t = json.data;
			if (t?.name) return `${t.name} (${t.slug})`;
		} catch { /* ignore */ }
		return null;
	}

	function onTagInput(e: Event, formData: Record<string, any>) {
		tagSearch = (e.target as HTMLInputElement).value;
		formData.tag_id = null;
		tagDropdownOpen = true;
		if (tagSearchTimer) clearTimeout(tagSearchTimer);
		tagSearchTimer = setTimeout(async () => {
			tagSearching = true;
			tagResults = await fetchTags(tagSearch);
			tagSearching = false;
		}, 250);
	}

	function selectTag(opt: { id: string; name: string; slug: string }, formData: Record<string, any>) {
		formData.tag_id = opt.id;
		tagSearch = `${opt.name} (${opt.slug})`;
		tagDropdownOpen = false;
	}

	function clearTag(formData: Record<string, any>) {
		formData.tag_id = null;
		tagSearch = '';
		tagDropdownOpen = false;
		tagResults = [];
	}

	// ── Entity search combobox ────────────────────────────────────────────────
	// Entity IDs are arbitrary UUIDs from other services — no backing search API.
	// We provide a free-text input with a helper that fetches entities tagged with
	// the current entity_type via GET /entities/{entity_type}/{entity_id}/tags as
	// a proxy check, but since there is no entity listing API we present a plain
	// searchable text field that filters previously seen entity_ids from entity-tags.
	let entitySearch = $state('');
	let entityResults = $state<{ entity_id: string; entity_type: string }[]>([]);
	let entitySearching = $state(false);
	let entityDropdownOpen = $state(false);
	let entitySearchTimer: ReturnType<typeof setTimeout> | null = null;

	async function fetchEntities(query: string, entityType: string): Promise<{ entity_id: string; entity_type: string }[]> {
		try {
			const params = new URLSearchParams({ page: '1', page_size: '20' });
			if (entityType.trim()) params.set('entity_type', `eq|${entityType.trim()}`);
			if (query.trim()) params.set('entity_id', `li|${query.trim()}`);
			const res = await fetch(`/api/tagging/entity-tags?${params}`, {
				headers: { 'X-Client-Fingerprint': get(fingerprint) }
			});
			const json = await res.json();
			const rows: any[] = json.data?.result ?? [];
			// Deduplicate by entity_id
			const seen = new Set<string>();
			return rows
				.filter((r) => { if (seen.has(r.entity_id)) return false; seen.add(r.entity_id); return true; })
				.map((r) => ({ entity_id: r.entity_id, entity_type: r.entity_type }));
		} catch { return []; }
	}

	function onEntityInput(e: Event, formData: Record<string, any>) {
		entitySearch = (e.target as HTMLInputElement).value;
		formData.entity_id = entitySearch || null;
		entityDropdownOpen = true;
		if (entitySearchTimer) clearTimeout(entitySearchTimer);
		entitySearchTimer = setTimeout(async () => {
			entitySearching = true;
			entityResults = await fetchEntities(entitySearch, formData.entity_type ?? '');
			entitySearching = false;
		}, 300);
	}

	function selectEntity(opt: { entity_id: string }, formData: Record<string, any>) {
		formData.entity_id = opt.entity_id;
		entitySearch = opt.entity_id;
		entityDropdownOpen = false;
	}

	function clearEntity(formData: Record<string, any>) {
		formData.entity_id = null;
		entitySearch = '';
		entityDropdownOpen = false;
		entityResults = [];
	}

	// ── Modal open hooks ──────────────────────────────────────────────────────
	function onEditOpen(item: any, _formData: Record<string, any>) {
		// Tag
		if (item?.tag_id) {
			tagSearch = item.tag_id;
			loadTagLabel(item.tag_id).then((label) => { if (label) tagSearch = label; });
		} else { tagSearch = ''; }
		tagDropdownOpen = false;
		tagResults = [];
		fetchTags('').then((r) => { tagResults = r; });
		// Entity
		entitySearch = item?.entity_id ?? '';
		entityDropdownOpen = false;
		entityResults = [];
	}

	function onCreateOpen(_formData: Record<string, any>) {
		tagSearch = '';
		tagDropdownOpen = false;
		tagResults = [];
		fetchTags('').then((r) => { tagResults = r; });
		entitySearch = '';
		entityDropdownOpen = false;
		entityResults = [];
	}
</script>

<h1>{$LL.entity_tags_page.title()}</h1>

<CrudTable
	resource="entity-tags"
	apiPrefix="/api/tagging"
	columns={[
		{ key: 'id', label: $LL.entity_tags_page.col_id(), sortable: false, hideInTable: true },
		{
			key: 'tag_id',
			label: $LL.entity_tags_page.col_tag(),
			sortable: false,
			filterable: true,
			operators: ['eq'],
			format: (v) => v ?? '—'
		},
		{
			key: 'entity_id',
			label: $LL.entity_tags_page.col_entity(),
			sortable: false,
			filterable: true,
			operators: ['eq'],
			format: (v) => v ?? '—'
		},
		{
			key: 'entity_type',
			label: $LL.entity_tags_page.col_entity_type(),
			sortable: true,
			filterable: true,
			operators: ['eq', 'li'],
			format: (v) => v ? `<span class="entity-type-badge">${v}</span>` : '—'
		},
		{
			key: 'created_at',
			label: $LL.entity_tags_page.col_created_at(),
			sortable: true,
			format: formatDate
		}
	]}
	formFields={[]}
	{actions}
	onEdit={onEditOpen}
	onCreateOpen={onCreateOpen}
>
	{#snippet editSnippet(_editingItem, formData)}
		<!-- 1. Tag — searchable combobox -->
		<div class="form-group tag-selector">
			<label class="field-label" for="field-tag-id">
				{$LL.entity_tags_page.col_tag()} <span class="required-mark">*</span>
			</label>
			<div class="combobox-wrapper">
				<div class="combobox-input-row">
					<input
						id="field-tag-id"
						type="text"
						class="combobox-input"
						placeholder="Search by name…"
						value={tagSearch}
						oninput={(e) => onTagInput(e, formData)}
						onfocus={() => { tagDropdownOpen = true; if (tagResults.length === 0) fetchTags('').then((r) => { tagResults = r; }); }}
						onblur={() => setTimeout(() => { tagDropdownOpen = false; }, 150)}
						autocomplete="off"
					/>
					{#if formData.tag_id || tagSearch}
						<button type="button" class="combobox-clear" onclick={() => clearTag(formData)} title="Clear" aria-label="Clear tag">✕</button>
					{/if}
				</div>
				{#if formData.tag_id}
					<div class="selected-badge"><span class="selected-id">{formData.tag_id}</span></div>
				{/if}
				{#if tagDropdownOpen}
					<ul class="combobox-dropdown" role="listbox">
						{#if tagSearching}
							<li class="combobox-status">Searching…</li>
						{:else if tagResults.length === 0}
							<li class="combobox-status">No results</li>
						{:else}
							{#each tagResults as opt}
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<li class="combobox-option" class:combobox-option-selected={formData.tag_id === opt.id}
									role="option" aria-selected={formData.tag_id === opt.id}
									onmousedown={() => selectTag(opt, formData)}>
									<span class="opt-name">{opt.name}</span>
									<span class="opt-code">{opt.slug}</span>
								</li>
							{/each}
						{/if}
					</ul>
				{/if}
			</div>
		</div>

		<!-- 2. Entity — searchable by known entity_ids from existing records -->
		<div class="form-group entity-selector">
			<label class="field-label" for="field-entity-id">
				{$LL.entity_tags_page.col_entity()} <span class="required-mark">*</span>
			</label>
			<div class="combobox-wrapper">
				<div class="combobox-input-row">
					<input
						id="field-entity-id"
						type="text"
						class="combobox-input"
						placeholder="Type entity ID or search existing…"
						value={entitySearch}
						oninput={(e) => onEntityInput(e, formData)}
						onfocus={() => {
							entityDropdownOpen = true;
							if (entityResults.length === 0) fetchEntities('', formData.entity_type ?? '').then((r) => { entityResults = r; });
						}}
						onblur={() => setTimeout(() => { entityDropdownOpen = false; }, 150)}
						autocomplete="off"
					/>
					{#if entitySearch}
						<button type="button" class="combobox-clear" onclick={() => clearEntity(formData)} title="Clear" aria-label="Clear entity">✕</button>
					{/if}
				</div>
				{#if formData.entity_id}
					<div class="selected-badge"><span class="selected-id">{formData.entity_id}</span></div>
				{/if}
				{#if entityDropdownOpen}
					<ul class="combobox-dropdown" role="listbox">
						{#if entitySearching}
							<li class="combobox-status">Searching…</li>
						{:else if entityResults.length === 0}
							<li class="combobox-status">No existing records — type an ID directly</li>
						{:else}
							{#each entityResults as opt}
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<li class="combobox-option" class:combobox-option-selected={formData.entity_id === opt.entity_id}
									role="option" aria-selected={formData.entity_id === opt.entity_id}
									onmousedown={() => selectEntity(opt, formData)}>
									<span class="opt-name mono">{opt.entity_id}</span>
									<span class="opt-code">{opt.entity_type}</span>
								</li>
							{/each}
						{/if}
					</ul>
				{/if}
			</div>
		</div>

		<!-- 3. Entity Type — at bottom -->
		<div class="form-group">
			<label class="field-label" for="field-entity-type">
				{$LL.entity_tags_page.col_entity_type()} <span class="required-mark">*</span>
			</label>
			<input
				id="field-entity-type"
				type="text"
				required
				bind:value={formData.entity_type}
				placeholder="e.g. event, merchant, booking"
			/>
		</div>
	{/snippet}

	{#snippet detailSnippet(item)}
		<div class="meta-detail">
			<div class="meta-row">
				<span class="meta-label">{$LL.entity_tags_page.col_id()}</span>
				<span class="mono">{item.id}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.entity_tags_page.col_tag()}</span>
				<span class="mono">{item.tag_id ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.entity_tags_page.col_entity()}</span>
				<span class="mono">{item.entity_id ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.entity_tags_page.col_entity_type()}</span>
				<span class="entity-type-badge">{item.entity_type ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.entity_tags_page.col_tenant_id()}</span>
				<span class="mono">{item.tenant_id ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.entity_tags_page.col_created_at()}</span>
				<span>{formatDate(item.created_at)}</span>
			</div>
		</div>
	{/snippet}
</CrudTable>

<style>
	:global(.entity-type-badge) {
		display: inline-block;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		font-size: 0.78rem;
		font-weight: 600;
		background: #e0f2fe;
		color: #0369a1;
	}

	/* ── Combobox ────────────────────────────────────────────────────── */
	.tag-selector, .entity-selector { position: relative; }

	.field-label { display: block; margin-bottom: 0.3rem; font-weight: 500; font-size: 0.85rem; }
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
		left: 0; right: 0;
		background: #fff;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		box-shadow: 0 4px 12px rgba(0,0,0,0.12);
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
	.combobox-option:hover, .combobox-option-selected { background: #eff6ff; }

	.opt-name { font-weight: 500; color: #111827; }
	.opt-code { font-size: 0.78rem; font-family: monospace; color: #6b7280; background: #f3f4f6; padding: 0.1rem 0.35rem; border-radius: 3px; }
	.mono { font-family: monospace; }

	/* entity_type text input */
	.form-group input[type="text"] { width: 100%; padding: 0.4rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 0.9rem; }
</style>
