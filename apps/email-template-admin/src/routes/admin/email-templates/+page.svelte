<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { LL } from '$i18n/i18n-util';
	import { goto } from '$app/navigation';

	function handleDetail(item: any) {
		goto(`/admin/email-templates/${item.id}/placeholders`);
	}
</script>

<h1>{$LL.email_templates_page.title()}</h1>

<CrudTable
	resource="email-templates"
	apiPrefix="/api/email-template"
	columns={[
		{ key: 'id', label: $LL.email_templates_page.col_id(), sortable: true, hideInTable: true },
		{ key: 'name', label: $LL.email_templates_page.col_name(), sortable: true, filterable: true, operators: ['eq', 'li', 'sw'] },
		{ key: 'key', label: $LL.email_templates_page.col_key(), sortable: true, filterable: true, operators: ['eq', 'li'] },
		{ key: 'description', label: $LL.email_templates_page.col_description(), format: (v) => v ?? '—' },
		{ key: 'is_active', label: $LL.email_templates_page.col_is_active(), format: (v) => v ? '✓' : '✗' },
		{ key: 'user_email', label: 'User Email', format: (v) => v ?? '—' },
		{ key: 'user_id', label: $LL.email_templates_page.col_user_id(), hideInTable: true },
	]}
	formFields={[]}
	actions={{ create: true, edit: true, delete: true, detail: true }}
	onDetail={handleDetail}
>
	{#snippet editSnippet(editingItem, formData)}
		{#if editingItem?.user_email}
			<div class="form-group">
				<label class="field-label">User Email</label>
				<input type="text" class="readonly-input" value={editingItem.user_email} readonly />
			</div>
		{/if}
		<div class="form-group">
			<label class="field-label" for="field-name">{$LL.email_templates_page.col_name()} <span class="required">*</span></label>
			<input id="field-name" type="text" required bind:value={formData.name} />
		</div>
		<div class="form-group">
			<label class="field-label" for="field-key">{$LL.email_templates_page.col_key()}</label>
			<input id="field-key" type="text" bind:value={formData.key} />
		</div>
		<div class="form-group">
			<label class="field-label" for="field-description">{$LL.email_templates_page.col_description()}</label>
			<textarea id="field-description" rows="3" bind:value={formData.description}></textarea>
		</div>
		<div class="form-group">
			<label class="field-label">
				<input type="checkbox" bind:checked={formData.is_active} />
				{$LL.email_templates_page.col_is_active()}
			</label>
		</div>
	{/snippet}

	{#snippet detailSnippet(item)}
		<div class="meta-detail">
			<div class="meta-row"><span class="meta-label">ID</span><span class="mono">{item.id}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.email_templates_page.col_name()}</span><span>{item.name}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.email_templates_page.col_key()}</span><span class="mono">{item.key || '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.email_templates_page.col_description()}</span><span>{item.description || '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.email_templates_page.col_is_active()}</span><span>{item.is_active ? '✓ Active' : '✗ Inactive'}</span></div>
			<div class="meta-row"><span class="meta-label">User Email</span><span>{item.user_email || '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.email_templates_page.col_user_id()}</span><span class="mono">{item.user_id || '—'}</span></div>
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
