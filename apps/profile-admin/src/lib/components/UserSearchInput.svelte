<script lang="ts">
	import { fingerprint } from '$lib/fingerprint';
	import { get } from 'svelte/store';

	interface User {
		id: string;
		email: string;
		username?: string;
	}

	let {
		value = $bindable(''),
		label = 'User',
		required = false
	}: {
		value?: string;
		label?: string;
		required?: boolean;
	} = $props();

	let query = $state('');
	let results: User[] = $state([]);
	let selectedUser: User | null = $state(null);
	let loading = $state(false);
	let open = $state(false);
	let timer: ReturnType<typeof setTimeout> | null = null;

	// When value is pre-populated (edit mode), show the id as display text
	$effect(() => {
		if (value && !selectedUser) {
			query = value;
		}
	});

	async function search(q: string) {
		if (!q.trim()) {
			results = [];
			open = false;
			return;
		}
		loading = true;
		const params = new URLSearchParams({ email: `li|${q.trim()}`, page_size: '10', page: '1' });
		const res = await fetch(`/api/users?${params}`, {
			headers: { 'X-Client-Fingerprint': get(fingerprint) }
		});
		const json = await res.json();
		results = json?.data?.result ?? json?.result ?? [];
		open = results.length > 0;
		loading = false;
	}

	function onInput(e: Event) {
		query = (e.target as HTMLInputElement).value;
		// Clear selection if user is editing the query
		if (selectedUser && query !== selectedUser.email) {
			selectedUser = null;
			value = '';
		}
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => search(query), 300);
	}

	function select(user: User) {
		selectedUser = user;
		value = user.id;
		query = user.email;
		open = false;
		results = [];
	}

	function onBlur() {
		// Delay close so clicks on dropdown items register first
		setTimeout(() => { open = false; }, 150);
	}

	function clear() {
		query = '';
		value = '';
		selectedUser = null;
		results = [];
		open = false;
	}
</script>

<div class="user-search">
	<label class="field-label" for="user-search-input">
		{label}{#if required}<span class="required">*</span>{/if}
	</label>
	<div class="input-wrap">
		<input
			id="user-search-input"
			type="text"
			class="search-input"
			placeholder="Search by email…"
			autocomplete="off"
			value={query}
			oninput={onInput}
			onblur={onBlur}
			onfocus={() => { if (results.length) open = true; }}
		/>
		{#if loading}
			<span class="spinner">⟳</span>
		{:else if selectedUser}
			<span class="check">✓</span>
		{/if}
		{#if query}
			<button type="button" class="btn-clear" onclick={clear} title="Clear">✕</button>
		{/if}
	</div>

	{#if open && results.length > 0}
		<ul class="dropdown" role="listbox">
			{#each results as user (user.id)}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<li
					class="dropdown-item"
					role="option"
					aria-selected={user.id === value}
					onmousedown={() => select(user)}
				>
					<span class="user-email">{user.email}</span>
					{#if user.username}
						<span class="user-name">{user.username}</span>
					{/if}
					<span class="user-id">{user.id}</span>
				</li>
			{/each}
		</ul>
	{/if}

	<!-- Hidden input carries the actual user_id value for form submission -->
	{#if value}
		<p class="selected-hint">Selected ID: <code>{value}</code></p>
	{/if}
</div>

<style>
	.user-search { position: relative; display: flex; flex-direction: column; gap: 0.25rem; }
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
	/* shift clear button when check/spinner is also showing */
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
	.user-email { font-size: 0.9rem; font-weight: 500; color: #111; }
	.user-name { font-size: 0.78rem; color: #6b7280; }
	.user-id { font-size: 0.72rem; color: #9ca3af; font-family: monospace; }

	.selected-hint { font-size: 0.75rem; color: #6b7280; margin: 0; }
	.selected-hint code { font-family: monospace; color: #4f46e5; }
</style>
