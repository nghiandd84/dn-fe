<script lang="ts">
	import { MASK_BITS } from '$lib/components/types';
	import { fingerprint } from '$lib/fingerprint';
	import { LL } from '$i18n/i18n-util';
	import { get } from 'svelte/store';

	let {
		onSaved,
		oncancel,
	}: {
		onSaved: () => void;
		oncancel: () => void;
	} = $props();

	let resource = $state('');
	let description = $state('');
	let mask = $state(0);
	let saving = $state(false);
	let error = $state('');

	function toggleBit(bit: number, checked: boolean) {
		mask = checked ? (mask | bit) : (mask & ~bit);
	}

	async function handleSave() {
		if (!resource.trim()) { error = $LL.roles_page.new_permission_resource(); return; }
		saving = true;
		error = '';
		const res = await fetch('/api/admin/permissions', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'X-Client-Fingerprint': get(fingerprint) },
			body: JSON.stringify({ resource: resource.trim(), description: description.trim() || undefined, mask })
		});
		saving = false;
		if (res.ok) {
			onSaved();
		} else {
			const json = await res.json().catch(() => ({}));
			error = json?.message ?? 'Failed to create permission';
		}
	}
</script>

<div class="overlay" role="presentation" onclick={oncancel}>
	<!-- svelte-ignore a11y_interactive_supports_focus -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="dialog" role="dialog" aria-modal="true" onclick={(e) => e.stopPropagation()}>
		<h3 class="dialog-title">{$LL.crud_table.create_title({ resource: 'permission' })}</h3>

		<div class="form-group">
			<span class="form-label">{$LL.roles_page.new_permission_resource()}</span>
			<input type="text" bind:value={resource} placeholder="e.g. users:read" />
		</div>

		<div class="form-group">
			<span class="form-label">{$LL.roles_page.new_permission_description()}</span>
			<input type="text" bind:value={description} placeholder="Optional" />
		</div>

		<div class="form-group">
			<span class="form-label">{$LL.permissions_page.mask_label()}</span>
			<div class="mask-bits">
				{#each MASK_BITS as { bit, label }}
					<label class="bit-option" class:bit-active={(mask & bit) !== 0}>
						<input type="checkbox" checked={(mask & bit) !== 0}
							onchange={(e) => toggleBit(bit, (e.target as HTMLInputElement).checked)}
						/>
						{label}
					</label>
				{/each}
			</div>
			<span class="mask-value">{$LL.permissions_page.mask_value({ value: mask })}</span>
		</div>

		{#if error}
			<p class="error">{error}</p>
		{/if}

		<div class="actions">
			<button class="btn btn-cancel" type="button" onclick={oncancel}>{$LL.crud_table.cancel()}</button>
			<button class="btn btn-primary" type="button" onclick={handleSave} disabled={saving || !resource.trim()}>
				{saving ? $LL.crud_table.loading() : $LL.crud_table.save()}
			</button>
		</div>
	</div>
</div>

<style>
	.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 200; }
	.dialog { background: #fff; border-radius: 10px; padding: 1.5rem 1.75rem; min-width: 420px; max-width: 90vw; box-shadow: 0 8px 32px rgba(0,0,0,0.18); display: flex; flex-direction: column; gap: 0.9rem; }
	.dialog-title { margin: 0; font-size: 1rem; font-weight: 700; color: #111; }
	.form-group { display: flex; flex-direction: column; gap: 0.3rem; }
	.form-group label, .form-group .form-label { font-size: 0.82rem; font-weight: 600; color: #374151; }
	.form-group input { padding: 0.4rem 0.6rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.85rem; outline: none; }
	.form-group input:focus { border-color: #4f46e5; }
	.mask-bits { display: flex; gap: 0.35rem; flex-wrap: wrap; }
	.bit-option { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.2rem 0.6rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.8rem; font-weight: 500; color: #6b7280; background: #f9fafb; cursor: pointer; transition: all 0.15s; user-select: none; }
	.bit-option input { display: none; }
	.bit-option.bit-active { background: #4f46e5; color: #fff; border-color: #4f46e5; }
	.mask-value { font-size: 0.72rem; color: #9ca3af; font-family: monospace; }
	.error { margin: 0; font-size: 0.82rem; color: #dc2626; }
	.actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.25rem; }
	.btn { padding: 0.4rem 1rem; border-radius: 6px; border: 1px solid #d1d5db; cursor: pointer; font-size: 0.85rem; font-weight: 500; background: #fff; }
	.btn-cancel { color: #374151; }
	.btn-cancel:hover { background: #f3f4f6; }
	.btn-primary { background: #4f46e5; color: #fff; border-color: #4f46e5; }
	.btn-primary:hover:not(:disabled) { background: #4338ca; }
	.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
