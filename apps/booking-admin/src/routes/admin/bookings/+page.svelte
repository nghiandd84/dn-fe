<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { LL } from '$i18n/i18n-util';

	const STATUS_OPTIONS = [
		{ value: 'PENDING', label: 'PENDING' },
		{ value: 'CONFIRMED', label: 'CONFIRMED' },
		{ value: 'CANCELLED', label: 'CANCELLED' },
		{ value: 'COMPLETED', label: 'COMPLETED' }
	];

	const PAYMENT_STATUS_OPTIONS = [
		{ value: 'PENDING', label: 'PENDING' },
		{ value: 'PAID', label: 'PAID' },
		{ value: 'FAILED', label: 'FAILED' },
		{ value: 'REFUNDED', label: 'REFUNDED' }
	];

	function formatDate(v: string | null): string {
		if (!v) return '—';
		try { return new Date(v).toLocaleString(); } catch { return v; }
	}

	function formatAmount(v: number | null): string {
		if (v == null) return '—';
		return v.toFixed(2);
	}
</script>

<h1>{$LL.bookings_page.title()}</h1>

<CrudTable
	resource="bookings"
	apiPrefix="/api/booking"
	columns={[
		{ key: 'id', label: $LL.bookings_page.col_id(), sortable: false, hideInTable: true },
		{
			key: 'booking_reference',
			label: $LL.bookings_page.col_booking_reference(),
			sortable: true,
			filterable: true,
			operators: ['eq', 'li', 'sw']
		},
		{
			key: 'status',
			label: $LL.bookings_page.col_status(),
			sortable: true,
			filterable: true,
			operators: ['eq'],
			format: (v) => v ?? '—'
		},
		{
			key: 'total_amount',
			label: $LL.bookings_page.col_total_amount(),
			sortable: true,
			format: formatAmount
		},
		{
			key: 'currency',
			label: $LL.bookings_page.col_currency(),
			sortable: false,
			format: (v) => v ?? '—'
		},
		{
			key: 'payment_status',
			label: $LL.bookings_page.col_payment_status(),
			sortable: true,
			filterable: true,
			operators: ['eq'],
			format: (v) => v ?? '—'
		},
		{
			key: 'confirmed_at',
			label: $LL.bookings_page.col_confirmed_at(),
			sortable: true,
			format: formatDate
		},
		{
			key: 'created_at',
			label: $LL.bookings_page.col_created_at(),
			sortable: true,
			hideInTable: true,
			format: formatDate
		}
	]}
	formFields={[]}
	actions={{ create: false, edit: true, delete: true, detail: true }}
>
	{#snippet editSnippet(editingItem, formData)}
		<div class="form-group">
			<label class="field-label" for="field-status">
				{$LL.bookings_page.col_status()}
			</label>
			<select id="field-status" bind:value={formData.status}>
				<option value="">-- Select --</option>
				{#each STATUS_OPTIONS as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</div>

		<div class="form-group">
			<label class="field-label" for="field-payment-status">
				{$LL.bookings_page.col_payment_status()}
			</label>
			<select id="field-payment-status" bind:value={formData.payment_status}>
				<option value="">-- Select --</option>
				{#each PAYMENT_STATUS_OPTIONS as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</div>
	{/snippet}

	{#snippet detailSnippet(item)}
		<div class="meta-detail">
			<div class="meta-row">
				<span class="meta-label">{$LL.bookings_page.col_id()}</span>
				<span class="mono">{item.id}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.bookings_page.col_booking_reference()}</span>
				<span class="mono">{item.booking_reference ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.bookings_page.col_event_id()}</span>
				<span class="mono">{item.event_id ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.bookings_page.col_user_id()}</span>
				<span class="mono">{item.user_id ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.bookings_page.col_total_amount()}</span>
				<span>{formatAmount(item.total_amount)} {item.currency ?? ''}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.bookings_page.col_status()}</span>
				<span class="status-badge status-{(item.status ?? 'unknown').toLowerCase()}">{item.status ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.bookings_page.col_payment_id()}</span>
				<span class="mono">{item.payment_id ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.bookings_page.col_payment_status()}</span>
				<span>{item.payment_status ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.bookings_page.col_confirmed_at()}</span>
				<span>{formatDate(item.confirmed_at)}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.bookings_page.col_created_at()}</span>
				<span>{formatDate(item.created_at)}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.bookings_page.col_updated_at()}</span>
				<span>{formatDate(item.updated_at)}</span>
			</div>
		</div>
	{/snippet}
</CrudTable>

<style>
	h1 { margin-bottom: 1rem; }
	.form-group { margin-bottom: 0.8rem; }
	.field-label { display: block; margin-bottom: 0.3rem; font-weight: 500; font-size: 0.85rem; }
	.form-group select {
		width: 100%;
		padding: 0.4rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 0.9rem;
		box-sizing: border-box;
	}
	.status-badge {
		display: inline-block;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		font-size: 0.78rem;
		font-weight: 600;
	}
	.status-pending   { background: #fef9c3; color: #92400e; }
	.status-confirmed { background: #dcfce7; color: #15803d; }
	.status-cancelled { background: #fee2e2; color: #dc2626; }
	.status-completed { background: #f3f4f6; color: #374151; }
</style>
