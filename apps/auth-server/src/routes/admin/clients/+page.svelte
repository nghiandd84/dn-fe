<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { maskToCrudActions } from '$lib/components/types';

	let { data } = $props();

	const actions = $derived(maskToCrudActions((data as any).authMasks?.['clients'] ?? 0));

	let copied = $state(false);

	async function copyToClipboard(text: string) {
		await navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<h1>Clients</h1>
<CrudTable
	resource="clients"
	columns={[
		{ key: 'id', label: 'ID', hideInTable: true },
		{ key: 'name', label: 'Name', sortable: true, filterable: true, operators: ['li', 'eq', 'sw'] },
		{ key: 'email', label: 'Email', sortable: true, filterable: true, operators: ['eq', 'li'] },
		{ key: 'client_key', label: 'Client Key' },
	]}
	formFields={[
		{ key: 'name', label: 'Name', type: 'text', required: true },
		{ key: 'client_secret', label: 'Secret', type: 'password', required: true },
		{ key: 'email', label: 'Email', type: 'email' },
		{ key: 'description', label: 'Description', type: 'text' },
		{ key: 'redirect_uris', label: 'Redirect URIs', type: 'tags' },
		{ key: 'allowed_grants', label: 'Allowed Grants', type: 'tags' },
	]}
	{actions}
>
	{#snippet detailSnippet(client)}
		<dl class="detail-list">
			<div class="detail-row">
				<dt>ID</dt>
				<dd class="copyable-row">
					<span class="mono-value">{client.id ?? '—'}</span>
					{#if client.id}
						<button
							type="button"
							class="btn-copy"
							onclick={() => copyToClipboard(client.id)}
							title="Copy ID"
						>
							{copied ? '✓' : '⎘'}
						</button>
					{/if}
				</dd>
			</div>
			<div class="detail-row">
				<dt>Name</dt>
				<dd>{client.name ?? '—'}</dd>
			</div>
			<div class="detail-row">
				<dt>Email</dt>
				<dd>{client.email ?? '—'}</dd>
			</div>
			<div class="detail-row">
				<dt>Description</dt>
				<dd>{client.description ?? '—'}</dd>
			</div>
			<div class="detail-row">
				<dt>Client Key</dt>
				<dd>{client.client_key ?? '—'}</dd>
			</div>
			<div class="detail-row">
				<dt>Redirect URIs</dt>
				<dd>
					{#if client.redirect_uris?.length}
						<ul class="uri-list">
							{#each client.redirect_uris as uri}
								<li>{uri}</li>
							{/each}
						</ul>
					{:else}
						—
					{/if}
				</dd>
			</div>
			<div class="detail-row">
				<dt>Allowed Grants</dt>
				<dd>
					{#if client.allowed_grants?.length}
						<div class="tag-list">
							{#each client.allowed_grants as grant}
								<span class="tag">{grant}</span>
							{/each}
						</div>
					{:else}
						—
					{/if}
				</dd>
			</div>
		</dl>
	{/snippet}
</CrudTable>

<style>
	.detail-list { display: grid; gap: 0; margin: 0; }
	.detail-row { display: grid; grid-template-columns: 140px 1fr; gap: 0.5rem; padding: 0.5rem 0; border-bottom: 1px solid #eee; }
	.detail-row:last-child { border-bottom: none; }
	dt { font-weight: 600; font-size: 0.85rem; color: #555; }
	dd { font-size: 0.9rem; color: #111; word-break: break-all; margin: 0; }

	.copyable-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.mono-value {
		font-family: monospace;
		font-size: 0.85rem;
		background: #f3f4f6;
		padding: 0.15rem 0.4rem;
		border-radius: 4px;
		word-break: break-all;
	}
	.btn-copy {
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.75rem;
		height: 1.75rem;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		background: #fff;
		cursor: pointer;
		font-size: 0.9rem;
		color: #4f46e5;
		transition: background 0.15s, border-color 0.15s;
	}
	.btn-copy:hover {
		background: #eef2ff;
		border-color: #4f46e5;
	}

	.uri-list { margin: 0; padding-left: 1.1rem; font-size: 0.85rem; }
	.uri-list li { word-break: break-all; }

	.tag-list { display: flex; flex-wrap: wrap; gap: 0.3rem; }
	.tag {
		background: #e0e7ff;
		color: #3730a3;
		border-radius: 99px;
		padding: 0.1rem 0.55rem;
		font-size: 0.75rem;
		font-weight: 600;
	}
</style>
