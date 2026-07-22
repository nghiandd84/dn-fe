<script lang="ts">
	import { LL } from '$i18n/i18n-util';

	let {
		message = 'Are you sure?',
		confirmLabel = 'Confirm',
		cancelLabel = 'Cancel',
		danger = true,
		onconfirm,
		oncancel,
	}: {
		message?: string;
		confirmLabel?: string;
		cancelLabel?: string;
		danger?: boolean;
		onconfirm: () => void;
		oncancel: () => void;
	} = $props();
</script>

<div class="overlay" role="presentation" onclick={oncancel}>
	<!-- svelte-ignore a11y_interactive_supports_focus -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="dialog" role="alertdialog" aria-modal="true" onclick={(e) => e.stopPropagation()}>
		<p class="message">{message || $LL.confirm_modal.default_message()}</p>
		<div class="actions">
			<button class="btn btn-cancel" onclick={oncancel}>{cancelLabel || $LL.confirm_modal.cancel()}</button>
			<button class="btn" class:btn-danger={danger} class:btn-primary={!danger} onclick={onconfirm}>
				{confirmLabel || $LL.confirm_modal.confirm()}
			</button>
		</div>
	</div>
</div>

<style>
	.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 200; }
	.dialog { background: #fff; border-radius: 10px; padding: 1.5rem 1.75rem; min-width: 300px; max-width: 420px; box-shadow: 0 8px 32px rgba(0,0,0,0.18); display: flex; flex-direction: column; gap: 1.25rem; }
	.message { margin: 0; font-size: 0.95rem; color: #111; line-height: 1.5; }
	.actions { display: flex; justify-content: flex-end; gap: 0.5rem; }
	.btn { padding: 0.4rem 1rem; border-radius: 6px; border: 1px solid #d1d5db; cursor: pointer; font-size: 0.85rem; font-weight: 500; background: #fff; }
	.btn-cancel { color: #374151; }
	.btn-cancel:hover { background: #f3f4f6; }
	.btn-danger { background: #dc2626; color: #fff; border-color: #dc2626; }
	.btn-danger:hover { background: #b91c1c; }
	.btn-primary { background: #4f46e5; color: #fff; border-color: #4f46e5; }
	.btn-primary:hover { background: #4338ca; }
</style>
