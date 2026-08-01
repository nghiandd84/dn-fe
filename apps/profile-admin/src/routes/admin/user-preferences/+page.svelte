<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import ProfileSearchInput from '$lib/components/ProfileSearchInput.svelte';
	import { LANGUAGE_OPTIONS } from '@dn-fe/ui';
	import { LL } from '$i18n/i18n-util';

	function boolFormat(v: any): string {
		if (v === true || v === 'true') return '<span style="color:#15803d;font-weight:600">✓</span>';
		if (v === false || v === 'false') return '<span style="color:#b91c1c;font-weight:600">✗</span>';
		return '—';
	}

	// Profile filter for the table
	let profileIdFilter = $state('');
	let languageFilter = $state('');
	let themeFilter = $state('');

	const extraParams = $derived({
		...(profileIdFilter ? { profile_id: `eq|${profileIdFilter}` } : {}),
		...(languageFilter ? { language: `eq|${languageFilter}` } : {}),
		...(themeFilter ? { theme: `eq|${themeFilter}` } : {})
	});

	// Toggle state for the form
	let notificationsEnabled = $state(false);
</script>

<h1>{$LL.user_preferences_page.title()}</h1>

<div class="filter-bar">
	<div class="filter-item">
		<span class="filter-label">Profile</span>
		<div class="profile-filter-input">
			<ProfileSearchInput
				label=""
				bind:value={
					() => profileIdFilter,
					(v) => (profileIdFilter = v)
				}
			/>
		</div>
	</div>
	<div class="filter-item">
		<span class="filter-label">{$LL.user_preferences_page.col_language()}</span>
		<select class="filter-select" bind:value={languageFilter}>
			<option value="">All</option>
			{#each LANGUAGE_OPTIONS as opt}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</select>
	</div>
	<div class="filter-item">
		<span class="filter-label">{$LL.user_preferences_page.col_theme()}</span>
		<select class="filter-select" bind:value={themeFilter}>
			<option value="">All</option>
			<option value="light">Light</option>
			<option value="dark">Dark</option>
			<option value="system">System</option>
		</select>
	</div>
</div>

<CrudTable
	resource="user-preferences"
	apiPrefix="/api/profile"
	{extraParams}
	columns={[
		{ key: 'id', label: $LL.user_preferences_page.col_id(), hideInTable: true },
		{ key: 'profile_id', label: $LL.user_preferences_page.col_profile_id(), hideInTable: true },
		{ key: 'profile_name', label: 'Profile', format: (v) => v ?? '—' },
		{ key: 'language', label: $LL.user_preferences_page.col_language(), sortable: true },
		{ key: 'theme', label: $LL.user_preferences_page.col_theme(), sortable: true },
		{ key: 'notifications_enabled', label: $LL.user_preferences_page.col_notifications_enabled(), format: boolFormat },
	]}
	formFields={[]}
	actions={{ create: true, edit: true, delete: true, detail: true }}
	onEdit={(item) => { notificationsEnabled = item.notifications_enabled ?? false; }}
	onCreateOpen={() => { notificationsEnabled = false; }}
>
	{#snippet editSnippet(editingItem, formData)}
		<!-- Profile ID: search on create, readonly on edit -->
		{#if editingItem}
			<div class="form-group">
				<label class="field-label">{$LL.user_preferences_page.col_profile_id()}</label>
				<input type="text" class="readonly-input" value={editingItem.profile_name ?? formData.profile_id ?? ''} readonly />
			</div>
		{:else}
			<div class="form-group">
				<ProfileSearchInput
					label={$LL.user_preferences_page.col_profile_id()}
					required
					bind:value={
						() => formData.profile_id ?? '',
						(v) => (formData.profile_id = v)
					}
				/>
			</div>
		{/if}
		<div class="form-group">
			<label class="field-label" for="up-language">{$LL.user_preferences_page.col_language()} <span class="required">*</span></label>
			<select id="up-language" required bind:value={formData.language}>
				<option value="">-- Select --</option>
				{#each LANGUAGE_OPTIONS as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</div>
		<div class="form-group">
			<label class="field-label" for="up-theme">{$LL.user_preferences_page.col_theme()} <span class="required">*</span></label>
			<select id="up-theme" bind:value={formData.theme} required>
				<option value="">-- Select --</option>
				{#each ['light', 'dark', 'system'] as opt}
					<option value={opt}>{opt}</option>
				{/each}
			</select>
		</div>
		<div class="form-group form-group-checkbox">
			<label class="field-label" for="up-notifications">{$LL.user_preferences_page.col_notifications_enabled()}</label>
			<label class="toggle">
				<input
					id="up-notifications"
					type="checkbox"
					bind:checked={notificationsEnabled}
					onchange={() => { formData.notifications_enabled = notificationsEnabled; }}
				/>
				<span class="toggle-options">
					<span class="toggle-opt toggle-opt-no">No</span>
					<span class="toggle-opt toggle-opt-yes">Yes</span>
				</span>
			</label>
		</div>
	{/snippet}

	{#snippet detailSnippet(item)}
		<div class="user-preference-detail">
			<div class="meta-row"><span class="meta-label">ID</span><span class="mono">{item.id}</span></div>
			<div class="meta-row"><span class="meta-label">Profile</span><span>{item.profile_name ?? '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.user_preferences_page.col_profile_id()}</span><span class="mono">{item.profile_id}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.user_preferences_page.col_language()}</span><span class="lang-badge">{item.language}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.user_preferences_page.col_theme()}</span><span class="theme-badge">{item.theme}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.user_preferences_page.col_notifications_enabled()}</span><span>{item.notifications_enabled ? '✓ Enabled' : '✗ Disabled'}</span></div>
			<div class="meta-row"><span class="meta-label">Created</span><span class="mono">{item.created_at ?? '—'}</span></div>
			<div class="meta-row"><span class="meta-label">Updated</span><span class="mono">{item.updated_at ?? '—'}</span></div>
		</div>
	{/snippet}
</CrudTable>

<style>
	:global(.user-preference-detail) {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 340px;
	}
	:global(.lang-badge) {
		background: #f3e8ff;
		color: #5b21b6;
		font-family: monospace;
		font-weight: 600;
		padding: 0.1rem 0.5rem;
		border-radius: 4px;
		border: 1px solid #e9d5ff;
		font-size: 0.82rem;
	}
	:global(.theme-badge) {
		background: #fef3c7;
		color: #854d0e;
		font-family: monospace;
		font-weight: 600;
		padding: 0.1rem 0.5rem;
		border-radius: 4px;
		border: 1px solid #fde68a;
		font-size: 0.82rem;
	}

	.filter-bar {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
		margin-bottom: 0.75rem;
		background: #f8f9fa;
		border: 1px solid #ddd;
		border-radius: 4px;
		padding: 0.35rem 0.6rem;
	}
	.filter-item {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}
	.filter-label { font-size: 0.78rem; color: #555; white-space: nowrap; }
	.filter-select {
		padding: 0.25rem 0.4rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 0.82rem;
		background: #fff;
		cursor: pointer;
	}
	.profile-filter-input { min-width: 220px; }

	.form-group { margin-bottom: 0.8rem; }
	.form-group-checkbox { display: flex; align-items: center; gap: 0.75rem; }
	.form-group-checkbox .field-label { margin-bottom: 0; }
	.field-label { display: block; margin-bottom: 0.3rem; font-weight: 500; font-size: 0.85rem; }
	.required { color: #dc2626; }
	.form-group input[type="text"], .form-group select {
		width: 100%;
		padding: 0.4rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 0.9rem;
		box-sizing: border-box;
	}
	.readonly-input {
		background: #f9fafb;
		color: #6b7280;
		cursor: not-allowed;
		border-color: #e5e7eb;
	}
	/* Toggle switch */
	.toggle { display: inline-flex; align-items: center; gap: 0.6rem; cursor: pointer; user-select: none; }
	.toggle input { position: absolute; opacity: 0; width: 0; height: 0; }
	.toggle-options { display: inline-flex; border: 1px solid #d1d5db; border-radius: 6px; overflow: hidden; font-size: 0.82rem; font-weight: 600; }
	.toggle-opt { padding: 0.2rem 0.65rem; color: #9ca3af; background: #f9fafb; transition: background 0.15s, color 0.15s; }
	.toggle input:not(:checked) ~ .toggle-options .toggle-opt-no  { background: #4f46e5; color: #fff; }
	.toggle input:checked       ~ .toggle-options .toggle-opt-yes { background: #4f46e5; color: #fff; }
</style>
