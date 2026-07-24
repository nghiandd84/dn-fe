<script lang="ts">
	import { toasts, toast as toastApi } from './toast.js';

	const ICONS: Record<string, string> = {
		success: '✓',
		error: '✕',
		warning: '⚠',
		info: 'ℹ'
	};
</script>

<div class="toaster" aria-live="polite" aria-atomic="false">
	{#each $toasts as t (t.id)}
		<div class="toast toast-{t.type}" role="alert">
			<span class="toast-icon">{ICONS[t.type]}</span>
			<span class="toast-message">{t.message}</span>
			<button class="toast-close" aria-label="Dismiss" onclick={() => toastApi.remove(t.id)}>×</button>
		</div>
	{/each}
</div>

<style>
	.toaster {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-width: 420px;
		width: max-content;
		pointer-events: none;
	}

	.toast {
		display: flex;
		align-items: flex-start;
		gap: 0.6rem;
		padding: 0.65rem 0.9rem;
		border-radius: 8px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.14);
		font-size: 0.875rem;
		line-height: 1.4;
		pointer-events: all;
		animation: toast-in 0.2s ease;
		max-width: 100%;
		word-break: break-word;
	}

	@keyframes toast-in {
		from { opacity: 0; transform: translateX(1.5rem); }
		to   { opacity: 1; transform: translateX(0); }
	}

	.toast-success { background: #f0fdf4; border: 1px solid #86efac; color: #15803d; }
	.toast-error   { background: #fef2f2; border: 1px solid #fca5a5; color: #b91c1c; }
	.toast-warning { background: #fffbeb; border: 1px solid #fcd34d; color: #92400e; }
	.toast-info    { background: #eff6ff; border: 1px solid #93c5fd; color: #1d4ed8; }

	.toast-icon {
		font-size: 1rem;
		flex-shrink: 0;
		font-weight: 700;
		line-height: 1.4;
	}

	.toast-message { flex: 1; }

	.toast-close {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 1.1rem;
		line-height: 1;
		padding: 0;
		opacity: 0.5;
		flex-shrink: 0;
		color: inherit;
	}
	.toast-close:hover { opacity: 1; }
</style>
