<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { LL } from '$i18n/i18n-util';
	import { maskToCrudActions } from '@dn-fe/ui/types';
	import { fingerprint } from '$lib/fingerprint';
	import { get } from 'svelte/store';

	let { data } = $props();
	// Bookings are created via other apps (e.g. guest-booking flow), not here.
	const actions = $derived({
		...maskToCrudActions((data as any).authMasks?.['bookings'] ?? 0),
		create: false
	});

	const MODES = ['WINDOW', 'CAPACITY', 'RECURRENCE', 'APPROVAL', 'QUEUE', 'DISPATCH'];

	function formatDate(v: string | null): string {
		if (!v) return '—';
		try {
			return new Date(v).toLocaleString();
		} catch {
			return v;
		}
	}

	function formatMoney(v: number | null, row: any): string {
		if (v === null || v === undefined) return '—';
		const cur = row?.currency ?? '';
		return `${v} ${cur}`.trim();
	}

	function formatJson(v: unknown): string {
		if (v === null || v === undefined) return '—';
		try {
			return `<code>${JSON.stringify(v)}</code>`;
		} catch {
			return String(v);
		}
	}

	function badge(v: string | null): string {
		if (!v) return '—';
		return `<span class="pill">${v}</span>`;
	}

	// ── History modal ─────────────────────────────────────────────────────────
	let showHistory = $state(false);
	let historyLoading = $state(false);
	let historyItems = $state<any[]>([]);
	let historyBookingRef = $state('');

	async function openHistory(item: any) {
		showHistory = true;
		historyLoading = true;
		historyItems = [];
		historyBookingRef = item.booking_reference || item.id;
		try {
			const params = new URLSearchParams({
				page: '1',
				page_size: '50',
				order_name: 'created_at',
				order_direction: '0'
			});
			const res = await fetch(`/api/booking/bookings/${item.id}/history?${params}`, {
				headers: { 'X-Client-Fingerprint': get(fingerprint) }
			});
			const json = await res.json();
			historyItems = json.data?.result ?? [];
		} catch {
			historyItems = [];
		} finally {
			historyLoading = false;
		}
	}
</script>

<h1>{$LL.bookings_page.title()}</h1>

<CrudTable
	resource="bookings"
	apiPrefix="/api/booking"
	columns={[
		{ key: 'id', label: $LL.bookings_page.col_id(), hideInTable: true },
		{
			key: 'booking_reference',
			label: $LL.bookings_page.col_booking_reference(),
			sortable: true,
			filterable: true,
			operators: ['eq', 'li', 'sw']
		},
		{
			key: 'booking_type',
			label: $LL.bookings_page.col_booking_type(),
			sortable: true,
			filterable: true,
			operators: ['eq', 'li', 'sw']
		},
		{
			key: 'booking_mode',
			label: $LL.bookings_page.col_booking_mode(),
			filterable: true,
			operators: ['eq'],
			filterOptions: MODES.map((m) => ({ value: m, label: m })),
			format: badge
		},
		{
			key: 'status',
			label: $LL.bookings_page.col_status(),
			sortable: true,
			filterable: true,
			operators: ['eq'],
			format: badge
		},
		{
			key: 'total_amount',
			label: $LL.bookings_page.col_total_amount(),
			sortable: true,
			format: formatMoney
		},
		{
			key: 'payment_status',
			label: $LL.bookings_page.col_payment_status(),
			filterable: true,
			operators: ['eq'],
			format: badge
		},
		{ key: 'currency', label: $LL.bookings_page.col_currency(), hideInTable: true },
		{
			key: 'resource_type',
			label: $LL.bookings_page.col_resource_type(),
			hideInTable: true,
			format: (v) => v ?? '—'
		},
		{
			key: 'resource_id',
			label: $LL.bookings_page.col_resource_id(),
			hideInTable: true,
			format: (v) => v ?? '—'
		},
		{ key: 'user_id', label: $LL.bookings_page.col_user_id(), hideInTable: true },
		{
			key: 'payment_id',
			label: $LL.bookings_page.col_payment_id(),
			hideInTable: true,
			format: (v) => v ?? '—'
		},
		{
			key: 'metadata',
			label: $LL.bookings_page.col_metadata(),
			hideInTable: true,
			format: formatJson
		},
		{ key: 'version', label: $LL.bookings_page.col_version(), hideInTable: true },
		{
			key: 'created_at',
			label: $LL.bookings_page.col_created_at(),
			sortable: true,
			hideInTable: true,
			format: formatDate
		},
		{
			key: 'updated_at',
			label: $LL.bookings_page.col_updated_at(),
			hideInTable: true,
			format: formatDate
		},
		{
			key: 'confirmed_at',
			label: $LL.bookings_page.col_confirmed_at(),
			hideInTable: true,
			format: formatDate
		}
	]}
	formFields={[
		{ key: 'booking_reference', label: $LL.bookings_page.col_booking_reference(), type: 'text', required: true },
		{ key: 'booking_type', label: $LL.bookings_page.col_booking_type(), type: 'text', required: true },
		{ key: 'user_id', label: $LL.bookings_page.col_user_id(), type: 'text', required: true },
		{ key: 'resource_type', label: $LL.bookings_page.col_resource_type(), type: 'text' },
		{ key: 'resource_id', label: $LL.bookings_page.col_resource_id(), type: 'text' },
		{ key: 'total_amount', label: $LL.bookings_page.col_total_amount(), type: 'number', required: true },
		{ key: 'currency', label: $LL.bookings_page.col_currency(), type: 'text', required: true },
		{ key: 'status', label: $LL.bookings_page.col_status(), type: 'text', required: true },
		{ key: 'payment_status', label: $LL.bookings_page.col_payment_status(), type: 'text' }
	]}
	{actions}
