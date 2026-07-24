<script lang="ts">
	import { fingerprint } from '$lib/fingerprint';
	import { get } from 'svelte/store';

	interface Profile {
		id: string;
		first_name: string;
		last_name: string;
		user_email?: string;
	}

	let {
		value = $bindable(''),
		label = 'Profile',
		required = false
	}: {
		value?: string;
		label?: string;
		required?: boolean;
	} = $props();

	let query = $state('');
	let results: Profile[] = $state([]);
	let selectedProfile: Profile | null = $state(null);
	let loading = $state(false);
	let open = $state(false);
	let timer: ReturnType<typeof setTimeout> | null = null;

	// Pre-populate query in edit mode when value is already set
	$effect(() => {
		if (value && !selectedProfile) {
			query = value;
		}
	});

	async function search(q: string) {
		if (!q.trim()) { results = []; open = false; return; }
		loading = true;
		const params = new URLSearchParams({
			_condition: 'or',
			first_name: `li|${q.trim()}`,
			last_name: `li|${q.trim()}`,
			page_size: '10',
			page: '1'
		});
		const res = await fetch(`/api/profile/profiles?${params}`, {
			headers: { 'X-Client-Fingerprint': get(fingerprint) }
		});
		const json = await res.json();
		results = json?.data?.result ?? json?.result ?? [];
		open = results.length > 0;
		loading = false;
	}

	function onInput(e: Event) {
		query = (e.target as HTMLInputElement).value;
		if (selectedProfile && query !== `${selectedProfile.first_name} ${selectedProfile.last_name}`) {
			selectedProfile = null;
			value = '';
		}
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => search(query), 300);
	}

	function select(profile: Profile) {
		selectedProfile = profile;
		value = profile.id;
		query = `${profile.first_name} ${profile.last_name}`;
		open = false;
		results = [];
	}

	function clear() {
		query = '';
		value = '';
		selectedProfile = null;
		results = [];
		open = false;
	}

	function onBlur() {
		setTimeout(() => { open = false; }, 150);
	}
</script>

<div class="profile-search">
	<label class="field-label" for="profile-search-input">
		{label}{#if required}<span class="required">*</span>{/if}
	</label>
	<div class="input-wrap">
		<input
			id="profile-search-input"
			type="text"
			class="search-input"
			placeholder="Search by first or last name…"
			autocomplete="off"
			value={query}
			oninput={onInput}
			onblur={onBlur}
			onfocus={() => { if (results.length) open = true; }}
		/>
		{#if loading}
			<span class="spinner">⟳</span>
		{:else if selectedProfile}
			<span class="check">✓</span>
		{/if}
		{#if query}
			<button type="button" class="btn-clear" onclick={clear} title="Clear">✕</button>
		{/if}
	</div>

	{#if open && results.length > 0}
		<ul class="dropdown" role="listbox">
			{#each results as profile (profile.id)}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<li
					class="dropdown-item"
					role="option"
					aria-selected={profile.id === value}
					onmousedown={() => select(profile)}
				>
					<span class="profile-name">{profile.first_name} {profile.last_name}</span>
					{#if profile.user_email}
						<span class="profile-email">{profile.user_email}</span>
					{/if}
					<span class="profile-id">{profile.id}</span>
				</li>
			{/each}
		</ul>
	{/if}

	{#if value}
		<p class="selected-hint">Selected ID: <code>{value}</code></p>
	{/if}
</div>

<style>
	.profile-search { position: relative; display: flex; flex-direction: column; gap: 0.25rem; }
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
		position: absolute; right: 1.6rem;
		font-size: 0.9rem; color: #9ca3af;
		animation: spin 0.8s linear infinite;
	}
	.check { position: absolute; right: 1.6rem; font-size: 0.9rem; color: #16a34a; }
	.btn-clear {
		position: absolute; right: 0.5rem;
		background: none; border: none; cursor: pointer;
		font-size: 0.75rem; color: #9ca3af; padding: 0; line-height: 1;
	}
	.btn-clear:hover { color: #dc2626; }
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
	.profile-name { font-size: 0.9rem; font-weight: 500; color: #111; }
	.profile-email { font-size: 0.78rem; color: #6b7280; }
	.profile-id { font-size: 0.72rem; color: #9ca3af; font-family: monospace; }

	.selected-hint { font-size: 0.75rem; color: #6b7280; margin: 0; }
	.selected-hint code { font-family: monospace; color: #4f46e5; }
</style>
