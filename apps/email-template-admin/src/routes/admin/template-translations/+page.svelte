<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import EmailTemplateSearchInput from '$lib/components/EmailTemplateSearchInput.svelte';
	import BodyEditor from '$lib/components/BodyEditor.svelte';
	import { LL } from '$i18n/i18n-util';

	function truncateBody(body: string): string {
		if (!body) return '—';
		return body.length > 80 ? body.substring(0, 80) + '…' : body;
	}

	const LANGUAGE_OPTIONS = [
		{ value: 'en-US', label: '🇺🇸 English (US)' },
		{ value: 'vi-VN', label: '🇻🇳 Vietnamese (VN)' },
		{ value: 'en-GB', label: '🇬🇧 English (GB)' },
		{ value: 'fr-FR', label: '🇫🇷 French (FR)' },
		{ value: 'de-DE', label: '🇩🇪 German (DE)' },
		{ value: 'ja-JP', label: '🇯🇵 Japanese (JP)' },
		{ value: 'ko-KR', label: '🇰🇷 Korean (KR)' },
		{ value: 'zh-CN', label: '🇨🇳 Chinese Simplified (CN)' },
		{ value: 'zh-TW', label: '🇹🇼 Chinese Traditional (TW)' },
		{ value: 'es-ES', label: '🇪🇸 Spanish (ES)' },
		{ value: 'pt-BR', label: '🇧🇷 Portuguese (BR)' },
		{ value: 'th-TH', label: '🇹🇭 Thai (TH)' },
		{ value: 'id-ID', label: '🇮🇩 Indonesian (ID)' },
	];
</script>

<h1>{$LL.template_translations_page.title()}</h1>

<CrudTable
	resource="template-translations"
	apiPrefix="/api/email-template"
	columns={[
		{ key: 'id', label: $LL.template_translations_page.col_id(), sortable: true, hideInTable: true },
		{ key: 'email_template.name', label: $LL.template_translations_page.col_template_id(), filterable: true, operators: ['li', 'eq', 'sw'], format: (_v, row) => row?.email_template?.name ?? row?.template_id ?? '—' },
		{ key: 'language_code', label: $LL.template_translations_page.col_language_code(), sortable: true, filterable: true, operators: ['eq', 'li'] },
		{ key: 'subject', label: $LL.template_translations_page.col_subject(), sortable: true, filterable: true, operators: ['eq', 'li', 'sw'] },
		{ key: 'body', label: $LL.template_translations_page.col_body(), format: truncateBody },
		{ key: 'version_name', label: $LL.template_translations_page.col_version_name(), sortable: true, filterable: true, operators: ['eq', 'li'] },
		{ key: 'user_email', label: 'User Email', format: (v) => v ?? '—' },
		{ key: 'created_at', label: $LL.template_translations_page.col_created_at(), hideInTable: true },
		{ key: 'updated_at', label: $LL.template_translations_page.col_updated_at(), hideInTable: true },
	]}
	formFields={[]}
	actions={{ create: true, edit: true, delete: true, detail: true }}
>
	{#snippet editSnippet(editingItem, formData)}
		{#if editingItem?.user_email}
			<div class="form-group">
				<label class="field-label">User Email</label>
				<input type="text" class="readonly-input" value={editingItem.user_email} readonly />
			</div>
		{/if}
		<div class="form-group">
			<EmailTemplateSearchInput
				label={$LL.template_translations_page.col_template_id()}
				bind:value={
					() => formData.template_id ?? null,
					(v) => (formData.template_id = v)
				}
			/>
		</div>
		<div class="form-group">
			<label class="field-label" for="field-language_code">{$LL.template_translations_page.col_language_code()} <span class="required">*</span></label>
			<select id="field-language_code" required bind:value={formData.language_code}>
				<option value="" disabled selected={!formData.language_code}>— Select language —</option>
				{#each LANGUAGE_OPTIONS as lang}
					<option value={lang.value}>{lang.label}</option>
				{/each}
			</select>
		</div>
		<div class="form-group">
			<label class="field-label" for="field-subject">{$LL.template_translations_page.col_subject()} <span class="required">*</span></label>
			<input id="field-subject" type="text" required bind:value={formData.subject} />
		</div>
		<div class="form-group">
			<label class="field-label" for="field-body">{$LL.template_translations_page.col_body()} <span class="required">*</span></label>
			<BodyEditor
				bind:value={
					() => formData.body ?? '',
					(v) => (formData.body = v)
				}
				templateId={formData.template_id ?? null}
				required
			/>
		</div>
		<div class="form-group">
			<label class="field-label" for="field-version_name">{$LL.template_translations_page.col_version_name()} <span class="required">*</span></label>
			<input id="field-version_name" type="text" required placeholder="e.g. v1, 2024-01" bind:value={formData.version_name} />
		</div>
	{/snippet}

	{#snippet detailSnippet(item)}
		<div class="meta-detail translation-detail">
			<div class="meta-row"><span class="meta-label">ID</span><span class="mono">{item.id}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.template_translations_page.col_template_id()}</span><span>{item.email_template?.name ?? item.template_id ?? '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.template_translations_page.col_language_code()}</span><span>{item.language_code || '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.template_translations_page.col_version_name()}</span><span>{item.version_name || '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.template_translations_page.col_subject()}</span><span>{item.subject || '—'}</span></div>
			<div class="meta-row body-row">
				<span class="meta-label">{$LL.template_translations_page.col_body()}</span>
				<div class="body-content">{@html item.body || '—'}</div>
			</div>
			<div class="meta-row"><span class="meta-label">User Email</span><span>{item.user_email || '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.template_translations_page.col_created_at()}</span><span class="mono">{item.created_at ?? '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.template_translations_page.col_updated_at()}</span><span class="mono">{item.updated_at ?? '—'}</span></div>
		</div>
	{/snippet}
</CrudTable>

<style>
	h1 { margin-bottom: 1rem; }

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
	.form-group input[type="text"],
	.form-group input[type="number"],
	.form-group select,
	.form-group textarea {
		width: 100%;
		padding: 0.4rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 0.9rem;
		box-sizing: border-box;
	}
	.form-group textarea { resize: vertical; }
	.readonly-input {
		width: 100%;
		padding: 0.4rem;
		border: 1px solid #e5e7eb;
		border-radius: 4px;
		background: #f9fafb;
		color: #6b7280;
		font-size: 0.9rem;
		cursor: not-allowed;
		box-sizing: border-box;
	}

	:global(.translation-detail) {
		min-width: 400px;
		max-width: 600px;
	}
	.body-row {
		flex-direction: column;
		align-items: flex-start !important;
		gap: 0.25rem;
	}
	.body-content {
		font-size: 0.82rem;
		background: #f8f9fa;
		border: 1px solid #e5e7eb;
		border-radius: 4px;
		padding: 0.5rem;
		white-space: pre-wrap;
		word-break: break-word;
		max-height: 300px;
		overflow-y: auto;
		width: 100%;
		line-height: 1.6;
	}
</style>
