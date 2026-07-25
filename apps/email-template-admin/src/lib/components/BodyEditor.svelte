<script lang="ts">
	import { onDestroy } from 'svelte';
	import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
	import { EditorState } from '@codemirror/state';
	import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
	import { html } from '@codemirror/lang-html';
	import { oneDark } from '@codemirror/theme-one-dark';
	import { bracketMatching, foldGutter, foldKeymap } from '@codemirror/language';
	import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
	import { fingerprint } from '$lib/fingerprint';
	import { get } from 'svelte/store';

	interface Placeholder {
		id: number;
		placeholder_key: string;
		description?: string;
		is_required?: boolean;
	}

	let {
		value = $bindable(''),
		templateId = null as number | null,
		required = false
	}: {
		value?: string;
		templateId?: number | null;
		required?: boolean;
	} = $props();

	// Coerce undefined to empty string
	$effect(() => {
		if ((value as any) === undefined) value = '';
	});

	// ── Mode: code editor vs HTML preview ───────────────────────────────────
	let mode = $state<'code' | 'preview'>('code');

	// ── CodeMirror setup ────────────────────────────────────────────────────
	let editorContainer: HTMLDivElement | null = $state(null);
	let editorView: EditorView | null = null;
	let isUpdatingFromProp = false;

	function createEditor(container: HTMLDivElement, initialValue: string) {
		const updateListener = EditorView.updateListener.of((update) => {
			if (update.docChanged && !isUpdatingFromProp) {
				value = update.state.doc.toString();
			}
		});

		const state = EditorState.create({
			doc: initialValue,
			extensions: [
				lineNumbers(),
				highlightActiveLine(),
				history(),
				foldGutter(),
				bracketMatching(),
				autocompletion(),
				html(),
				oneDark,
				keymap.of([
					indentWithTab,
					...defaultKeymap,
					...historyKeymap,
					...foldKeymap,
					...completionKeymap,
				]),
				updateListener,
				EditorView.theme({
					'&': { borderRadius: '0 4px 4px 4px', overflow: 'hidden' },
					'.cm-scroller': { minHeight: '220px', maxHeight: '480px', overflow: 'auto', fontFamily: "'Fira Code', 'Courier New', monospace", fontSize: '0.85rem' },
				}),
			],
		});

		editorView = new EditorView({ state, parent: container });
	}

	// Mount/destroy the editor when the container div appears (code mode)
	$effect(() => {
		if (mode === 'code' && editorContainer && !editorView) {
			createEditor(editorContainer, value ?? '');
		}
		if (mode !== 'code' && editorView) {
			editorView.destroy();
			editorView = null;
		}
	});

	// Keep editor in sync when value changes externally (e.g. parent resets form)
	$effect(() => {
		if (!editorView) return;
		const current = editorView.state.doc.toString();
		if (current !== value) {
			isUpdatingFromProp = true;
			editorView.dispatch({
				changes: { from: 0, to: current.length, insert: value ?? '' }
			});
			isUpdatingFromProp = false;
		}
	});

	onDestroy(() => {
		editorView?.destroy();
		editorView = null;
	});

	// ── Insert placeholder at cursor ─────────────────────────────────────────
	function insertPlaceholder(key: string) {
		const token = `{{${key}}}`;
		if (editorView) {
			const { from, to } = editorView.state.selection.main;
			editorView.dispatch({
				changes: { from, to, insert: token },
				selection: { anchor: from + token.length }
			});
			editorView.focus();
		} else {
			value = (value ?? '') + token;
		}
	}

	// ── Placeholders ─────────────────────────────────────────────────────────
	let placeholders = $state<Placeholder[]>([]);
	let placeholdersLoading = $state(false);
	let lastFetchedTemplateId = $state<number | null>(null);

	$effect(() => {
		if (templateId && templateId !== lastFetchedTemplateId) {
			fetchPlaceholders(templateId);
		}
		if (!templateId) {
			placeholders = [];
			lastFetchedTemplateId = null;
		}
	});

	async function fetchPlaceholders(id: number) {
		placeholdersLoading = true;
		lastFetchedTemplateId = id;
		try {
			const params = new URLSearchParams({
				template_id: `eq|${id}`,
				page_size: '20',
				page: '1'
			});
			const res = await fetch(`/api/email-template/template-placeholders?${params}`, {
				headers: { 'X-Client-Fingerprint': get(fingerprint) }
			});
			const json = await res.json();
			placeholders = json?.data?.result ?? [];
		} catch {
			placeholders = [];
		} finally {
			placeholdersLoading = false;
		}
	}
