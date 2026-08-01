<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { LL } from '$i18n/i18n-util';
	import { goto } from '$app/navigation';

	const LOCALE_OPTIONS = [
		{ value: 'en', label: 'English (en)' },
		{ value: 'en-US', label: 'English – US (en-US)' },
		{ value: 'en-GB', label: 'English – GB (en-GB)' },
		{ value: 'vi', label: 'Vietnamese (vi)' },
		{ value: 'vi-VN', label: 'Vietnamese – VN (vi-VN)' },
		{ value: 'fr', label: 'French (fr)' },
		{ value: 'de', label: 'German (de)' },
		{ value: 'es', label: 'Spanish (es)' },
		{ value: 'ja', label: 'Japanese (ja)' },
		{ value: 'ko', label: 'Korean (ko)' },
		{ value: 'zh', label: 'Chinese (zh)' },
		{ value: 'zh-CN', label: 'Chinese – Simplified (zh-CN)' },
		{ value: 'zh-TW', label: 'Chinese – Traditional (zh-TW)' }
	];

	function formatDate(v: string | null): string {
		if (!v) return '—';
		try {
			return new Date(v).toLocaleString();
		} catch {
			return v;
		}
	}

	function handleDetail(item: any) {
		goto(`/admin/projects/${item.id}/translation-keys`);
	}
</script>

<h1>{$LL.projects_page.title()}</h1>

<CrudTable
	resource="projects"
	apiPrefix="/api/translation"
	columns={[
		{ key: 'id', label: $LL.projects_page.col_id(), sortable: false, hideInTable: true },
		{
			key: 'name',
			label: $LL.projects_page.col_name(),
			sortable: true,
			filterable: true,
			operators: ['eq', 'li', 'sw']
		},
		{
			key: 'api_key',
			label: $LL.projects_page.col_api_key(),
			sortable: false
		},
		{
			key: 'default_locale',
			label: $LL.projects_page.col_default_locale(),
			sortable: false,
			format: (v) => v ?? 'en'
		},
		{
			key: 'created_at',
			label: $LL.projects_page.col_created_at(),
			sortable: true,
			hideInTable: true,
			format: formatDate
		}
	]}
	formFields={[]}
	actions={{ create: true, edit: true, delete: true, detail: true }}
	onDetail={handleDetail}
>
	{#snippet editSnippet(editingItem, formData)}
		<div class="form-group">
			<label class="field-label" for="field-name">
				{$LL.projects_page.col_name()} <span class="required">*</span>
			</label>
			<input id="field-name" type="text" required bind:value={formData.name} />
		</div>

		<div class="form-group">
			<label class="field-label" for="field-api-key">
				{$LL.projects_page.col_api_key()} <span class="required">*</span>
			</label>
			<input id="field-api-key" type="text" required bind:value={formData.api_key} />
		</div>

		<div class="form-group">
			<label class="field-label" for="field-default-locale">
				{$LL.projects_page.col_default_locale()}
			</label>
			<select id="field-default-locale" bind:value={formData.default_locale}>
				<option value="">-- Select --</option>
				{#each LOCALE_OPTIONS as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</div>
	{/snippet}

	{#snippet detailSnippet(item)}
		<div class="meta-detail">
			<div class="meta-row">
				<span class="meta-label">{$LL.projects_page.col_id()}</span>
				<span class="mono">{item.id}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.projects_page.col_name()}</span>
				<span>{item.name}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.projects_page.col_api_key()}</span>
				<span class="mono">{item.api_key ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.projects_page.col_default_locale()}</span>
				<span>{item.default_locale ?? 'en'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.projects_page.col_created_at()}</span>
				<span>{formatDate(item.created_at)}</span>
			</div>
		</div>
	{/snippet}
</CrudTable>

<style>
	h1 {
		margin-bottom: 1rem;
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
	.required {
		color: #dc2626;
	}
	.form-group input[type='text'] {
		width: 100%;
		padding: 0.4rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 0.9rem;
		box-sizing: border-box;
	}
	.form-group select {
		width: 100%;
		padding: 0.4rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 0.9rem;
		box-sizing: border-box;
	}
	.mono {
		font-family: monospace;
		font-size: 0.85rem;
		word-break: break-all;
	}
</style>
