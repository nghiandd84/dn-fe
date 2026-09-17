<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { LL } from '$i18n/i18n-util';
	import { maskToCrudActions } from '@dn-fe/ui/types';
	import { page } from '$app/stores';

	let { data } = $props();
	// Booking items are created via other apps, not here.
	const actions = $derived({
		...maskToCrudActions((data as any).authMasks?.['booking-items'] ?? 0),
		create: false
	});

	// Optional deep-link filter: /admin/booking-items?booking_id=<uuid>
	const bookingIdFilter = $derived($page.url.searchParams.get('booking_id') ?? '');
	const extraParams = $derived(bookingIdFilter ? { booking_id: `eq|${bookingIdFilter}` } : {});

	function formatJson(v: unknown): string {
		if (v === null || v === undefined) return '—';
		try {
			return `<code>${JSON.stringify(v)}</code>`;
		} catch {
			return String(v);
		}
	}
</script>

<h1>{$LL.booking_items_page.title()}</h1>

{#if bookingIdFilter}
	<div class="filter-banner">
		<span>{$LL.booking_items_page.filtered_by_booking()}: <code>{bookingIdFilter}</code></span>
		<a class="clear-link" href="/admin/booking-items">{$LL.booking_items_page.clear_filter()}</a>
	</div>
{/if}

<CrudTable
	resource="booking-items"
	apiPrefix="/api/booking"
	{extraParams}
	columns={[
		{ key: 'id', label: $LL.booking_items_page.col_id(), hideInTable: true },
		{
			key: 'booking_id',
			label: $LL.booking_items_page.col_booking_id(),
			sortable: true,
			filterable: true,
			operators: ['eq']
		},
		{
			key: 'item_type',
			label: $LL.booking_items_page.col_item_type(),
			sortable: true,
			filterable: true,
			operators: ['eq', 'li', 'sw']
		},
		{
			key: 'item_id',
			label: $LL.booking_items_page.col_item_id(),
			filterable: true,
			operators: ['eq']
		},
		{
			key: 'price',
			label: $LL.booking_items_page.col_price(),
			sortable: true,
			filterable: true,
			operators: ['eq', 'lt', 'lte', 'gt', 'gte']
		},
		{
			key: 'metadata',
			label: $LL.booking_items_page.col_metadata(),
			hideInTable: true,
			format: formatJson
		}
	]}
	formFields={[
		{ key: 'booking_id', label: $LL.booking_items_page.col_booking_id(), type: 'text', required: true },
		{ key: 'item_type', label: $LL.booking_items_page.col_item_type(), type: 'text', required: true },
		{ key: 'item_id', label: $LL.booking_items_page.col_item_id(), type: 'text', required: true },
		{ key: 'price', label: $LL.booking_items_page.col_price(), type: 'number', required: true }
	]}
	{actions}
>
	{#snippet detailSnippet(item)}
		<div class="meta-detail">
			<div class="meta-row"><span class="meta-label">{$LL.booking_items_page.col_id()}</span><span class="mono">{item.id}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.booking_items_page.col_booking_id()}</span><span class="mono">{item.booking_id}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.booking_items_page.col_item_type()}</span><span>{item.item_type ?? '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.booking_items_page.col_item_id()}</span><span class="mono">{item.item_id ?? '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.booking_items_page.col_price()}</span><span>{item.price ?? '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.booking_items_page.col_metadata()}</span><span>{item.metadata ? JSON.stringify(item.metadata) : '—'}</span></div>
		</div>
	{/snippet}
</CrudTable>

<style>
	.filter-banner {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
		background: #eff6ff;
		border: 1px solid #bfdbfe;
		color: #1e40af;
		border-radius: 6px;
		padding: 0.5rem 0.75rem;
		font-size: 0.85rem;
		margin-bottom: 1rem;
	}
	.filter-banner code { font-family: monospace; }
	.clear-link { margin-left: auto; color: #4f46e5; font-weight: 600; text-decoration: none; }
	.clear-link:hover { text-decoration: underline; }
	.mono {
		font-family: monospace;
		font-size: 0.82rem;
	}
</style>
