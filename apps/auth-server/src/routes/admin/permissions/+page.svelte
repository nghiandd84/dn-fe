<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { MASK_BITS, maskToActions, maskToCrudActions } from '$lib/components/types';
	import { LL } from '$i18n/i18n-util';

	let { data } = $props();

	const actions = $derived(maskToCrudActions((data as any).authMasks?.['permissions'] ?? 0));

	function maskFormat(v: any): string {
		if (v == null) return '—';
		const actions = maskToActions(Number(v));
		if (!actions.length) return String(v);
		return actions
			.map(a => {
				const colors: Record<string, string> = {
					read:   'background:#dbeafe;color:#1d4ed8',
					create: 'background:#dcfce7;color:#15803d',
					update: 'background:#fef9c3;color:#a16207',
					delete: 'background:#fee2e2;color:#b91c1c',
					admin:  'background:#f3e8ff;color:#7e22ce',
				};
				const style = colors[a.toLowerCase()] ?? 'background:#f3f4f6;color:#374151';
				return `<span style="font-size:0.65rem;font-weight:600;border-radius:3px;padding:0.05rem 0.35rem;white-space:nowrap;${style}">${a}</span>`;
			})
			.join(' ');
	}

	function initMask(value: number | null, formData: Record<string, any>) {
		currentMask = Number(value ?? 0);
		formData.mask = currentMask;
	}

	let currentMask = $state(0);

	function toggleBit(bit: number, checked: boolean, formData: Record<string, any>) {
		currentMask = checked ? (currentMask | bit) : (currentMask & ~bit);
		formData.mask = currentMask;
	}
</script>

<h1>{$LL.permissions_page.title()}</h1>
<CrudTable
	resource="permissions"
	columns={[
		{ key: 'resource', label: 'Resource', sortable: true, filterable: true, operators: ['eq', 'li', 'sw'] },
		{ key: 'mask', label: 'Mask', sortable: true, format: maskFormat },
		{ key: 'description', label: 'Description' },
	]}
	formFields={[
		{ key: 'resource', label: 'Resource', type: 'text', required: true },
		{ key: 'description', label: 'Description', type: 'text' },
	]}
	actions={actions}
	onEdit={(item, formData) => initMask(item.mask, formData)}
	onCreateOpen={(formData) => initMask(null, formData)}
>
	{#snippet editSnippet(_item, formData)}
		<div class="mask-editor">
			<span class="mask-label">{$LL.permissions_page.mask_label()}</span>
			<div class="mask-bits">
				{#each MASK_BITS as { bit, label }}
					<label
						class="bit-option"
						class:bit-active={(currentMask & bit) !== 0}
					>
						<input
							type="checkbox"
							checked={(currentMask & bit) !== 0}
							onchange={(e) => toggleBit(bit, (e.target as HTMLInputElement).checked, formData)}
						/>
						{label}
					</label>
				{/each}
			</div>
			<span class="mask-value">{$LL.permissions_page.mask_value({ value: currentMask })}</span>
		</div>
	{/snippet}

	{#snippet detailSnippet(perm)}
		<div class="perm-detail">
			<div class="meta-row"><span class="meta-label">Resource</span><span>{perm.resource}</span></div>
			<div class="meta-row"><span class="meta-label">Description</span><span>{perm.description ?? '—'}</span></div>
			<div class="meta-row">
				<span class="meta-label">{$LL.permissions_page.mask_label()}</span>
				<span class="actions-wrap">
					{#if perm.mask != null}
						{#each maskToActions(perm.mask) as action}
							<span class="perm-action perm-action--{action.toLowerCase()}">{action}</span>
						{/each}
						<span class="mask-raw">({perm.mask})</span>
					{:else}
						—
					{/if}
				</span>
			</div>
		</div>
	{/snippet}
</CrudTable>

<style>
	/* Mask checkbox editor (unique to permissions page) */
	.mask-editor { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
	.mask-label { font-size: 0.85rem; font-weight: 600; color: #374151; min-width: 70px; }
	.mask-bits { display: flex; gap: 0.4rem; flex-wrap: wrap; }
	.bit-option { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.25rem 0.65rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.82rem; font-weight: 500; color: #6b7280; background: #f9fafb; cursor: pointer; transition: all 0.15s; user-select: none; }
	.bit-option input { display: none; }
	.bit-option.bit-active { background: #4f46e5; color: #fff; border-color: #4f46e5; }
	.mask-value { font-size: 0.75rem; color: #9ca3af; font-family: monospace; }

	/* Detail view */
	.perm-detail { display: flex; flex-direction: column; gap: 0.5rem; min-width: 340px; }
	.actions-wrap { display: flex; flex-wrap: wrap; gap: 0.3rem; align-items: center; }
	.mask-raw { font-size: 0.72rem; color: #9ca3af; font-family: monospace; }
</style>
