<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { LL } from '$i18n/i18n-util';
	import { page } from '$app/stores';

	// Support ?url_id=xxx to pre-filter clicks for a specific URL
	const preselectedUrlId = $derived($page.url.searchParams.get('url_id') || '');

	let urlIdFilter = $state(preselectedUrlId);

	function formatDate(v: string | null): string {
		if (!v) return '—';
		try { return new Date(v).toLocaleString(); } catch { return v; }
	}

	function truncate(v: string | null, max = 50): string {
		if (!v) return '—';
		return v.length > max ? v.slice(0, max) + '…' : v;
	}
</script>

<h1>{$LL.url_clicks_page.title()}</h1>

{#if urlIdFilter}
	<div class="filter-bar">
		<span>Showing clicks for URL: <code class="mono">{urlIdFilter}</code></span>
		<a href="/admin/url-clicks" class="clear-filter">× Clear filter</a>
	</div>
{/if}

{#if urlIdFilter}
	<!-- Per-URL clicks view via /api/url-shortener/urls/[id]/clicks -->
	<CrudTable
		resource="clicks"
		apiPrefix="/api/url-shortener/urls/{urlIdFilter}"
		columns={[
			{ key: 'id', label: $LL.url_clicks_page.col_id(), sortable: false, hideInTable: true },
			{
				key: 'url_id',
				label: $LL.url_clicks_page.col_url_id(),
				sortable: false,
				hideInTable: true,
				format: (v) => (v as string) ?? '—'
			},
			{
				key: 'ip_address',
				label: $LL.url_clicks_page.col_ip_address(),
				sortable: false,
				filterable: true,
				operators: ['eq', 'li']
			},
			{
				key: 'country',
				label: $LL.url_clicks_page.col_country(),
				sortable: false,
				filterable: true,
				operators: ['eq'],
				format: (v) => (v as string) ?? '—'
			},
			{
				key: 'referrer',
				label: $LL.url_clicks_page.col_referrer(),
				sortable: false,
				format: (v) => truncate(v as string)
			},
			{
				key: 'user_agent',
				label: $LL.url_clicks_page.col_user_agent(),
				sortable: false,
				hideInTable: true,
				format: (v) => truncate(v as string)
			},
			{
				key: 'clicked_at',
				label: $LL.url_clicks_page.col_clicked_at(),
				sortable: true,
				format: formatDate
			}
		]}
		formFields={[]}
		actions={{ create: false, edit: false, delete: false, detail: true }}
	>
		{#snippet detailSnippet(item)}
			<div class="meta-detail">
				<div class="meta-row">
					<span class="meta-label">{$LL.url_clicks_page.col_id()}</span>
					<span class="mono">{item.id}</span>
				</div>
				<div class="meta-row">
					<span class="meta-label">{$LL.url_clicks_page.col_url_id()}</span>
					<span class="mono">{item.url_id ?? '—'}</span>
				</div>
				<div class="meta-row">
					<span class="meta-label">{$LL.url_clicks_page.col_ip_address()}</span>
					<span class="mono">{item.ip_address ?? '—'}</span>
				</div>
				<div class="meta-row">
					<span class="meta-label">{$LL.url_clicks_page.col_country()}</span>
					<span>{item.country ?? '—'}</span>
				</div>
				<div class="meta-row">
					<span class="meta-label">{$LL.url_clicks_page.col_referrer()}</span>
					<span class="mono">{item.referrer ?? '—'}</span>
				</div>
				<div class="meta-row">
					<span class="meta-label">{$LL.url_clicks_page.col_user_agent()}</span>
					<span class="mono small">{item.user_agent ?? '—'}</span>
				</div>
				<div class="meta-row">
					<span class="meta-label">{$LL.url_clicks_page.col_clicked_at()}</span>
					<span>{formatDate(item.clicked_at)}</span>
				</div>
			</div>
		{/snippet}
	</CrudTable>
{:else}
	<!-- URL listing so user can select a URL to see its clicks -->
	<div class="no-filter">
		<p>Select a URL from <a href="/admin/urls">Shortened URLs</a> to view its click analytics, or browse all URLs below and click "View Clicks".</p>
	</div>

	<CrudTable
		resource="urls"
		apiPrefix="/api/url-shortener"
		columns={[
			{ key: 'id', label: 'ID', sortable: false, hideInTable: true },
			{
				key: 'short_code',
				label: $LL.urls_page.col_short_code(),
				sortable: true,
				filterable: true,
				operators: ['eq', 'li']
			},
			{
				key: 'original_url',
				label: $LL.urls_page.col_original_url(),
				sortable: false,
				format: (v) => truncate(v as string)
			},
			{
				key: 'click_count',
				label: $LL.urls_page.col_click_count(),
				sortable: true,
				format: (v) => String(v ?? 0)
			},
			{
				key: 'created_at',
				label: $LL.urls_page.col_created_at(),
				sortable: true,
				format: formatDate
			}
		]}
		formFields={[]}
		actions={{ create: false, edit: false, delete: false, detail: false }}
	>
		{#snippet rowActionsSnippet(item)}
			<a href="/admin/url-clicks?url_id={item.id}" class="view-btn">📊 View Clicks</a>
		{/snippet}
	</CrudTable>
{/if}

<style>
	h1 { margin-bottom: 1rem; }

	.filter-bar {
		display: flex;
		align-items: center;
		gap: 1rem;
		background: #f0f9ff;
		border: 1px solid #bae6fd;
		border-radius: 6px;
		padding: 0.6rem 1rem;
		margin-bottom: 1rem;
		font-size: 0.88rem;
	}
	.clear-filter {
		color: #0ea5e9;
		text-decoration: none;
		font-weight: 500;
		margin-left: auto;
	}
	.clear-filter:hover { text-decoration: underline; }

	.no-filter {
		background: #fffbeb;
		border: 1px solid #fde68a;
		border-radius: 6px;
		padding: 0.75rem 1rem;
		margin-bottom: 1rem;
		font-size: 0.88rem;
		color: #92400e;
	}
	.no-filter a { color: #0ea5e9; }

	.view-btn {
		display: inline-block;
		padding: 0.25rem 0.6rem;
		background: #0ea5e9;
		color: #fff;
		border-radius: 4px;
		font-size: 0.78rem;
		text-decoration: none;
		white-space: nowrap;
	}
	.view-btn:hover { background: #0284c7; }

	.small { font-size: 0.78rem; }
</style>
