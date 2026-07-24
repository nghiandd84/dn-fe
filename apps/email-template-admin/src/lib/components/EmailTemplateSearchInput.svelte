<script lang="ts">
	import { fingerprint } from '$lib/fingerprint';
	import { get } from 'svelte/store';

	interface EmailTemplate {
		id: number;
		name: string;
		key?: string;
	}

	let {
		value = $bindable<number | null>(null),
		label = 'Email Template',
		required = false
	}: {
		value?: number | null;
		label?: string;
		required?: boolean;
	} = $props();

	let query = $state('');
	let results: EmailTemplate[] = $state([]);
	let selectedTemplate: EmailTemplate | null = $state(null);
	let loading = $state(false);
	let open = $state(false);
	let timer: ReturnType<typeof setTimeout> | null = null;

	// When value is pre-populated (edit mode), load display name
	$effect(() => {
		if (value && !selectedTemplate) {
			fetchById(value);
		}
		if (!value) {
			selectedTemplate = null;
			query = '';
		}
	});

	async function fetchById(id: number) {
		try {
			const res = await fetch(`/api/email-template/email-templates/${id}`, {
				headers: { 'X-Client-Fingerprint': get(fingerprint) }
			});
			const json = await res.json();
			const t = json?.data;
			if (t?.id) {
				selectedTemplate = t;
				query = t.name;
			}
		} catch {
			// non-fatal — id will still show in hint
		}
	}

	async function search(q: string) {
		if (!q.trim()) {
			results = [];
			open = false;
			return;
		}
		loading = true;
		const params = new URLSearchParams({ name: `li|${q.trim()}`, page_size: '10', page: '1' });
		const res = await fetch(`/api/email-template/email-templates?${params}`, {
			headers: { 'X-Client-Fingerprint': get(fingerprint) }
		});
		const json = await res.json();
		results = json?.data?.result ?? json?.result ?? [];
		open = results.length > 0;
		loading = false;
	}

	function onInput(e: Event) {
		query = (e.target as HTMLInputElement).value;
		if (selectedTemplate && query !== selectedTemplate.name) {
			selectedTemplate = null;
			value = null;
		}
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => search(query), 300);
	}

	function select(t: EmailTemplate) {
		selectedTemplate = t;
		value = t.id;
		query = t.name;
		open = false;
		results = [];
	}

	function onBlur() {
		setTimeout(() => { open = false; }, 150);
	}

	function clear() {
		query = '';
		value = null;
		selectedTemplate = null;
		results = [];
		open = false;
	}
</script>

<div class="template-search">
	<label class="field-label" for="template-search-input">
		{label}{#if required}<span class="required">*</span>{/if}
	</label>
	<div class="input-wrap">
		<input
			id="template-search-input"
			type="text"
			class="search-input"
			placeholder="Search by name…"
			autocomplete="off"
			value={query}
			oninput={onInput}
			onblur={onBlur}
			onfocus={() => { if (results.length) open = true; }}
		/>
		{#if loading}
			<span class="spinner">⟳</span>
		{:else if selectedTemplate}
			<span class="check">✓</span>
		{/if}
		{#if query}
			<button type="button" class="btn-clear" onclick={clear} title="Clear">✕</button>
		{/if}
	</div>

	{#if open && results.length > 0}
		<ul class="dropdown" role="listbox">
			{#each results as t (t.id)}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<li
					class="dropdown-item"
					role="option"
					aria-selected={t.id === value}
					onmousedown={() => select(t)}
				>
					<span class="template-name">{t.name}</span>
					{#if t.key}
						<span class="template-key">{t.key}</span>
					{/if}
					<span class="template-id">ID: {t.id}</span>
				</li>
			{/each}
		</ul>
	{/if}

	{#if value}
		<p class="selected-hint">Selected ID: <code>{value}</code></p>
	{/if}
</div>

<style>
	.template-search { position: relative; display: flex; flex-direction: column; gap: 0.25rem; }
	.field-label { font-weight: 500; font-size: 0.85rem; }
	.required { color: #dc2626; margin-left: 0.1rem; }
	.input-wrap { position: relative; display: flex; align-items: center; }
	.search-input {
		width: 100%;
		padding: 0.4rem 3.5rem 0.4rem 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		font-size: 0.9rem;
		outline: none;
		box-sizing: border-box;
	}
	.search-input:focus { border-color: #4f46e5; box-shadow: 0 0 0 2px #e0e7ff; }
	.spinner {
		position: absolute; right: 0.5rem;
		font-size: 0.9rem; color: #9ca3af;
		animation: spin 0.8s linear infinite;
	}
	.check { position: absolute; right: 0.5rem; font-size: 0.9rem; color: #16a34a; }
	.btn-clear {
		position: absolute; right: 0.5rem;
		background: none; border: none; cursor: pointer;
		font-size: 0.75rem; color: #9ca3af; padding: 0;
		line-height: 1;
	}
	.btn-clear:hover { color: #dc2626; }
	.check ~ .btn-clear, .spinner ~ .btn-clear { right: 1.6rem; }
	@keyframes spin { to { transform: rotate(360deg); } }

	.dropdown {
		position: absolute;
		top: calc(100% + 2px);
		left: 0; right: 0;
		background: #fff;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		box-shadow: 0 4px 12px rgba(0,0,0,0.1);
		list-style: none;
		margin: 0; padding: 0.25rem 0;
		z-index: 200;
		max-height: 220px;
		overflow-y: auto;
	}
	.dropdown-item {
		display: flex;
		flex-direction: column;
		padding: 0.45rem 0.75rem;
		cursor: pointer;
		gap: 0.1rem;
	}
	.dropdown-item:hover, .dropdown-item[aria-selected="true"] { background: #eef2ff; }
	.template-name { font-size: 0.9rem; font-weight: 500; color: #111; }
	.template-key { font-size: 0.78rem; color: #6b7280; font-family: monospace; }
	.template-id { font-size: 0.72rem; color: #9ca3af; font-family: monospace; }

	.selected-hint { font-size: 0.75rem; color: #6b7280; margin: 0; }
	.selected-hint code { font-family: monospace; color: #4f46e5; }
</style>
