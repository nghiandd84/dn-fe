<script lang="ts">
	import CrudTable from '$lib/components/CrudTable.svelte';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';
	import CreatePermissionModal from '$lib/components/CreatePermissionModal.svelte';
	import { MASK_BITS, maskToActions } from '$lib/components/types';
	import { fingerprint } from '$lib/fingerprint';
	import { get } from 'svelte/store';
	import { LL } from '$i18n/i18n-util';

	// ── Confirm dialog state ──────────────────────────────────────────────────
	let confirmOpen = $state(false);
	let confirmMessage = $state('');
	let confirmResolve: ((v: boolean) => void) | null = null;

	function showConfirm(message: string): Promise<boolean> {
		confirmMessage = message;
		confirmOpen = true;
		return new Promise(resolve => { confirmResolve = resolve; });
	}

	function handleConfirm() { confirmOpen = false; confirmResolve?.(true); }
	function handleCancel() { confirmOpen = false; confirmResolve?.(false); }

	// ── Permissions manager state ─────────────────────────────────────────────
	let assigned: any[] = $state([]);
	let availablePerms: any[] = $state([]);
	let loadingPerms = $state(false);
	let loadingAvailable = $state(false);
	let searchAssigned = $state('');
	let searchAll = $state('');
	let activeRoleId = $state<string | null>(null);
	let searchTimer: ReturnType<typeof setTimeout> | null = null;
	let showNewPermModal = $state(false);

	async function onDetail(role: any) {
		activeRoleId = role.id;
		loadingPerms = true;
		assigned = [];
		availablePerms = [];
		searchAssigned = '';
		searchAll = '';

		const fp = get(fingerprint);
		const headers = { 'X-Client-Fingerprint': fp };

		const [assignedRes] = await Promise.all([
			fetch(`/api/admin/roles/${role.id}/permissions`, { headers }),
			searchAvailable('', headers)
		]);

		const assignedJson = await assignedRes.json();
		assigned = assignedJson?.data?.result ?? (Array.isArray(assignedJson) ? assignedJson : []);
		loadingPerms = false;
	}

	async function onEdit(role: any, _formData: Record<string, any>) {
		await onDetail(role);
	}

	async function searchAvailable(query: string, headers?: Record<string, string>) {
		loadingAvailable = true;
		const fp = get(fingerprint);
		const h = headers ?? { 'X-Client-Fingerprint': fp };
		const params = new URLSearchParams({ page_size: '20', page: '1' });
		if (query.trim()) params.set('resource', `li|${query.trim()}`);
		const ids = assigned.map((p: any) => p.id).filter(Boolean);
		if (ids.length) params.set('id', `nin|${ids.join(',')}`);
		const res = await fetch(`/api/admin/permissions?${params}`, { headers: h });
		const json = await res.json();
		availablePerms = json?.result ?? json?.data?.result ?? [];
		loadingAvailable = false;
	}

	function onSearchAllInput(e: Event) {
		searchAll = (e.target as HTMLInputElement).value;
		if (searchTimer) clearTimeout(searchTimer);
		searchTimer = setTimeout(() => searchAvailable(searchAll), 300);
	}

	async function assign(permId: string) {
		if (!activeRoleId) return;
		const perm = availablePerms.find(p => p.id === permId);
		await fetch(`/api/admin/roles/${activeRoleId}/assign-permissions`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'X-Client-Fingerprint': get(fingerprint) },
			body: JSON.stringify({ permission_ids: [permId] })
		});
		// optimistic update
		if (perm) assigned = [...assigned, perm];
		availablePerms = availablePerms.filter(p => p.id !== permId);
	}

	async function unassign(permId: string) {
		if (!activeRoleId) return;
		const ok = await showConfirm($LL.roles_page.unassign_confirm());
		if (!ok) return;
		await fetch(`/api/admin/roles/${activeRoleId}/unassign-permissions`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'X-Client-Fingerprint': get(fingerprint) },
			body: JSON.stringify({ permission_ids: [permId] })
		});
		// optimistic update
		assigned = assigned.filter(p => p.id !== permId);
		// refresh available in case the unassigned perm matches current search
		searchAvailable(searchAll);
	}

	const assignedIds = $derived(new Set(assigned.map((p: any) => p.id)));

	const filteredAssigned = $derived(
		assigned.filter((p: any) =>
			!searchAssigned ||
			p.resource?.toLowerCase().includes(searchAssigned.toLowerCase()) ||
			p.description?.toLowerCase().includes(searchAssigned.toLowerCase())
		)
	);
