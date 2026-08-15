<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import UserSearchInput from '$lib/components/UserSearchInput.svelte';
	import { maskToCrudActions } from '@dn-fe/ui/types';
	import { LL } from '$i18n/i18n-util';

	let { data } = $props();
	const actions = $derived(maskToCrudActions((data as any).authMasks?.['profiles'] ?? 0));

	function truncateBio(bio: string): string {
		if (!bio) return '—';
		return bio.length > 60 ? bio.substring(0, 60) + '…' : bio;
	}

	// Drives the user_id filter passed to CrudTable via extraParams
	let userIdFilter = $state('');

	const extraParams = $derived(
		userIdFilter ? { user_id: `eq|${userIdFilter}` } : {}
	);
</script>

<h1>{$LL.profiles_page.title()}</h1>

<div class="user-filter-bar">
	<span class="filter-label">{$LL.profiles_page.col_user_id()}</span>
	<div class="user-filter-input">
		<UserSearchInput
			label=""
			bind:value={
				() => userIdFilter,
				(v) => (userIdFilter = v)
			}
		/>
	</div>
</div>

<CrudTable
	resource="profiles"
	apiPrefix="/api/profile"
	{extraParams}
	columns={[
		{ key: 'id', label: $LL.profiles_page.col_id(), sortable: true, hideInTable: true },
		{ key: 'user_id', label: $LL.profiles_page.col_user_id(), sortable: true, hideInTable: true },
		{ key: 'user_email', label: 'User Email', format: (v) => v ?? '—' },
		{ key: 'first_name', label: $LL.profiles_page.col_first_name(), sortable: true, filterable: true, operators: ['eq', 'li', 'sw'] },
		{ key: 'last_name', label: $LL.profiles_page.col_last_name(), sortable: true, filterable: true, operators: ['eq', 'li', 'sw'] },
		{ key: 'bio', label: $LL.profiles_page.col_bio(), format: truncateBio },
		{ key: 'location', label: $LL.profiles_page.col_location(), sortable: true, filterable: true, operators: ['eq', 'li'] },
	]}
	formFields={[]}
	{actions}
>
	{#snippet editSnippet(editingItem, formData)}
		<!-- User ID first -->
		{#if editingItem}
			<div class="form-group">
				<label class="field-label">{$LL.profiles_page.col_user_id()}</label>
				<input type="text" class="readonly-input" value={formData.user_id ?? ''} readonly />
			</div>
			{#if editingItem.user_email}
				<div class="form-group">
					<label class="field-label">User Email</label>
					<input type="text" class="readonly-input" value={editingItem.user_email} readonly />
				</div>
			{/if}
		{:else}
			<div class="form-group">
				<UserSearchInput
					label={$LL.profiles_page.col_user_id()}
					required
					bind:value={
						() => formData.user_id ?? '',
						(v) => (formData.user_id = v)
					}
				/>
			</div>
		{/if}
		<div class="form-group">
			<label class="field-label" for="field-first_name">{$LL.profiles_page.col_first_name()} <span class="required">*</span></label>
			<input id="field-first_name" type="text" required bind:value={formData.first_name} />
		</div>
		<div class="form-group">
			<label class="field-label" for="field-last_name">{$LL.profiles_page.col_last_name()} <span class="required">*</span></label>
			<input id="field-last_name" type="text" required bind:value={formData.last_name} />
		</div>
		<div class="form-group">
			<label class="field-label" for="field-bio">{$LL.profiles_page.col_bio()}</label>
			<input id="field-bio" type="text" bind:value={formData.bio} />
		</div>
		<div class="form-group">
			<label class="field-label" for="field-avatar_url">{$LL.profiles_page.col_avatar_url()}</label>
			<input id="field-avatar_url" type="text" bind:value={formData.avatar_url} />
		</div>
		<div class="form-group">
			<label class="field-label" for="field-location">{$LL.profiles_page.col_location()}</label>
			<input id="field-location" type="text" bind:value={formData.location} />
		</div>
	{/snippet}

	{#snippet detailSnippet(item)}
		<div class="profile-detail">
			<div class="meta-row"><span class="meta-label">ID</span><span class="mono">{item.id}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.profiles_page.col_user_id()}</span><span class="mono">{item.user_id}</span></div>
			{#if item.user_email}
				<div class="meta-row"><span class="meta-label">User Email</span><span>{item.user_email}</span></div>
			{/if}
			<div class="meta-row"><span class="meta-label">{$LL.profiles_page.col_first_name()}</span><span>{item.first_name}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.profiles_page.col_last_name()}</span><span>{item.last_name}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.profiles_page.col_location()}</span><span>{item.location || '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.profiles_page.col_bio()}</span><span>{item.bio || '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.profiles_page.col_avatar_url()}</span><span class="mono">{item.avatar_url || '—'}</span></div>
			<div class="meta-row"><span class="meta-label">Created</span><span class="mono">{item.created_at ?? '—'}</span></div>
			<div class="meta-row"><span class="meta-label">Updated</span><span class="mono">{item.updated_at ?? '—'}</span></div>
		</div>
	{/snippet}
</CrudTable>

<style>
	:global(.profile-detail) {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 340px;
	}

	.user-filter-bar {
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
	.user-filter-bar .filter-label {
		font-size: 0.78rem;
		color: #555;
		white-space: nowrap;
	}
	.user-filter-input {
		min-width: 260px;
	}

	.form-group {
		margin-bottom: 0.8rem;
	}
	.field-label {
		display: block;
		margin-bottom: 0.3rem;
		font-weight: 500;
		font-size: 0.85rem;
	}
	.required { color: #dc2626; }
	.form-group input {
		width: 100%;
		padding: 0.4rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 0.9rem;
		box-sizing: border-box;
	}
	.readonly-input {
		width: 100%;
		padding: 0.4rem;
		border: 1px solid #e5e7eb;
		border-radius: 4px;
		background: #f9fafb;
		color: #6b7280;
		font-size: 0.9rem;
		cursor: not-allowed;
	}
</style>
