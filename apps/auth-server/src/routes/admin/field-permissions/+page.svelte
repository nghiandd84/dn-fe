<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { maskToCrudActions } from '$lib/components/types';
	import { fingerprint } from '$lib/fingerprint';
	import { get } from 'svelte/store';
	import { LL } from '$i18n/i18n-util';

	let { data } = $props();

	const actions = $derived(maskToCrudActions((data as any).authMasks?.['field-permissions'] ?? 0));

	// Action constants
	const ACTION_READ   = 1;
	const ACTION_UPDATE = 4;

	// ── Roles map: role_id → role_name ────────────────────────────────────────
	let rolesMap = $state<Map<string, string>>(new Map());

	async function loadRoles() {
		const allRows: any[] = [];
		let currentPage = 1;
		let totalPages = 1;
		const fp = get(fingerprint);
		do {
			const res = await fetch(`/api/admin/roles?page_size=20&page=${currentPage}`, {
				headers: { 'X-Client-Fingerprint': fp }
			});
			const json = await res.json();
			const rows: any[] = json.data?.result ?? [];
			allRows.push(...rows);
			totalPages = json.data?.total_page ?? 1;
			currentPage++;
		} while (currentPage <= totalPages);
		rolesMap = new Map(allRows.map((r: any) => [r.id, r.name]));
	}

	$effect(() => { loadRoles(); });

	function roleFormat(_v: any, item: any): string {
		const name = rolesMap.get(item?.role_id);
		if (name) return `<span style="font-weight:500">${name}</span>`;
		return `<span style="font-family:monospace;font-size:0.78rem;color:#9ca3af">${item?.role_id ?? '—'}</span>`;
	}

	function actionLabel(action: number | null): string {
		if (action === ACTION_READ)   return 'READ';
		if (action === ACTION_UPDATE) return 'UPDATE';
		return String(action ?? '—');
	}

	function actionFormat(v: any): string {
		if (v == null) return '—';
		const n = Number(v);
		if (n === ACTION_READ) {
			return '<span style="font-size:0.7rem;font-weight:600;border-radius:3px;padding:0.05rem 0.45rem;background:#dbeafe;color:#1d4ed8">READ</span>';
		}
		if (n === ACTION_UPDATE) {
			return '<span style="font-size:0.7rem;font-weight:600;border-radius:3px;padding:0.05rem 0.45rem;background:#fef9c3;color:#a16207">UPDATE</span>';
		}
		return String(n);
	}

	function fieldsFormat(v: any): string {
		if (!v || !Array.isArray(v) || v.length === 0) return '—';
		return v
			.map((f: string) =>
				`<span style="font-size:0.7rem;font-weight:500;border-radius:3px;padding:0.05rem 0.4rem;background:#f3f4f6;color:#374151;border:1px solid #e5e7eb">${f}</span>`
			)
			.join(' ');
	}

	// ── Form state for fields (tag-style editor) ──────────────────────────────
	let currentFields: string[] = $state([]);
	let fieldInput = $state('');
	let currentAction = $state<number>(ACTION_READ);

	function initForm(item: any | null, formData: Record<string, any>) {
		currentFields = Array.isArray(item?.fields) ? [...item.fields] : [];
		currentAction = item?.action ?? ACTION_READ;
		formData.fields  = [...currentFields];
		formData.action  = currentAction;
	}

	function addField() {
		const val = fieldInput.trim();
		if (!val) return;
		// support comma-separated entry
		const parts = val.split(',').map(s => s.trim()).filter(Boolean);
		const toAdd = parts.filter(p => !currentFields.includes(p));
		if (!toAdd.length) { fieldInput = ''; return; }
		currentFields = [...currentFields, ...toAdd];
		fieldInput = '';
	}

	function removeField(f: string) {
		currentFields = currentFields.filter(x => x !== f);
	}

	function syncFields(formData: Record<string, any>) {
		formData.fields = [...currentFields];
	}

	function onFieldKeydown(e: KeyboardEvent, formData: Record<string, any>) {
		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault();
			addField();
			syncFields(formData);
		}
	}

	function onActionChange(value: number, formData: Record<string, any>) {
		currentAction = value;
		formData.action = value;
	}
</script>