>
	{#snippet detailSnippet(item)}
		<div class="meta-detail">
			<div class="meta-row"><span class="meta-label">{$LL.bookings_page.col_id()}</span><span class="mono">{item.id}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.bookings_page.col_booking_reference()}</span><span>{item.booking_reference ?? '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.bookings_page.col_booking_type()}</span><span>{item.booking_type ?? '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.bookings_page.col_booking_mode()}</span><span>{item.booking_mode ?? '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.bookings_page.col_status()}</span><span>{item.status ?? '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.bookings_page.col_total_amount()}</span><span>{item.total_amount ?? '—'} {item.currency ?? ''}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.bookings_page.col_payment_status()}</span><span>{item.payment_status ?? '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.bookings_page.col_payment_id()}</span><span class="mono">{item.payment_id ?? '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.bookings_page.col_resource_type()}</span><span>{item.resource_type ?? '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.bookings_page.col_resource_id()}</span><span class="mono">{item.resource_id ?? '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.bookings_page.col_user_id()}</span><span class="mono">{item.user_id ?? '—'}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.bookings_page.col_version()}</span><span>{item.version ?? 0}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.bookings_page.col_created_at()}</span><span>{formatDate(item.created_at)}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.bookings_page.col_updated_at()}</span><span>{formatDate(item.updated_at)}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.bookings_page.col_confirmed_at()}</span><span>{formatDate(item.confirmed_at)}</span></div>
			<div class="history-action">
				<a class="btn btn-secondary" href={`/admin/booking-items?booking_id=${item.id}`}>{$LL.bookings_page.view_items()}</a>
				<button type="button" class="btn btn-info" onclick={() => openHistory(item)}>{$LL.bookings_page.view_history()}</button>
			</div>
		</div>
	{/snippet}
</CrudTable>

{#if showHistory}
	<div class="modal-overlay" onclick={() => (showHistory = false)} role="presentation">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="modal history-modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" tabindex="-1">
			<h3 class="modal-title">{$LL.bookings_page.history_title()} — {historyBookingRef}</h3>
			<div class="modal-body">
				{#if historyLoading}
					<p>{$LL.crud_table.loading()}</p>
				{:else if historyItems.length === 0}
					<p>{$LL.bookings_page.no_history()}</p>
				{:else}
					<table class="history-table">
						<thead>
							<tr>
								<th>{$LL.bookings_page.hist_event_type()}</th>
								<th>{$LL.bookings_page.hist_from_status()}</th>
								<th>{$LL.bookings_page.hist_to_status()}</th>
								<th>{$LL.bookings_page.hist_note()}</th>
								<th>{$LL.bookings_page.hist_actor_id()}</th>
								<th>{$LL.bookings_page.hist_created_at()}</th>
							</tr>
						</thead>
						<tbody>
							{#each historyItems as h}
								<tr>
									<td><span class="pill">{h.event_type}</span></td>
									<td>{h.from_status ?? '—'}</td>
									<td>{h.to_status ?? '—'}</td>
									<td>{h.note ?? '—'}</td>
									<td class="mono">{h.actor_id ?? '—'}</td>
									<td>{formatDate(h.created_at)}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			</div>
			<div class="modal-actions">
				<button class="btn" onclick={() => (showHistory = false)}>{$LL.bookings_page.close()}</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.history-action {
		margin-top: 1rem;
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	.btn {
		padding: 0.4rem 0.8rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		cursor: pointer;
		background: #fff;
		font-size: 0.85rem;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		color: #111;
	}
	.btn-secondary {
		background: #4f46e5;
		color: #fff;
		border-color: #4f46e5;
	}
	.btn-info {
		background: #0ea5e9;
		color: #fff;
		border-color: #0ea5e9;
	}
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}
	.modal {
		background: #fff;
		padding: 1.5rem;
		border-radius: 8px;
		min-width: 400px;
	}
	.history-modal {
		min-width: 720px;
		max-width: 90vw;
	}
	.modal-title {
		margin-top: 0;
	}
	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		margin-top: 1rem;
	}
	.history-table {
		width: 100%;
		border-collapse: collapse;
	}
	.history-table th,
	.history-table td {
		padding: 0.5rem;
		text-align: left;
		border-bottom: 1px solid #eee;
		font-size: 0.85rem;
	}
	.history-table th {
		background: #f8f9fa;
		font-weight: 600;
	}
	:global(.pill) {
		display: inline-block;
		padding: 0.1rem 0.5rem;
		border-radius: 999px;
		background: #eef2ff;
		color: #4338ca;
		font-size: 0.78rem;
		font-weight: 600;
	}
	.mono {
		font-family: monospace;
		font-size: 0.82rem;
	}
</style>