</script>

<h1>{$LL.roles_page.title()}</h1>
<CrudTable
	resource="roles"
	extraParams={{ includes: 'client[name]' }}
	columns={[
		{ key: 'name', label: 'Name', sortable: true, filterable: true, operators: ['li', 'eq', 'sw'] },
		{ key: 'description', label: 'Description', filterable: true, operators: ['li', 'sw'] },
		{ key: 'client_id', label: 'Client', displayKey: 'client.name' },
		{ key: 'is_default', label: 'Default', format: (v) => v
			? '<span style="display:inline-flex;align-items:center;gap:0.25rem;background:#dcfce7;color:#15803d;border-radius:99px;padding:0.15rem 0.6rem;font-size:0.75rem;font-weight:600;width:fit-content;">✓ Yes</span>'
			: '<span style="display:inline-flex;align-items:center;gap:0.25rem;background:#f3f4f6;color:#9ca3af;border-radius:99px;padding:0.15rem 0.6rem;font-size:0.75rem;font-weight:600;width:fit-content;">✕ No</span>'
		},
	]}
	formFields={[
		{ key: 'name', label: 'Name', type: 'text', required: true },
		{ key: 'description', label: 'Description', type: 'text', required: true },
		{
			key: 'client_id',
			label: 'Client',
			type: 'select-remote',
			required: true,
			remoteOptions: { url: '/api/admin/clients', valueKey: 'id', labelKey: 'name' }
		},
		{ key: 'is_default', label: 'Is Default', type: 'checkbox' },
	]}
	actions={{ create: true, edit: true, delete: true, detail: true }}
	{onDetail}
	{onEdit}
