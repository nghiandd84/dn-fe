<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { LL } from '$i18n/i18n-util';
	import { page } from '$app/stores';

	const templateId = $derived($page.params.id);
</script>

<CrudTable
	resource="template-placeholders"
	apiPrefix="/api/email-template"
	extraParams={{ template_id: `eq|${templateId}` }}
	columns={[
		{ key: 'id', label: $LL.template_placeholders_page.col_id(), sortable: true, hideInTable: true },
		{ key: 'placeholder_key', label: $LL.template_placeholders_page.col_placeholder_key(), sortable: true, filterable: true, operators: ['eq', 'li', 'sw'] },
		{ key: 'description', label: $LL.template_placeholders_page.col_description(), format: (v) => v ?? '—' },
		{ key: 'example_value', label: $LL.template_placeholders_page.col_example_value(), format: (v) => v ?? '—' },
		{ key: 'is_required', label: $LL.template_placeholders_page.col_is_required(), format: (v) => v ? '✓' : '✗' },
		{ key: 'user_email', label: 'User Email', format: (v) => v ?? '—' },
		{ key: 'created_at', label: $LL.template_placeholders_page.col_created_at(), hideInTable: true },
		{ key: 'updated_at', label: $LL.template_placeholders_page.col_updated_at(), hideInTable: true },
	]}
	formFields={[]}
	actions={{ create: true, edit: true, delete: true, detail: true }}
	onCreateOpen={(fd) => { fd.template_id = Number(templateId); }}
>
	{#snippet editSnippet(editingItem, formData)}
		{#if editingItem?.user_email}
			<div class="form-group">
				<label class="field-label" for="user-email-display">User Email</label>
				<input id="user-email-display" type="text" class="readonly-input" value={editingItem.user_email} readonly />
			</div>
		{/if}
		<div class="form-group">
			<label class="field-label" for="field-placeholder_key">{$LL.template_placeholders_page.col_placeholder_key()} <span class="required">*</span></label>
			<input id="field-placeholder_key" type="text" required bind:value={formData.placeholder_key} />
		</div>
		<div class="form-group">
			<label class="field-label" for="field-description">{$LL.template_placeholders_page.col_description()} <span class="required">*</span></label>
			<textarea id="field-description" rows="2" required bind:value={formData.description}></textarea>
		</div>
		<div class="form-group">
			<label class="field-label" for="field-example_value">{$LL.template_placeholders_page.col_example_value()} <span class="required">*</span></label>
			<input id="field-example_value" type="text" required bind:value={formData.example_value} />
		</div>
		<div class="form-group">
			<label class="field-label">
				<input type="checkbox" bind:checked={formData.is_required} />
				{$LL.template_placeholders_page.col_is_required()}
			</label>
		</div>
	{/snippet}

	{#snippet detailSnippet(item)}
		<div class="meta-detail">
			<div class="meta-row"><span class="meta-label">ID</span><span class="mono">{item.id}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.template_placeholders_page.col_placeholder_key()}</span><span class="mono">{item.placeholder_key || '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.template_placeholders_page.col_description()}</span><span>{item.description || '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.template_placeholders_page.col_example_value()}</span><span>{item.example_value || '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.template_placeholders_page.col_is_required()}</span><span>{item.is_required ? '✓ Required' : '✗ Optional'}</span></div>
			<div class="meta-row"><span class="meta-label">User Email</span><span>{item.user_email || '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.template_placeholders_page.col_created_at()}</span><span class="mono">{item.created_at ?? '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.template_placeholders_page.col_updated_at()}</span><span class="mono">{item.updated_at ?? '—'}</span></div>
		</div>
	{/snippet}
</CrudTable>

<style>
	.form-group { margin-bottom: 0.8rem; }
	.field-label { display: block; margin-bottom: 0.3rem; font-weight: 500; font-size: 0.85rem; }
	.required { color: #dc2626; }
	.form-group input[type="text"],
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
</style>
