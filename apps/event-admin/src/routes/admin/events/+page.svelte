<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { maskToCrudActions } from '@dn-fe/ui/types';
	import { LL } from '$i18n/i18n-util';

	let { data } = $props();
	const actions = $derived(maskToCrudActions((data as any).authMasks?.['events'] ?? 0));

	const STATUS_OPTIONS = [
		{ value: 'UPCOMING', label: 'UPCOMING' },
		{ value: 'ONGOING', label: 'ONGOING' },
		{ value: 'COMPLETED', label: 'COMPLETED' },
		{ value: 'CANCELLED', label: 'CANCELLED' }
	];

	function formatDate(v: string | null): string {
		if (!v) return '—';
		try {
			return new Date(v).toLocaleString();
		} catch {
			return v;
		}
	}

	function formatDateInput(v: string | null): string {
		if (!v) return '';
		// Normalize ISO string to datetime-local input format (YYYY-MM-DDTHH:MM)
		try {
			const d = new Date(v);
			const pad = (n: number) => String(n).padStart(2, '0');
			return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
		} catch {
			return '';
		}
	}

	// datetime-local gives YYYY-MM-DDTHH:MM — append :00 so the API receives seconds
	function toApiDatetime(v: string): string {
		if (!v) return v;
		return v.length === 16 ? `${v}:00` : v;
	}
</script>

<h1>{$LL.events_page.title()}</h1>

<CrudTable
	resource="events"
	apiPrefix="/api/event"
	columns={[
		{ key: 'id', label: $LL.events_page.col_id(), sortable: false, hideInTable: true },
		{
			key: 'event_name',
			label: $LL.events_page.col_event_name(),
			sortable: true,
			filterable: true,
			operators: ['eq', 'li', 'sw']
		},
		{
			key: 'event_date',
			label: $LL.events_page.col_event_date(),
			sortable: true,
			format: formatDate
		},
		{
			key: 'venue_name',
			label: $LL.events_page.col_venue_name(),
			sortable: true,
			filterable: true,
			operators: ['eq', 'li']
		},
		{
			key: 'total_seats',
			label: $LL.events_page.col_total_seats(),
			sortable: true,
			format: (v) => (v != null ? String(v) : '—')
		},
		{
			key: 'status',
			label: $LL.events_page.col_status(),
			sortable: true,
			filterable: true,
			operators: ['eq'],
			format: (v) => v ?? '—'
		},
		{
			key: 'sale_start_time',
			label: $LL.events_page.col_sale_start_time(),
			sortable: false,
			format: formatDate
		},
		{
			key: 'created_at',
			label: $LL.events_page.col_created_at(),
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
			<label class="field-label" for="field-event-name">
				{$LL.events_page.col_event_name()} <span class="required">*</span>
			</label>
			<input id="field-event-name" type="text" required bind:value={formData.event_name} />
		</div>

		<div class="form-group">
			<label class="field-label" for="field-event-date">
				{$LL.events_page.col_event_date()} <span class="required">*</span>
			</label>
			<input
				id="field-event-date"
				type="datetime-local"
				required
				value={formatDateInput(formData.event_date ?? editingItem?.event_date)}
				oninput={(e) => { formData.event_date = toApiDatetime((e.target as HTMLInputElement).value); }}
			/>
		</div>

		<div class="form-group">
			<label class="field-label" for="field-venue-name">
				{$LL.events_page.col_venue_name()} <span class="required">*</span>
			</label>
			<input id="field-venue-name" type="text" required bind:value={formData.venue_name} />
		</div>

		<div class="form-group">
			<label class="field-label" for="field-total-seats">
				{$LL.events_page.col_total_seats()} <span class="required">*</span>
			</label>
			<input
				id="field-total-seats"
				type="number"
				min="0"
				required
				bind:value={formData.total_seats}
			/>
		</div>

		<div class="form-group">
			<label class="field-label" for="field-status">
				{$LL.events_page.col_status()}
			</label>
			<select id="field-status" bind:value={formData.status}>
				<option value="">-- Select --</option>
				{#each STATUS_OPTIONS as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</div>

		<div class="form-group">
			<label class="field-label" for="field-sale-start">
				{$LL.events_page.col_sale_start_time()}
			</label>
			<input
				id="field-sale-start"
				type="datetime-local"
				value={formatDateInput(formData.sale_start_time ?? editingItem?.sale_start_time)}
				oninput={(e) => { formData.sale_start_time = (e.target as HTMLInputElement).value ? toApiDatetime((e.target as HTMLInputElement).value) : null; }}
			/>
		</div>
	{/snippet}

	{#snippet detailSnippet(item)}
		<div class="meta-detail">
			<div class="meta-row">
				<span class="meta-label">{$LL.events_page.col_id()}</span>
				<span class="mono">{item.id}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.events_page.col_event_name()}</span>
				<span>{item.event_name}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.events_page.col_event_date()}</span>
				<span>{formatDate(item.event_date)}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.events_page.col_venue_name()}</span>
				<span>{item.venue_name ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.events_page.col_total_seats()}</span>
				<span>{item.total_seats ?? '—'}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.events_page.col_status()}</span>
				<span class="status-badge status-{(item.status ?? 'unknown').toLowerCase()}"
					>{item.status ?? '—'}</span
				>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.events_page.col_sale_start_time()}</span>
				<span>{formatDate(item.sale_start_time)}</span>
			</div>
			<div class="meta-row">
				<span class="meta-label">{$LL.events_page.col_created_at()}</span>
				<span>{formatDate(item.created_at)}</span>
			</div>
		</div>
	{/snippet}
</CrudTable>

<style>
	/* Event status badge colors */
	.status-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.78rem; font-weight: 600; }
	.status-upcoming  { background: #dbeafe; color: #1d4ed8; }
	.status-ongoing   { background: #dcfce7; color: #15803d; }
	.status-completed { background: #f3f4f6; color: #374151; }
	.status-cancelled { background: #fee2e2; color: #dc2626; }
</style>