</script>

<div class="body-editor">
	<!-- Mode tabs -->
	<div class="editor-tabs">
		<button
			type="button"
			class="tab-btn"
			class:active={mode === 'code'}
			onclick={() => (mode = 'code')}
		>&#60;/&#62; HTML</button>
		<button
			type="button"
			class="tab-btn"
			class:active={mode === 'preview'}
			onclick={() => (mode = 'preview')}
		>👁 Preview</button>
	</div>

	<!-- Placeholder chips -->
	{#if templateId}
		<div class="placeholder-bar">
			<span class="placeholder-bar-label">
				{#if placeholdersLoading}
					Loading placeholders…
				{:else if placeholders.length === 0}
					No placeholders for this template
				{:else}
					Insert placeholder:
				{/if}
			</span>
			{#each placeholders as ph (ph.id)}
				<button
					type="button"
					class="chip"
					class:chip-required={ph.is_required}
					title={ph.description || ph.placeholder_key}
					onclick={() => insertPlaceholder(ph.placeholder_key)}
				>
					{'{{'}{ph.placeholder_key}{'}}'}
				</button>
			{/each}
		</div>
	{:else}
		<div class="placeholder-hint">Select a template above to see available placeholders.</div>
	{/if}

	<!-- CodeMirror editor -->
	{#if mode === 'code'}
		<div class="cm-wrapper" bind:this={editorContainer}></div>
		<!-- Hidden input to satisfy browser `required` validation -->
		{#if required}
			<input type="text" tabindex="-1" aria-hidden="true" class="required-guard" value={value ?? ''} {required} />
		{/if}
	{:else}
		<div class="body-preview">
			{#if value?.trim()}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html value}
			{:else}
				<span class="preview-empty">Nothing to preview.</span>
			{/if}
		</div>
	{/if}
</div>

<style>
	.body-editor {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	/* Tabs */
	.editor-tabs {
		display: flex;
		gap: 0.25rem;
	}
	.tab-btn {
		padding: 0.25rem 0.7rem;
		font-size: 0.8rem;
		border: 1px solid #d1d5db;
		border-radius: 4px 4px 0 0;
		background: #f9fafb;
		cursor: pointer;
		color: #6b7280;
	}
	.tab-btn.active {
		background: #282c34;
		border-bottom-color: #282c34;
		color: #abb2bf;
		font-weight: 600;
	}

	/* Placeholder bar */
	.placeholder-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.35rem;
		padding: 0.4rem 0.5rem;
		background: #f0f4ff;
		border: 1px solid #c7d2fe;
		border-radius: 4px;
		font-size: 0.8rem;
	}
	.placeholder-bar-label {
		color: #6b7280;
		font-size: 0.75rem;
		white-space: nowrap;
	}
	.placeholder-hint {
		font-size: 0.75rem;
		color: #9ca3af;
		padding: 0.3rem 0;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		padding: 0.15rem 0.5rem;
		background: #e0e7ff;
		border: 1px solid #a5b4fc;
		border-radius: 99px;
		font-size: 0.75rem;
		font-family: monospace;
		color: #3730a3;
		cursor: pointer;
		transition: background 0.12s;
		white-space: nowrap;
	}
	.chip:hover { background: #c7d2fe; }
	.chip-required {
		background: #fef3c7;
		border-color: #fbbf24;
		color: #92400e;
	}
	.chip-required:hover { background: #fde68a; }

	/* CodeMirror wrapper */
	.cm-wrapper {
		border-radius: 0 4px 4px 4px;
		overflow: hidden;
		border: 1px solid #3e4451;
	}

	/* Hidden required guard */
	.required-guard {
		position: absolute;
		width: 0;
		height: 0;
		opacity: 0;
		pointer-events: none;
	}

	/* Preview */
	.body-preview {
		min-height: 180px;
		max-height: 400px;
		overflow-y: auto;
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0 4px 4px 4px;
		background: #fff;
		font-size: 0.875rem;
		line-height: 1.6;
	}
	.preview-empty {
		color: #9ca3af;
		font-style: italic;
	}
</style>
