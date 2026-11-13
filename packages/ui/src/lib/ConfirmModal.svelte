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

<div class="modal-overlay" role="presentation" onclick={oncancel}>
	<!-- svelte-ignore a11y_interactive_supports_focus -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="dialog" role="alertdialog" aria-modal="true" onclick={(e) => e.stopPropagation()}>
		<div class="modal-body">
			<p class="message">{message || $LL.confirm_modal.default_message()}</p>
		</div>
		<div class="modal-actions">
			<button class="btn-cancel" onclick={oncancel}>{cancelLabel || $LL.confirm_modal.cancel()}</button>
			<button class="btn-confirm-danger" class:btn-danger={danger} class:btn-confirm={!danger} onclick={onconfirm}>
				{confirmLabel || $LL.confirm_modal.confirm()}
			</button>
		</div>
	</div>
</div>

<style>
	/* ConfirmModal — unique message + danger button variant */
	.message { margin: 0; font-size: 0.95rem; color: #111; line-height: 1.5; }
	.btn-confirm-danger { padding: 0.4rem 1rem; border-radius: 6px; border: 1px solid #dc2626; cursor: pointer; font-size: 0.85rem; font-weight: 500; background: #dc2626; color: #fff; }
	.btn-confirm-danger:hover { background: #b91c1c; border-color: #b91c1c; }
</style>
