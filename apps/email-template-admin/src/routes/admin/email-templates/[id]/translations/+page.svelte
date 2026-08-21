<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import BodyEditor from '$lib/components/BodyEditor.svelte';
	import { LL } from '$i18n/i18n-util';
	import { page } from '$app/stores';

	const templateId = $derived(Number($page.params.id));

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

<CrudTable
	resource="template-translations"
	apiPrefix="/api/email-template"
	extraParams={{ template_id: `eq|${templateId}` }}
	columns={[
		{ key: 'id', label: $LL.template_translations_page.col_id(), sortable: true, hideInTable: true },
		{ key: 'language_code', label: $LL.template_translations_page.col_language_code(), sortable: true, filterable: true, operators: ['eq', 'li'] },
		{ key: 'subject', label: $LL.template_translations_page.col_subject(), sortable: true, filterable: true, operators: ['eq', 'li', 'sw'] },
		{ key: 'body', label: $LL.template_translations_page.col_body(), format: truncateBody, hideInTable: true },
		{ key: 'version_name', label: $LL.template_translations_page.col_version_name(), sortable: true, filterable: true, operators: ['eq', 'li'] },
		{ key: 'user_email', label: 'User Email', format: (v) => v ?? '—' },
		{ key: 'created_at', label: $LL.template_translations_page.col_created_at(), hideInTable: true },
		{ key: 'updated_at', label: $LL.template_translations_page.col_updated_at(), hideInTable: true },
	]}
	formFields={[]}
	actions={{ create: true, edit: true, delete: true, detail: true }}
	onCreateOpen={(fd) => { fd.template_id = templateId; }}
>
	{#snippet editSnippet(editingItem, formData)}
		{#if editingItem?.user_email}
			<div class="form-group">
				<label class="field-label" for="user-email-display">User Email</label>
				<input id="user-email-display" type="text" class="readonly-input" value={editingItem.user_email} readonly />
			</div>
		{/if}
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
				templateId={templateId}
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
<style>
	/* Body display in detail view — unique to translations */
	:global(.translation-detail) { min-width: 400px; max-width: 600px; }
	.body-row { flex-direction: column; align-items: flex-start !important; gap: 0.25rem; }
	.body-content { font-size: 0.82rem; background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 4px; padding: 0.5rem; white-space: pre-wrap; word-break: break-word; max-height: 300px; overflow-y: auto; width: 100%; line-height: 1.6; }
</style>
