<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { maskToCrudActions } from '@dn-fe/ui/types';
	import { LL } from '$i18n/i18n-util';

	let { data } = $props();
	const actions = $derived(maskToCrudActions((data as any).authMasks?.['translation-versions'] ?? 0));

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

	const STATUS_OPTIONS = [
		{ value: 'draft', label: 'Draft' },
		{ value: 'published', label: 'Published' },
		{ value: 'archived', label: 'Archived' }
	];

	function formatDate(v: string | null): string {
		if (!v) return '—';
		try {
			return new Date(v).toLocaleString();
		} catch {
			return v;
		}
	}
</script>

<h1>{$LL.translation_versions_page.title()}</h1>

<CrudTable
	resource="translation-versions"
	apiPrefix="/api/translation"
	columns={[
		{ key: 'id', label: $LL.translation_versions_page.col_id(), sortable: false, hideInTable: true },
		{
			key: 'key_id',
			label: $LL.translation_versions_page.col_key_id(),
			sortable: false,
			hideInTable: true
		},
		{
			key: 'locale',
			label: $LL.translation_versions_page.col_locale(),
			sortable: true,
			filterable: true,
			operators: ['eq']
		},
		{
			key: 'content',
			label: $LL.translation_versions_page.col_content(),
			sortable: false
		},
		{
			key: 'version_number',
			label: $LL.translation_versions_page.col_version_number(),
			sortable: true,
			format: (v) => (v != null ? String(v) : '—')
		},
		{
			key: 'status',
			label: $LL.translation_versions_page.col_status(),
			sortable: true,
			filterable: true,
			operators: ['eq'],
			format: (v) => v ?? 'draft'
		},
		{
			key: 'created_by',
			label: $LL.translation_versions_page.col_created_by(),
			sortable: false,
			hideInTable: true
		},
		{
			key: 'created_at',
			label: $LL.translation_versions_page.col_created_at(),
			sortable: true,
			hideInTable: true,
			format: formatDate
		}
	]}
	formFields={[]}
	{actions}
>
	{#snippet editSnippet(editingItem, formData)}
		<div class="form-group">
			<label class="field-label" for="field-key-id">
				{$LL.translation_versions_page.col_key_id()} <span class="required">*</span>
			</label>
			<input id="field-key-id" type="text" required bind:value={formData.key_id} />
		</div>

		<div class="form-group">
			<label class="field-label" for="field-locale">
				{$LL.translation_versions_page.col_locale()} <span class="required">*</span>
			</label>
			<select id="field-locale" required bind:value={formData.locale}>
				<option value="">-- Select --</option>
				{#each LOCALE_OPTIONS as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</div>

		<div class="form-group">
			<label class="field-label" for="field-content">
				{$LL.translation_versions_page.col_content()} <span class="required">*</span>
			</label>
			<textarea id="field-content" rows="4" required bind:value={formData.content}></textarea>
		</div>

		<div class="form-group">
			<label class="field-label" for="field-version-number">
				{$LL.translation_versions_page.col_version_number()} <span class="required">*</span>
			</label>
			<input id="field-version-number" type="number" min="1" required bind:value={formData.version_number} />
		</div>

		<div class="form-group">
			<label class="field-label" for="field-status">
				{$LL.translation_versions_page.col_status()}
			</label>
			<select id="field-status" bind:value={formData.status}>
				<option value="">-- Select --</option>
				{#each STATUS_OPTIONS as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</div>
	{/snippet}

	{#snippet detailSnippet(item)}
		<div class="meta-detail">
			<div class="meta-row">
				<span class="meta-label">{$LL.translation_versions_page.col_id()}</span>
				<span class="mono">{item.id}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.translation_versions_page.col_key_id()}</span>
				<span class="mono">{item.key_id ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.translation_versions_page.col_locale()}</span>
				<span>{item.locale ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.translation_versions_page.col_content()}</span>
				<span>{item.content ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.translation_versions_page.col_version_number()}</span>
				<span>{item.version_number ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.translation_versions_page.col_status()}</span>
				<span class="status-badge status-{(item.status ?? 'draft').toLowerCase()}">{item.status ?? 'draft'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.translation_versions_page.col_created_by()}</span>
				<span class="mono">{item.created_by ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.translation_versions_page.col_created_at()}</span>
				<span>{formatDate(item.created_at)}</span>
			</div>
		</div>
	{/snippet}
</CrudTable>

<style>
	/* Translation version status badge colors */
	.status-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.78rem; font-weight: 600; }
	.status-draft     { background: #fef3c7; color: #92400e; }
	.status-published { background: #dcfce7; color: #15803d; }
	.status-archived  { background: #f3f4f6; color: #374151; }
</style>
