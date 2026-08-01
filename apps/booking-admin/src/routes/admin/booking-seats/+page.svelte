<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { LL } from '$i18n/i18n-util';

	function formatDate(v: string | null): string {
		if (!v) return '—';
		try { return new Date(v).toLocaleString(); } catch { return v; }
	}
</script>

<h1>{$LL.booking_seats_page.title()}</h1>

<CrudTable
	resource="booking-seats"
	apiPrefix="/api/booking"
	columns={[
		{ key: 'id', label: $LL.booking_seats_page.col_id(), sortable: false, hideInTable: true },
		{
			key: 'booking_id',
			label: $LL.booking_seats_page.col_booking_id(),
			sortable: true,
			filterable: true,
			operators: ['eq']
		},
		{
			key: 'seat_id',
			label: $LL.booking_seats_page.col_seat_id(),
			sortable: true,
			filterable: true,
			operators: ['eq']
		},
		{
			key: 'price',
			label: $LL.booking_seats_page.col_price(),
			sortable: true,
			format: (v) => (v != null ? Number(v).toFixed(2) : '—')
		},
		{
			key: 'created_at',
			label: $LL.booking_seats_page.col_created_at(),
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
				<span class="meta-label">{$LL.booking_seats_page.col_id()}</span>
				<span class="mono">{item.id}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.booking_seats_page.col_booking_id()}</span>
				<span class="mono">{item.booking_id ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.booking_seats_page.col_seat_id()}</span>
				<span class="mono">{item.seat_id ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.booking_seats_page.col_price()}</span>
				<span>{item.price != null ? Number(item.price).toFixed(2) : '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.booking_seats_page.col_created_at()}</span>
				<span>{formatDate(item.created_at)}</span>
			</div>
		</div>
	{/snippet}
</CrudTable>

<style>
	h1 { margin-bottom: 1rem; }
</style>
