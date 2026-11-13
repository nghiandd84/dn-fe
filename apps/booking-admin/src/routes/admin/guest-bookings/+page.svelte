<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { LL } from '$i18n/i18n-util';
	import { maskToCrudActions } from '@dn-fe/ui/types';
	import { fingerprint } from '$lib/fingerprint';
	import { get } from 'svelte/store';
	import ConfirmModal from '@dn-fe/ui/ConfirmModal.svelte';
	import { toast } from '@dn-fe/ui/toast';

	let { data } = $props();
	const actions = $derived(maskToCrudActions((data as any).authMasks?.['bookings'] ?? 0));

	const STATUSES = ['PENDING', 'CONFIRMED', 'PROMOTED', 'CANCELLED', 'EXPIRED', 'PAYMENT_EXPIRED'];
	const MODES = ['WINDOW', 'CAPACITY', 'RECURRENCE', 'APPROVAL', 'QUEUE', 'DISPATCH'];

	// Fields the PATCH (GuestBookingForUpdateRequest) accepts. Create-only fields
	// (booking_type/booking_mode/resource_type/resource_id/external_ref/site_origin/
	// confirm_path) are shown but disabled while editing via `readonlyOnEdit`.

	function formatDate(v: string | null): string {
		if (!v) return '—';
		try {
			return new Date(v).toLocaleString();
		} catch {
			return v;
		}
	}

	// ISO datetime -> value for <input type="datetime-local"> (local time, no tz).
	function toLocalInput(v: string | null | undefined): string {
		if (!v) return '';
		const d = new Date(v);
		if (isNaN(d.getTime())) return '';
		const pad = (n: number) => String(n).padStart(2, '0');
		return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
	}

	// datetime-local value -> ISO string (or null when cleared).
	function fromLocalInput(v: string): string | null {
		if (!v) return null;
		const d = new Date(v);
		if (isNaN(d.getTime())) return null;
		return d.toISOString();
	}

	function formatMoney(v: number | null, row: any): string {
		if (v === null || v === undefined) return '—';
		return `${v} ${row?.currency ?? ''}`.trim();
	}

	function statusPill(v: string | null): string {
		if (!v) return '—';
		const cls = statusClass(v);
		return `<span class="${cls}">${v}</span>`;
	}

	function statusClass(s: string | null): string {
		switch (s) {
			case 'CONFIRMED':
				return 'pill pill-green';
			case 'PROMOTED':
				return 'pill pill-blue';
			case 'PENDING':
				return 'pill pill-amber';
			case 'EXPIRED':
			case 'PAYMENT_EXPIRED':
			case 'CANCELLED':
				return 'pill pill-red';
			default:
				return 'pill';
		}
	}

	// Display values for the editable datetime-local inputs (see editSnippet).
	let confirmedAtInput = $state('');
	let paymentExpiresAtInput = $state('');

	function onCreateOpen(formData: Record<string, any>) {
		// Sensible defaults for the admin create form.
		formData.currency = formData.currency || 'USD';
		formData.status = formData.status || 'PENDING';
		formData.confirm_path = formData.confirm_path || '/path/confirm_booking';
		formData.booking_type = formData.booking_type || 'EVENT';
		formData.booking_mode = formData.booking_mode || 'CAPACITY';
		confirmedAtInput = '';
		paymentExpiresAtInput = '';
	}

	function onEdit(item: any, formData: Record<string, any>) {
		// NOTE: We intentionally keep all fields on formData so the edit form shows
		// the current values. The update endpoint (GuestBookingForUpdateRequest)
		// only reads the fields it declares and ignores the rest (create-only
		// fields like booking_type/resource_type/external_ref are not updatable).
		// Seed the datetime-local inputs from the existing ISO values.
		confirmedAtInput = toLocalInput(item?.confirmed_at);
		paymentExpiresAtInput = toLocalInput(item?.payment_expires_at);
	}

	// ── Promote action (from the detail view) ─────────────────────────────────
	let confirmOpen = $state(false);
	let promoteId = $state<string | null>(null);
	let promoting = $state(false);

	function requestPromote(item: any) {
		if (item?.status !== 'CONFIRMED' || item?.promoted_booking_id) {
			toast.warning($LL.guest_bookings_page.promote_only_confirmed());
			return;
		}
		promoteId = item.id;
		confirmOpen = true;
	}

	async function doPromote() {
		confirmOpen = false;
		if (!promoteId) return;
		promoting = true;
		try {
			const res = await fetch(`/api/booking/guest-bookings/${promoteId}/promote`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', 'X-Client-Fingerprint': get(fingerprint) }
			});
			const json = await res.json();
			if (!res.ok || json?.data?.ok === false) {
				const msg =
					json?.data?.details || json?.data?.error_type || json?.message || `Error ${res.status}`;
				toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
			} else {
				toast.success($LL.guest_bookings_page.promote_success());
			}
		} catch (e: any) {
			toast.error(e?.message ?? 'Network error');
		} finally {
			promoting = false;
			promoteId = null;
		}
	}

	// ── History modal ─────────────────────────────────────────────────────────
	let showHistory = $state(false);
	let historyLoading = $state(false);
	let historyItems = $state<any[]>([]);
	let historyRef = $state('');

	async function openHistory(item: any) {
		showHistory = true;
		historyLoading = true;
		historyItems = [];
		historyRef = item.booking_reference || item.id;
		try {
			const params = new URLSearchParams({
				page: '1',
				page_size: '50',
				order_name: 'created_at',
				order_direction: '0'
			});
			const res = await fetch(`/api/booking/guest-bookings/${item.id}/history?${params}`, {
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

<h1>{$LL.guest_bookings_page.title()}</h1>

<CrudTable
	resource="guest-bookings"
	apiPrefix="/api/booking"
	columns={[
		{ key: 'id', label: $LL.guest_bookings_page.col_id(), hideInTable: true },
		{
			key: 'booking_reference',
			label: $LL.guest_bookings_page.col_booking_reference(),
			sortable: true,
			filterable: true,
			operators: ['eq', 'li', 'sw']
		},
		{
			key: 'status',
			label: $LL.guest_bookings_page.col_status(),
			sortable: true,
			filterable: true,
			operators: ['eq'],
			filterOptions: STATUSES.map((s) => ({ value: s, label: s })),
			format: statusPill
		},
		{
			key: 'guest_email',
			label: $LL.guest_bookings_page.col_guest_email(),
			sortable: true,
			filterable: true,
			operators: ['eq', 'li', 'sw']
		},
		{
			key: 'guest_name',
			label: $LL.guest_bookings_page.col_guest_name(),
			format: (v) => v ?? '—'
		},
		{
			key: 'booking_type',
			label: $LL.guest_bookings_page.col_booking_type(),
			filterable: true,
			operators: ['eq', 'li', 'sw'],
			format: (v) => v ?? '—'
		},
		{
			key: 'booking_mode',
			label: $LL.guest_bookings_page.col_booking_mode(),
			filterable: true,
			operators: ['eq'],
			filterOptions: MODES.map((m) => ({ value: m, label: m })),
			hideInTable: true,
			format: (v) => v ?? '—'
		},
		{
			key: 'resource_type',
			label: $LL.guest_bookings_page.col_resource_type(),
			filterable: true,
			operators: ['eq'],
			hideInTable: true,
			format: (v) => v ?? '—'
		},
		{
			key: 'resource_id',
			label: $LL.guest_bookings_page.col_resource_id(),
			filterable: true,
			operators: ['eq'],
			hideInTable: true,
			format: (v) => v ?? '—'
		},
		{
			key: 'external_ref',
			label: $LL.guest_bookings_page.col_external_ref(),
			filterable: true,
			operators: ['eq', 'li', 'sw'],
			hideInTable: true,
			format: (v) => v ?? '—'
		},
		{
			key: 'total_amount',
			label: $LL.guest_bookings_page.col_total_amount(),
			sortable: true,
			format: formatMoney
		},
		{ key: 'currency', label: $LL.guest_bookings_page.col_currency(), hideInTable: true },
		{ key: 'site_origin', label: $LL.guest_bookings_page.col_site_origin(), hideInTable: true, format: (v) => v ?? '—' },
		{ key: 'confirm_path', label: $LL.guest_bookings_page.col_confirm_path(), hideInTable: true, format: (v) => v ?? '—' },
		{ key: 'expires_at', label: $LL.guest_bookings_page.col_expires_at(), hideInTable: true, format: formatDate },
		{ key: 'payment_expires_at', label: $LL.guest_bookings_page.col_payment_expires_at(), hideInTable: true, format: formatDate },
		{ key: 'promoted_booking_id', label: $LL.guest_bookings_page.col_promoted_booking_id(), hideInTable: true, format: (v) => v ?? '—' },
		{ key: 'metadata', label: $LL.guest_bookings_page.col_metadata(), hideInTable: true, format: (v) => (v ? `<code>${JSON.stringify(v)}</code>` : '—') },
		{
			key: 'created_at',
			label: $LL.guest_bookings_page.col_created_at(),
			sortable: true,
			format: formatDate
		},
		{ key: 'updated_at', label: $LL.guest_bookings_page.col_updated_at(), hideInTable: true, format: formatDate },
		{ key: 'confirmed_at', label: $LL.guest_bookings_page.col_confirmed_at(), hideInTable: true, format: formatDate }
	]}
	formFields={[
		{ key: 'booking_type', label: $LL.guest_bookings_page.col_booking_type(), type: 'text', readonlyOnEdit: true },
		{ key: 'booking_mode', label: $LL.guest_bookings_page.col_booking_mode(), type: 'select', options: MODES.map((m) => ({ value: m, label: m })), readonlyOnEdit: true },
		{ key: 'resource_type', label: $LL.guest_bookings_page.col_resource_type(), type: 'text', readonlyOnEdit: true },
		{ key: 'resource_id', label: $LL.guest_bookings_page.col_resource_id(), type: 'text', readonlyOnEdit: true },
		{ key: 'external_ref', label: $LL.guest_bookings_page.col_external_ref(), type: 'text', readonlyOnEdit: true },
		{ key: 'guest_email', label: $LL.guest_bookings_page.col_guest_email(), type: 'email', required: true },
		{ key: 'guest_name', label: $LL.guest_bookings_page.col_guest_name(), type: 'text' },
		{ key: 'site_origin', label: $LL.guest_bookings_page.col_site_origin(), type: 'text', required: true, readonlyOnEdit: true },
		{ key: 'confirm_path', label: $LL.guest_bookings_page.col_confirm_path(), type: 'text', readonlyOnEdit: true },
		{ key: 'total_amount', label: $LL.guest_bookings_page.col_total_amount(), type: 'number', required: true },
		{ key: 'currency', label: $LL.guest_bookings_page.col_currency(), type: 'text', required: true },
		{ key: 'booking_reference', label: $LL.guest_bookings_page.col_booking_reference(), type: 'text' },
		{ key: 'status', label: $LL.guest_bookings_page.col_status(), type: 'select', options: STATUSES.map((s) => ({ value: s, label: s })) }
	]}
	{actions}
	{onCreateOpen}
	{onEdit}
>
	{#snippet editSnippet(editingItem, formData)}
		{#if editingItem}
			<!-- Editable datetime fields (GuestBookingForUpdateRequest). CrudTable's
			     built-in form has no date type, so we render them here and store ISO. -->
			<div class="form-group">
				<label class="field-label" for="gb-confirmed-at">{$LL.guest_bookings_page.col_confirmed_at()}</label>
				<input
					id="gb-confirmed-at"
					type="datetime-local"
					value={confirmedAtInput}
					onchange={(e) => {
						confirmedAtInput = (e.target as HTMLInputElement).value;
						formData.confirmed_at = fromLocalInput(confirmedAtInput);
					}}
				/>
			</div>
			<div class="form-group">
				<label class="field-label" for="gb-payment-expires-at">{$LL.guest_bookings_page.col_payment_expires_at()}</label>
				<input
					id="gb-payment-expires-at"
					type="datetime-local"
					value={paymentExpiresAtInput}
					onchange={(e) => {
						paymentExpiresAtInput = (e.target as HTMLInputElement).value;
						formData.payment_expires_at = fromLocalInput(paymentExpiresAtInput);
					}}
				/>
			</div>
		{/if}
	{/snippet}

	{#snippet detailSnippet(item)}
		<div class="gb-detail">
			<div class="gb-detail-head">
				<span class="ref">{item.booking_reference ?? item.id}</span>
				<span class={statusClass(item.status)}>{item.status ?? '—'}</span>
				<div class="head-actions">
					<button type="button" class="btn btn-info" onclick={() => openHistory(item)}>
						{$LL.bookings_page.view_history()}
					</button>
					{#if actions.create}
						<button
							type="button"
							class="btn btn-primary"
							disabled={item.status !== 'CONFIRMED' || !!item.promoted_booking_id || promoting}
							title={item.status !== 'CONFIRMED' || item.promoted_booking_id ? $LL.guest_bookings_page.promote_only_confirmed() : ''}
							onclick={() => requestPromote(item)}
						>
							{$LL.guest_bookings_page.promote()}
						</button>
					{/if}
				</div>
			</div>

			<dl class="meta-detail">
				<div class="meta-row"><span class="meta-label">{$LL.guest_bookings_page.col_id()}</span><span class="mono">{item.id}</span></div>
				<div class="meta-row"><span class="meta-label">{$LL.guest_bookings_page.col_booking_type()}</span><span>{item.booking_type ?? '—'}</span></div>
				<div class="meta-row"><span class="meta-label">{$LL.guest_bookings_page.col_booking_mode()}</span><span>{item.booking_mode ?? '—'}</span></div>
				<div class="meta-row"><span class="meta-label">{$LL.guest_bookings_page.col_resource_type()}</span><span>{item.resource_type ?? '—'}</span></div>
				<div class="meta-row"><span class="meta-label">{$LL.guest_bookings_page.col_resource_id()}</span><span class="mono">{item.resource_id ?? '—'}</span></div>
				<div class="meta-row"><span class="meta-label">{$LL.guest_bookings_page.col_external_ref()}</span><span class="mono">{item.external_ref ?? '—'}</span></div>
				<div class="meta-row"><span class="meta-label">{$LL.guest_bookings_page.col_guest_name()}</span><span>{item.guest_name ?? '—'}</span></div>
				<div class="meta-row"><span class="meta-label">{$LL.guest_bookings_page.col_guest_email()}</span><span>{item.guest_email ?? '—'}</span></div>
				<div class="meta-row"><span class="meta-label">{$LL.guest_bookings_page.col_total_amount()}</span><span>{item.total_amount ?? '—'} {item.currency ?? ''}</span></div>
				<div class="meta-row"><span class="meta-label">{$LL.guest_bookings_page.col_site_origin()}</span><span>{item.site_origin ?? '—'}</span></div>
				<div class="meta-row"><span class="meta-label">{$LL.guest_bookings_page.col_confirm_path()}</span><span>{item.confirm_path ?? '—'}</span></div>
				<div class="meta-row"><span class="meta-label">{$LL.guest_bookings_page.col_expires_at()}</span><span>{formatDate(item.expires_at)}</span></div>
				<div class="meta-row"><span class="meta-label">{$LL.guest_bookings_page.col_payment_expires_at()}</span><span>{formatDate(item.payment_expires_at)}</span></div>
				<div class="meta-row"><span class="meta-label">{$LL.guest_bookings_page.col_created_at()}</span><span>{formatDate(item.created_at)}</span></div>
				<div class="meta-row"><span class="meta-label">{$LL.guest_bookings_page.col_confirmed_at()}</span><span>{formatDate(item.confirmed_at)}</span></div>
				<div class="meta-row"><span class="meta-label">{$LL.guest_bookings_page.col_updated_at()}</span><span>{formatDate(item.updated_at)}</span></div>
				{#if item.promoted_booking_id}
					<div class="meta-row"><span class="meta-label">{$LL.guest_bookings_page.promoted_link()}</span><span class="mono">{item.promoted_booking_id}</span></div>
				{/if}
			</dl>

			<h3 class="items-title">{$LL.guest_bookings_page.items_title()}</h3>
			{#if item.items && item.items.length}
				<table class="items-table">
					<thead>
						<tr>
							<th>{$LL.guest_bookings_page.item_type()}</th>
							<th>{$LL.guest_bookings_page.item_id()}</th>
							<th>{$LL.guest_bookings_page.item_price()}</th>
						</tr>
					</thead>
					<tbody>
						{#each item.items as it}
							<tr>
								<td>{it.item_type ?? '—'}</td>
								<td class="mono">{it.item_id ?? '—'}</td>
								<td>{it.price ?? '—'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{:else}
				<p class="empty-note">—</p>
			{/if}
		</div>
	{/snippet}
</CrudTable>

{#if confirmOpen}
	<ConfirmModal
		message={$LL.guest_bookings_page.promote_confirm()}
		confirmLabel={$LL.guest_bookings_page.promote()}
		cancelLabel={$LL.crud_table.cancel()}
		danger={false}
		onconfirm={doPromote}
		oncancel={() => { confirmOpen = false; promoteId = null; }}
	/>
{/if}

{#if showHistory}
	<div class="modal-overlay" onclick={() => (showHistory = false)} role="presentation">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="modal history-modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" tabindex="-1">
			<h3 class="modal-title">{$LL.bookings_page.history_title()} — {historyRef}</h3>
			<div class="modal-body">
				{#if historyLoading}
					<p>{$LL.crud_table.loading()}</p>
				{:else if historyItems.length === 0}
					<p>{$LL.bookings_page.no_history()}</p>
				{:else}
					<table class="items-table">
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
	.form-group { margin-bottom: 0.8rem; }
	.field-label { display: block; margin-bottom: 0.3rem; font-weight: 500; font-size: 0.85rem; }
	.form-group input { width: 100%; padding: 0.4rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
	.gb-detail-head { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap; }
	.ref { font-weight: 700; font-size: 1.05rem; }
	.head-actions { margin-left: auto; display: flex; gap: 0.5rem; }
	.btn { padding: 0.4rem 0.8rem; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; background: #fff; font-size: 0.85rem; }
	.btn-primary { background: #4f46e5; color: #fff; border-color: #4f46e5; }
	.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
	.btn-info { background: #0ea5e9; color: #fff; border-color: #0ea5e9; }
	.items-title { margin: 1.25rem 0 0.5rem; font-size: 0.95rem; }
	.items-table { width: 100%; border-collapse: collapse; }
	.items-table th, .items-table td { padding: 0.5rem; text-align: left; border-bottom: 1px solid #eee; font-size: 0.85rem; }
	.items-table th { background: #f8f9fa; font-weight: 600; }
	.empty-note { color: #6b7280; font-size: 0.9rem; }
	.mono { font-family: monospace; font-size: 0.82rem; }
	/* History modal */
	.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem; box-sizing: border-box; }
	.modal { background: #fff; border-radius: 8px; min-width: 400px; display: flex; flex-direction: column; max-height: 100dvh; overflow: hidden; }
	.history-modal { min-width: 720px; max-width: 90vw; }
	.modal-title { flex: 0 0 auto; margin: 0; padding: 1rem 1rem 0.6rem; }
	.modal-body { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 0 1rem; }
	.modal-actions { flex: 0 0 auto; display: flex; justify-content: flex-end; gap: 0.5rem; padding: 0.6rem 1rem 1rem; }
	:global(.pill) { display: inline-block; padding: 0.1rem 0.55rem; border-radius: 999px; background: #eef2ff; color: #4338ca; font-size: 0.75rem; font-weight: 600; }
	:global(.pill-green) { background: #dcfce7; color: #166534; }
	:global(.pill-blue) { background: #dbeafe; color: #1e40af; }
	:global(.pill-amber) { background: #fef3c7; color: #92400e; }
	:global(.pill-red) { background: #fee2e2; color: #b91c1c; }
</style>