<h1>{$LL.field_permissions_page.title()}</h1>
<CrudTable
	resource="field-permissions"
	columns={[
		{
			key: 'role_id',
			label: $LL.field_permissions_page.col_role(),
			filterable: true,
			operators: ['eq'],
			format: roleFormat
		},
		{
			key: 'resource',
			label: $LL.field_permissions_page.col_resource(),
			sortable: true,
			filterable: true,
			operators: ['eq', 'li', 'sw']
		},
		{
			key: 'action',
			label: $LL.field_permissions_page.col_action(),
			sortable: true,
			filterable: true,
			operators: ['eq'],
			format: actionFormat
		},
		{
			key: 'fields',
			label: $LL.field_permissions_page.col_fields(),
			format: fieldsFormat
		},
	]}
	formFields={[
		{
			key: 'role_id',
			label: $LL.field_permissions_page.col_role(),
			type: 'select-remote',
			required: true,
			remoteOptions: { url: '/api/admin/roles', valueKey: 'id', labelKey: 'name' }
		},
		{
			key: 'resource',
			label: $LL.field_permissions_page.col_resource(),
			type: 'text',
			required: true
		},
	]}
	{actions}
	onEdit={(item, formData) => initForm(item, formData)}
	onCreateOpen={(formData) => initForm(null, formData)}
