<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import ProfileSearchInput from '$lib/components/ProfileSearchInput.svelte';
	import { maskToCrudActions } from '@dn-fe/ui/types';
	import { LL } from '$i18n/i18n-util';

	let { data } = $props();
	const actions = $derived(maskToCrudActions((data as any).authMasks?.['social-links'] ?? 0));

	// Profile filter for the table
	let profileIdFilter = $state('');
	const extraParams = $derived(
		profileIdFilter ? { profile_id: `eq|${profileIdFilter}` } : {}
	);
</script>

<h1>{$LL.social_links_page.title()}</h1>

<div class="profile-filter-bar">
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

<CrudTable
	resource="social-links"
	apiPrefix="/api/profile"
	{extraParams}
	columns={[
		{ key: 'id', label: $LL.social_links_page.col_id(), hideInTable: true },
		{ key: 'profile_id', label: $LL.social_links_page.col_profile_id(), hideInTable: true },
		{ key: 'profile_name', label: 'Profile', format: (v) => v ?? '—' },
		{ key: 'platform', label: $LL.social_links_page.col_platform(), sortable: true, filterable: true, operators: ['eq'] },
		{ key: 'url', label: $LL.social_links_page.col_url(), sortable: true },
	]}
	formFields={[]}
	{actions}
>
	{#snippet editSnippet(editingItem, formData)}
		<!-- Profile ID: search on create, readonly on edit -->
		{#if editingItem}
			<div class="form-group">
				<label class="field-label">{$LL.social_links_page.col_profile_id()}</label>
				<input type="text" class="readonly-input" value={editingItem.profile_name ?? formData.profile_id ?? ''} readonly />
			</div>
		{:else}
			<div class="form-group">
				<ProfileSearchInput
					label={$LL.social_links_page.col_profile_id()}
					required
					bind:value={
						() => formData.profile_id ?? '',
						(v) => (formData.profile_id = v)
					}
				/>
			</div>
		{/if}
		<div class="form-group">
			<label class="field-label" for="sl-platform">{$LL.social_links_page.col_platform()} <span class="required">*</span></label>
			<select id="sl-platform" bind:value={formData.platform} required>
				<option value="">-- Select --</option>
				{#each ['github', 'twitter/x', 'linkedin', 'facebook', 'instagram', 'youtube', 'website'] as opt}
					<option value={opt}>{opt}</option>
				{/each}
			</select>
		</div>
		<div class="form-group">
			<label class="field-label" for="sl-url">{$LL.social_links_page.col_url()} <span class="required">*</span></label>
			<input id="sl-url" type="text" required bind:value={formData.url} />
		</div>
	{/snippet}

	{#snippet detailSnippet(item)}
		<div class="social-link-detail">
			<div class="meta-row"><span class="meta-label">ID</span><span class="mono">{item.id}</span></div>
			<div class="meta-row"><span class="meta-label">Profile</span><span>{item.profile_name ?? '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.social_links_page.col_profile_id()}</span><span class="mono">{item.profile_id}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.social_links_page.col_platform()}</span><span class="platform-badge">{item.platform}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.social_links_page.col_url()}</span><span class="mono">{item.url}</span></div>
			<div class="meta-row"><span class="meta-label">Created</span><span class="mono">{item.created_at ?? '—'}</span></div>
			<div class="meta-row"><span class="meta-label">Updated</span><span class="mono">{item.updated_at ?? '—'}</span></div>
		</div>
	{/snippet}
</CrudTable>

<style>
	:global(.social-link-detail) {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 340px;
	}
	:global(.platform-badge) {
		background: #dbeafe;
		color: #0c4a6e;
		font-family: monospace;
		font-weight: 600;
		padding: 0.1rem 0.5rem;
		border-radius: 4px;
		border: 1px solid #bae6fd;
		font-size: 0.82rem;
	}

	.profile-filter-bar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
		background: #f8f9fa;
		border: 1px solid #ddd;
		border-radius: 4px;
		padding: 0.35rem 0.6rem;
		width: fit-content;
	}
	.profile-filter-bar .filter-label {
		font-size: 0.78rem;
		color: #555;
		white-space: nowrap;
	}
	.profile-filter-input { min-width: 260px; }

	.form-group { margin-bottom: 0.8rem; }
	.field-label { display: block; margin-bottom: 0.3rem; font-weight: 500; font-size: 0.85rem; }
	.required { color: #dc2626; }
	.form-group input, .form-group select {
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
</style>