>
	{#snippet editSnippet(_role, _formData)}
		<h4 class="section-title">{$LL.roles_page.permissions_section()}</h4>
		{@render permissionsPanel()}
	{/snippet}
	{#snippet detailSnippet(role)}
		<div class="role-detail">
			<!-- Role info -->
			<div class="role-meta">
				<div class="meta-row"><span class="meta-label">Name</span><span>{role.name}</span></div>
				<div class="meta-row"><span class="meta-label">Description</span><span>{role.description ?? '—'}</span></div>
				<div class="meta-row"><span class="meta-label">Client</span><span>{role.client?.name ?? role.client_id ?? '—'}</span></div>
				<div class="meta-row">
					<span class="meta-label">Default</span>
					{#if role.is_default}
						<span class="bool-badge bool-yes">✓ Yes</span>
					{:else}
						<span class="bool-badge bool-no">✕ No</span>
					{/if}
				</div>
			</div>

			<hr />

			<h4 class="section-title">{$LL.roles_page.permissions_section()}</h4>

			{#if loadingPerms}
				<p class="loading-msg">{$LL.roles_page.loading_permissions()}</p>
			{:else}
				<div class="perm-panel">
					<div class="panel-header">
						<span class="panel-title">{$LL.roles_page.assigned()} <span class="badge">{assigned.length}</span></span>
						<input class="search-input" type="text" placeholder={$LL.roles_page.search_placeholder()} bind:value={searchAssigned} />
					</div>
					<ul class="perm-list">
						{#if filteredAssigned.length === 0}
							<li class="perm-empty">{$LL.roles_page.none()}</li>
						{:else}
							{#each filteredAssigned as perm (perm.id)}
								<li class="perm-item">
									<div class="perm-info">
										<span class="perm-resource-row">
											<span class="perm-resource">{perm.resource}</span>
											{#if perm.mask != null}
												{#each maskToActions(perm.mask) as action}
													<span class="perm-action perm-action--{action.toLowerCase()}">{action}</span>
												{/each}
											{/if}
										</span>
										{#if perm.description}<span class="perm-desc">{perm.description}</span>{/if}
									</div>
								</li>
							{/each}
						{/if}
					</ul>
				</div>
			{/if}
		</div>
	{/snippet}

	{#snippet permissionsPanel()}
		{#if loadingPerms}
				<p class="loading-msg">{$LL.roles_page.loading_permissions()}</p>
			{:else}
				<div class="perm-panels">
					<!-- Assigned -->
					<div class="perm-panel">
						<div class="panel-header">
							<span class="panel-title">{$LL.roles_page.assigned()} <span class="badge">{assigned.length}</span></span>
							<input class="search-input" type="text" placeholder={$LL.roles_page.search_placeholder()} bind:value={searchAssigned} />
						</div>
						<ul class="perm-list">
							{#if filteredAssigned.length === 0}
								<li class="perm-empty">{$LL.roles_page.none()}</li>
							{:else}
								{#each filteredAssigned as perm (perm.id)}
									<li class="perm-item">
										<div class="perm-info">
											<span class="perm-resource-row">
												<span class="perm-resource">{perm.resource}</span>
												{#if perm.mask != null}
													{#each maskToActions(perm.mask) as action}
														<span class="perm-action perm-action--{action.toLowerCase()}">{action}</span>
													{/each}
												{/if}
											</span>
											{#if perm.description}<span class="perm-desc">{perm.description}</span>{/if}
										</div>
										<button type="button" class="btn-unassign" onclick={() => unassign(perm.id)} title="Unassign">✕</button>
									</li>
								{/each}
							{/if}
						</ul>
					</div>

					<!-- Available -->
					<div class="perm-panel">
						<div class="panel-header">
							<span class="panel-title">{$LL.roles_page.available()}</span>
							<input class="search-input" type="text" placeholder={$LL.roles_page.search_api_placeholder()} value={searchAll} oninput={onSearchAllInput} />
							<button type="button" class="btn-new-perm" onclick={() => showNewPermModal = true} title="New permission">＋</button>
						</div>
						<ul class="perm-list">
							{#if loadingAvailable}
								<li class="perm-empty">{$LL.roles_page.loading()}</li>
							{:else if availablePerms.length === 0}
								<li class="perm-empty">{$LL.roles_page.none()}</li>
							{:else}
								{#each availablePerms as perm (perm.id)}
									<li class="perm-item">
										<div class="perm-info">
											<span class="perm-resource-row">
												<span class="perm-resource">{perm.resource}</span>
												{#if perm.mask != null}
													{#each maskToActions(perm.mask) as action}
														<span class="perm-action perm-action--{action.toLowerCase()}">{action}</span>
													{/each}
												{/if}
											</span>
											{#if perm.description}<span class="perm-desc">{perm.description}</span>{/if}
										</div>
										<button type="button" class="btn-assign" onclick={() => assign(perm.id)} title="Assign">＋</button>
									</li>
								{/each}
							{/if}
						</ul>
					</div>
				</div>
			{/if}
	{/snippet}
</CrudTable>

{#if confirmOpen}
	<ConfirmModal
		message={confirmMessage}
		onconfirm={handleConfirm}
		oncancel={handleCancel}
	/>
{/if}

{#if showNewPermModal}
	<CreatePermissionModal
		onSaved={async () => { showNewPermModal = false; await searchAvailable(searchAll); }}
		oncancel={() => showNewPermModal = false}
	/>
{/if}

<style>
	.role-detail { display: flex; flex-direction: column; gap: 0.75rem; min-width: 560px; max-width: 720px; }

	/* Meta */
	.role-meta { display: grid; gap: 0.3rem; }
	.meta-row { display: grid; grid-template-columns: 110px 1fr; gap: 0.5rem; font-size: 0.875rem; align-items: center; }
	.meta-label { font-weight: 600; color: #555; }
	.bool-badge { display: inline-flex; align-items: center; gap: 0.25rem; border-radius: 99px; padding: 0.15rem 0.6rem; font-size: 0.75rem; font-weight: 600; }
	.bool-yes { background: #dcfce7; color: #15803d; }
	.bool-no  { background: #f3f4f6; color: #9ca3af; }

	hr { border: none; border-top: 1px solid #e5e7eb; margin: 0; }

	.section-title { margin: 0; font-size: 0.95rem; font-weight: 700; color: #111; }
	.loading-msg { font-size: 0.85rem; color: #888; }

	/* Panels */
	.perm-panels { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
	.perm-panel { border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden; }
	.panel-header { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; padding: 0.5rem 0.6rem; background: #f8f9fa; border-bottom: 1px solid #e5e7eb; }
	.panel-title { font-size: 0.8rem; font-weight: 600; color: #374151; white-space: nowrap; }
	.badge { display: inline-flex; align-items: center; justify-content: center; background: #e5e7eb; color: #374151; border-radius: 99px; font-size: 0.7rem; padding: 0 0.4rem; min-width: 1.2rem; height: 1.2rem; margin-left: 0.25rem; }
	.search-input { flex: 1; padding: 0.25rem 0.4rem; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.78rem; outline: none; min-width: 0; }

	/* Permission list */
	.perm-list { list-style: none; margin: 0; padding: 0; max-height: 240px; overflow-y: auto; }
	.perm-item { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; padding: 0.35rem 0.6rem; border-bottom: 1px solid #f3f4f6; }
	.perm-item:last-child { border-bottom: none; }
	.perm-item:hover { background: #f9fafb; }
	.perm-info { display: flex; flex-direction: column; min-width: 0; }
	.perm-resource { font-size: 0.82rem; font-weight: 500; color: #111; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
	.perm-resource-row { display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap; }
	.perm-desc { font-size: 0.72rem; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
	.perm-mask { font-size: 0.7rem; color: #9ca3af; background: #f3f4f6; border-radius: 3px; padding: 0 0.3rem; font-family: monospace; white-space: nowrap; }
	.perm-action { font-size: 0.65rem; font-weight: 600; border-radius: 3px; padding: 0.05rem 0.35rem; white-space: nowrap; }
	.perm-action--read   { background: #dbeafe; color: #1d4ed8; }
	.perm-action--create { background: #dcfce7; color: #15803d; }
	.perm-action--update { background: #fef9c3; color: #a16207; }
	.perm-action--delete { background: #fee2e2; color: #b91c1c; }
	.perm-action--admin  { background: #f3e8ff; color: #7e22ce; }
	.perm-empty { padding: 0.6rem; font-size: 0.82rem; color: #9ca3af; text-align: center; }

	/* Buttons */
	.btn-unassign { flex-shrink: 0; background: none; border: 1px solid #fca5a5; color: #dc2626; border-radius: 4px; width: 1.5rem; height: 1.5rem; cursor: pointer; font-size: 0.75rem; display: flex; align-items: center; justify-content: center; padding: 0; }
	.btn-unassign:hover { background: #fee2e2; }
	.btn-assign { flex-shrink: 0; background: none; border: 1px solid #6ee7b7; color: #059669; border-radius: 4px; width: 1.5rem; height: 1.5rem; cursor: pointer; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; padding: 0; }
	.btn-assign:hover { background: #d1fae5; }
	.btn-new-perm { flex-shrink: 0; background: #4f46e5; border: none; color: #fff; border-radius: 4px; width: 1.5rem; height: 1.5rem; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; padding: 0; }
	.btn-new-perm:hover { background: #4338ca; }
</style>