>
	{#snippet editSnippet(_item, formData)}
		<!-- Action selector -->
		<div class="fp-field-row">
			<span class="fp-label">{$LL.field_permissions_page.col_action()} *</span>
			<div class="fp-action-group">
				<label
					class="fp-action-opt"
					class:fp-action-active={currentAction === ACTION_READ}
				>
					<input
						type="radio"
						name="fp-action"
						value={ACTION_READ}
						checked={currentAction === ACTION_READ}
						onchange={() => onActionChange(ACTION_READ, formData)}
					/>
					READ
				</label>
				<label
					class="fp-action-opt"
					class:fp-action-active={currentAction === ACTION_UPDATE}
				>
					<input
						type="radio"
						name="fp-action"
						value={ACTION_UPDATE}
						checked={currentAction === ACTION_UPDATE}
						onchange={() => onActionChange(ACTION_UPDATE, formData)}
					/>
					UPDATE
				</label>
			</div>
		</div>

		<!-- Fields tag editor -->
		<div class="fp-field-row fp-field-row--top">
			<span class="fp-label">{$LL.field_permissions_page.col_fields()}</span>
			<div class="fp-tags-editor">
				<div class="fp-tags">
					{#if currentFields.length === 0}
						<span class="fp-tags-empty">{$LL.field_permissions_page.no_fields()}</span>
					{:else}
						{#each currentFields as f}
							<span class="fp-tag">
								{f}
								<button
									type="button"
									class="fp-tag-remove"
									onclick={() => { removeField(f); syncFields(formData); }}
									title="Remove"
								>✕</button>
							</span>
						{/each}
					{/if}
				</div>
				<div class="fp-input-row">
					<input
						class="fp-input"
						type="text"
						bind:value={fieldInput}
						placeholder={$LL.field_permissions_page.fields_placeholder()}
						onkeydown={(e) => onFieldKeydown(e, formData)}
					/>
					<button
						type="button"
						class="fp-add-btn"
						onclick={() => { addField(); syncFields(formData); }}
					>+</button>
				</div>
			</div>
		</div>
	{/snippet}

	{#snippet detailSnippet(item)}
		<div class="fp-detail">
			<div class="fp-meta-row">
				<span class="fp-meta-label">{$LL.field_permissions_page.col_role()}</span>
				<span>{rolesMap.get(item.role_id) ?? item.role_name ?? item.role_id ?? '—'}</span>
			</div>
			<div class="fp-meta-row">
				<span class="fp-meta-label">{$LL.field_permissions_page.col_resource()}</span>
				<span class="fp-resource-code">{item.resource ?? '—'}</span>
			</div>
			<div class="fp-meta-row">
				<span class="fp-meta-label">{$LL.field_permissions_page.col_action()}</span>
				<span class="fp-action-badge fp-action-badge--{actionLabel(item.action).toLowerCase()}">
					{actionLabel(item.action)}
				</span>
			</div>
			<div class="fp-meta-row fp-meta-row--top">
				<span class="fp-meta-label">{$LL.field_permissions_page.col_fields()}</span>
				<div class="fp-fields-wrap">
					{#if !item.fields || item.fields.length === 0}
						<span class="fp-fields-empty">—</span>
					{:else}
						{#each item.fields as f}
							<span class="fp-tag fp-tag--view">{f}</span>
						{/each}
					{/if}
				</div>
			</div>
			{#if item.created_at}
				<div class="fp-meta-row">
					<span class="fp-meta-label">{$LL.field_permissions_page.created_at()}</span>
					<span class="fp-meta-muted">{new Date(item.created_at).toLocaleString()}</span>
				</div>
			{/if}
			{#if item.updated_at}
				<div class="fp-meta-row">
					<span class="fp-meta-label">{$LL.field_permissions_page.updated_at()}</span>
					<span class="fp-meta-muted">{new Date(item.updated_at).toLocaleString()}</span>
				</div>
			{/if}
		</div>
	{/snippet}
</CrudTable>

<style>
	/* Field-permissions page — unique styles */

	/* Action radio group */
	.fp-field-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.1rem 0; }
	.fp-field-row--top { align-items: flex-start; }
	.fp-label { font-size: 0.85rem; font-weight: 600; color: #374151; min-width: 80px; flex-shrink: 0; }

	.fp-action-group { display: flex; gap: 0.5rem; flex-wrap: wrap; }
	.fp-action-opt { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.3rem 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.82rem; font-weight: 600; color: #6b7280; background: #f9fafb; cursor: pointer; user-select: none; }
	.fp-action-opt input { display: none; }
	.fp-action-opt.fp-action-active { background: #4f46e5; color: #fff; border-color: #4f46e5; }

	/* Tags editor */
	.fp-tags-editor { flex: 1; display: flex; flex-direction: column; gap: 0.4rem; }
	.fp-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; min-height: 2rem; padding: 0.35rem 0.5rem; border: 1px solid #d1d5db; border-radius: 6px; background: #f9fafb; }
	.fp-tags-empty { font-size: 0.78rem; color: #9ca3af; align-self: center; }

	.fp-tag { display: inline-flex; align-items: center; gap: 0.2rem; background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe; border-radius: 4px; padding: 0.1rem 0.4rem; font-size: 0.78rem; font-weight: 500; font-family: monospace; }
	.fp-tag--view { background: #f3f4f6; color: #374151; border-color: #e5e7eb; }
	.fp-tag-remove { background: none; border: none; color: #6366f1; cursor: pointer; font-size: 0.65rem; padding: 0; line-height: 1; display: flex; align-items: center; }
	.fp-tag-remove:hover { color: #dc2626; }

	.fp-input-row { display: flex; gap: 0.3rem; }
	.fp-input { flex: 1; padding: 0.3rem 0.5rem; border: 1px solid #d1d5db; border-radius: 5px; font-size: 0.82rem; font-family: monospace; outline: none; }
	.fp-input:focus { border-color: #6366f1; }
	.fp-add-btn { padding: 0.3rem 0.6rem; background: #4f46e5; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; font-weight: 600; line-height: 1; }
	.fp-add-btn:hover { background: #4338ca; }

	/* Detail view */
	.fp-detail { display: flex; flex-direction: column; gap: 0.5rem; min-width: 360px; }
	.fp-meta-row { display: grid; grid-template-columns: 100px 1fr; gap: 0.5rem; font-size: 0.875rem; align-items: center; }
	.fp-meta-row--top { align-items: flex-start; }
	.fp-meta-label { font-weight: 600; color: #555; }
	.fp-meta-muted { color: #9ca3af; font-size: 0.8rem; }
	.fp-resource-code { font-family: monospace; font-size: 0.82rem; background: #f3f4f6; padding: 0.1rem 0.4rem; border-radius: 3px; }

	.fp-action-badge { display: inline-block; font-size: 0.7rem; font-weight: 700; border-radius: 3px; padding: 0.1rem 0.5rem; text-transform: uppercase; }
	.fp-action-badge--read   { background: #dbeafe; color: #1d4ed8; }
	.fp-action-badge--update { background: #fef9c3; color: #a16207; }

	.fp-fields-wrap { display: flex; flex-wrap: wrap; gap: 0.3rem; }
	.fp-fields-empty { color: #9ca3af; }
</style>
