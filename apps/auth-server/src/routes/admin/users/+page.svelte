<script lang="ts">
	import CrudTable from '@dn-fe/ui/CrudTable.svelte';
	import { LANGUAGE_OPTIONS, maskToActions } from '@dn-fe/ui';
	import { fingerprint } from '$lib/fingerprint';
	import { get } from 'svelte/store';
	import { LL } from '$i18n/i18n-util';

	// ── Role management state ─────────────────────────────────────────────────
	let activeUserId = $state<string | null>(null);
	let assigned = $state<any[]>([]);
	let availableRoles = $state<any[]>([]);
	let loadingAssigned = $state(false);
	let loadingAvailable = $state(false);
	let searchAssigned = $state('');
	let searchAvailable = $state('');
	let searchTimer: ReturnType<typeof setTimeout> | null = null;

	async function onDetail(user: any) {
		activeUserId = user.id;
		assigned = (user.accesses ?? []).map((a: any) => ({
			id: a.role_id,
			name: a.role_name || a.role_id,
			key: a.key,
			access_id: a.id
		}));
		searchAssigned = '';
		searchAvailable = '';
		await fetchAvailable('');
	}

	async function fetchAvailable(query: string) {
		loadingAvailable = true;
		const fp = get(fingerprint);
		const params = new URLSearchParams({ page_size: '50', page: '1' });
		if (query.trim()) params.set('name', `li|${query.trim()}`);
		const assignedIds = assigned.map((r) => r.id).filter(Boolean);
		if (assignedIds.length) params.set('id', `nin|${assignedIds.join(',')}`);
		const res = await fetch(`/api/admin/roles?${params}`, {
			headers: { 'X-Client-Fingerprint': fp }
		});
		const json = await res.json();
		availableRoles = json?.data?.result ?? json?.result ?? [];
		loadingAvailable = false;
	}

	function onSearchAvailableInput(e: Event) {
		searchAvailable = (e.target as HTMLInputElement).value;
		if (searchTimer) clearTimeout(searchTimer);
		searchTimer = setTimeout(() => fetchAvailable(searchAvailable), 300);
	}

	// ── Assign key modal state ────────────────────────────────────────────────
	let expandedRoleId = $state<string | null>(null);
	let rolePermissions = $state<Record<string, any[]>>({});
	let loadingRolePerms = $state<Record<string, boolean>>({});

	async function togglePermissions(roleId: string) {
		if (expandedRoleId === roleId) { expandedRoleId = null; return; }
		expandedRoleId = roleId;
		if (rolePermissions[roleId]) return;
		loadingRolePerms = { ...loadingRolePerms, [roleId]: true };
		const res = await fetch(`/api/admin/roles/${roleId}/permissions`, {
			headers: { 'X-Client-Fingerprint': get(fingerprint) }
		});
		const json = await res.json();
		rolePermissions = { ...rolePermissions, [roleId]: json?.data?.result ?? [] };
		loadingRolePerms = { ...loadingRolePerms, [roleId]: false };
	}

	let assigningRole = $state<any | null>(null);
	let assignKey = $state('');

	function openAssignModal(role: any) {
		assigningRole = role;
		assignKey = '';
	}

	function closeAssignModal() {
		assigningRole = null;
		assignKey = '';
	}

	async function confirmAssign() {
		if (!assigningRole || !activeUserId) return;
		const fp = get(fingerprint);
		const body: Record<string, any> = { role_ids: [assigningRole.id] };
		if (assignKey.trim()) body.key = assignKey.trim();
		await fetch(`/api/admin/users/${activeUserId}/assign-roles`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'X-Client-Fingerprint': fp },
			body: JSON.stringify(body)
		});
		// optimistic update
		assigned = [...assigned, { id: assigningRole.id, name: assigningRole.name, key: assignKey.trim() }];
		availableRoles = availableRoles.filter((r) => r.id !== assigningRole!.id);
		closeAssignModal();
	}

	async function unassignRole(roleId: string) {
		if (!activeUserId) return;
		const fp = get(fingerprint);
		await fetch(`/api/admin/users/${activeUserId}/unassign-roles`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'X-Client-Fingerprint': fp },
			body: JSON.stringify({ role_ids: [roleId] })
		});
		// optimistic update
		const removed = assigned.find((r) => r.id === roleId);
		assigned = assigned.filter((r) => r.id !== roleId);
		if (removed) fetchAvailable(searchAvailable);
	}

	const filteredAssigned = $derived(
		assigned.filter((r) =>
			!searchAssigned ||
			r.name?.toLowerCase().includes(searchAssigned.toLowerCase())
		)
	);

	function formatAccesses(accesses: any): string {
		if (!Array.isArray(accesses) || accesses.length === 0) return '—';
		return accesses
			.map((a: any) => {
				const label = a.role_name || a.key || a.role_id?.slice(0, 8) + '…';
				return `<span style="display:inline-block;background:#ede9fe;color:#5b21b6;border-radius:99px;padding:0.1rem 0.55rem;font-size:0.75rem;font-weight:600;margin:0.1rem;">${label}</span>`;
			})
			.join('');
	}
</script>

<h1>{$LL.users_page.title()}</h1>
<CrudTable
	resource="users"
	extraParams={{ includes: 'accesses' }}
	columns={[
		{ key: 'email', label: $LL.users_page.col_email(), sortable: true, filterable: true, operators: ['eq', 'li'] },
		{ key: 'language', label: $LL.users_page.col_language(), filterable: true, operators: ['eq', 'neq'], filterOptions: LANGUAGE_OPTIONS },
		{ key: 'accesses', label: $LL.users_page.col_roles(), sortable: false, format: formatAccesses },
	]}
	actions={{ delete: true, detail: true }}
	{onDetail}
>
	{#snippet detailSnippet(user)}
		<div class="user-detail">
			<div class="meta-row"><span class="meta-label">{$LL.users_page.col_id()}</span><span class="mono">{user.id}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.users_page.col_email()}</span><span>{user.email}</span></div>
			<div class="meta-row"><span class="meta-label">{$LL.users_page.col_language()}</span><span>{user.language ?? '—'}</span></div>

			<hr />

			<h4 class="section-title">
				{$LL.users_page.roles_section()}
				<span class="badge">{assigned.length}</span>
			</h4>

			<div class="role-panels">
				<!-- Assigned roles -->
				<div class="role-panel">
					<div class="panel-header">
						<span class="panel-title">{$LL.users_page.assigned()}</span>
						<input
							class="search-input"
							type="text"
							placeholder={$LL.users_page.search_placeholder()}
							bind:value={searchAssigned}
						/>
					</div>
					<ul class="role-list">
						{#if filteredAssigned.length === 0}
							<li class="role-empty">{$LL.users_page.none()}</li>
						{:else}
							{#each filteredAssigned as role (role.id)}
								<li class="role-item">
									<div class="role-row">
										<div class="role-info">
											<span class="role-name">{role.name}</span>
											{#if role.key}
												<span class="role-key">{role.key}</span>
											{/if}
										</div>
										<button
											type="button"
											class="btn-perm"
											class:active={expandedRoleId === role.id}
											onclick={() => togglePermissions(role.id)}
											title="View permissions"
										>…</button>
										<button
											type="button"
											class="btn-unassign"
											onclick={() => unassignRole(role.id)}
											title="Unassign"
										>✕</button>
									</div>
									{#if expandedRoleId === role.id}
										<div class="perm-inline">
											{#if loadingRolePerms[role.id]}
												<span class="perm-inline-msg">Loading…</span>
											{:else if !rolePermissions[role.id]?.length}
												<span class="perm-inline-msg">No permissions</span>
											{:else}
												{#each rolePermissions[role.id] as perm (perm.id)}
													<div class="perm-row">
														<span class="perm-resource">{perm.resource}</span>
														<span class="perm-actions">
															{#each maskToActions(perm.mask ?? 0) as action}
																<span class="perm-badge perm-badge--{action.toLowerCase()}">{action}</span>
															{/each}
															<span class="perm-raw">({perm.mask})</span>
														</span>
													</div>
												{/each}
											{/if}
										</div>
									{/if}
								</li>
							{/each}
						{/if}
					</ul>
				</div>

				<!-- Available roles -->
				<div class="role-panel">
					<div class="panel-header">
						<span class="panel-title">{$LL.users_page.available()}</span>
						<input
							class="search-input"
							type="text"
							placeholder={$LL.users_page.search_placeholder()}
							value={searchAvailable}
							oninput={onSearchAvailableInput}
						/>
					</div>
					<ul class="role-list">
						{#if loadingAvailable}
							<li class="role-empty">{$LL.users_page.loading()}</li>
						{:else if availableRoles.length === 0}
							<li class="role-empty">{$LL.users_page.none()}</li>
						{:else}
							{#each availableRoles as role (role.id)}
								<li class="role-item">
									<div class="role-row">
										<div class="role-info">
											<span class="role-name">{role.name}</span>
											{#if role.description}
												<span class="role-desc">{role.description}</span>
											{/if}
										</div>
										<button
											type="button"
											class="btn-assign"
											onclick={() => openAssignModal(role)}
											title="Assign"
										>＋</button>
									</div>
								</li>
							{/each}
						{/if}
					</ul>
				</div>
			</div>
		</div>
	{/snippet}
</CrudTable>

{#if assigningRole}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_interactive_supports_focus -->
	<div class="modal-overlay" onclick={closeAssignModal} role="presentation">
		<div class="assign-modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
			<h3 class="modal-title">{$LL.users_page.assign_role_title()}</h3>
			<p class="modal-role-name">{assigningRole.name}</p>
			<div class="modal-field">
				<label for="assign-key">{$LL.users_page.key_label()} <span class="optional">{$LL.users_page.key_optional()}</span></label>
				<input
					id="assign-key"
					type="text"
					placeholder={$LL.users_page.key_placeholder()}
					bind:value={assignKey}
					onkeydown={(e) => { if (e.key === 'Enter') confirmAssign(); if (e.key === 'Escape') closeAssignModal(); }}
				/>
			</div>
			<div class="modal-actions">
				<button type="button" class="btn-cancel" onclick={closeAssignModal}>{$LL.users_page.cancel()}</button>
				<button type="button" class="btn-confirm" onclick={confirmAssign}>{$LL.users_page.assign()}</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.user-detail { display: flex; flex-direction: column; gap: 0.6rem; min-width: 580px; max-width: 780px; }
	.section-title { margin: 0.25rem 0 0.5rem; font-size: 0.95rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; }
	.badge { background: #e5e7eb; color: #374151; border-radius: 99px; padding: 0.1rem 0.55rem; font-size: 0.75rem; font-weight: 600; }

	.role-panels { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
	.role-panel { display: flex; flex-direction: column; gap: 0.4rem; }

	.panel-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem; }
	.panel-title { font-size: 0.82rem; font-weight: 600; color: #374151; white-space: nowrap; }
	.search-input {
		flex: 1;
		padding: 0.25rem 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 5px;
		font-size: 0.82rem;
		outline: none;
	}
	.search-input:focus { border-color: #6366f1; }

	.role-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.25rem; max-height: 260px; overflow-y: auto; }
	.role-item {
		display: flex;
		flex-direction: column;
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
	}
	.role-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.35rem 0.6rem;
	}
	.role-info { display: flex; flex-direction: column; gap: 0.1rem; flex: 1; min-width: 0; }
	.role-name { font-size: 0.85rem; font-weight: 600; color: #1e293b; truncate: ellipsis; overflow: hidden; white-space: nowrap; }
	.role-key {
		font-size: 0.72rem;
		color: #0369a1;
		background: #e0f2fe;
		border-radius: 99px;
		padding: 0.05rem 0.45rem;
		width: fit-content;
	}
	.role-desc { font-size: 0.75rem; color: #6b7280; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
	.role-empty { font-size: 0.82rem; color: #9ca3af; padding: 0.4rem 0.2rem; }

	.btn-perm {
		flex-shrink: 0;
		background: none;
		border: 1px solid #d1d5db;
		color: #6b7280;
		border-radius: 4px;
		width: 1.5rem;
		height: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.85rem;
		cursor: pointer;
		line-height: 1;
	}
	.btn-perm:hover, .btn-perm.active { background: #ede9fe; color: #5b21b6; border-color: #c4b5fd; }

	.perm-inline {
		border-top: 1px solid #e5e7eb;
		background: #fff;
		padding: 0.35rem 0.6rem;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.perm-inline-msg { font-size: 0.75rem; color: #9ca3af; }
	.perm-row { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
	.perm-resource { font-family: monospace; font-size: 0.75rem; color: #1e293b; flex-shrink: 0; }
	.perm-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 0.2rem; }
	.perm-badge { font-size: 0.62rem; font-weight: 700; border-radius: 3px; padding: 0.05rem 0.3rem; white-space: nowrap; }
	.perm-badge--read   { background: #dbeafe; color: #1d4ed8; }
	.perm-badge--create { background: #dcfce7; color: #15803d; }
	.perm-badge--update { background: #fef9c3; color: #a16207; }
	.perm-badge--delete { background: #fee2e2; color: #b91c1c; }
	.perm-badge--admin  { background: #f3e8ff; color: #7e22ce; }
	.perm-raw { font-size: 0.68rem; color: #9ca3af; font-family: monospace; }

	.btn-unassign {
		flex-shrink: 0;
		background: none;
		border: 1px solid #fca5a5;
		color: #dc2626;
		border-radius: 4px;
		width: 1.5rem;
		height: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		cursor: pointer;
		line-height: 1;
	}
	.btn-unassign:hover { background: #fee2e2; }

	.btn-assign {
		flex-shrink: 0;
		background: none;
		border: 1px solid #6ee7b7;
		color: #059669;
		border-radius: 4px;
		width: 1.5rem;
		height: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1rem;
		cursor: pointer;
		line-height: 1;
	}
	.btn-assign:hover { background: #d1fae5; }

	.mono { font-family: monospace; }

	/* Assign key modal */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0,0,0,0.35);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}
	.assign-modal {
		background: #fff;
		border-radius: 10px;
		padding: 1.5rem;
		min-width: 320px;
		max-width: 400px;
		width: 100%;
		box-shadow: 0 8px 32px rgba(0,0,0,0.18);
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.modal-title { margin: 0; font-size: 1rem; font-weight: 700; }
	.modal-role-name {
		margin: 0;
		font-size: 0.88rem;
		font-weight: 600;
		color: #5b21b6;
		background: #ede9fe;
		border-radius: 6px;
		padding: 0.3rem 0.7rem;
		width: fit-content;
	}
	.modal-field { display: flex; flex-direction: column; gap: 0.3rem; }
	.modal-field label { font-size: 0.85rem; font-weight: 500; }
	.optional { font-weight: 400; color: #9ca3af; font-size: 0.8rem; }
	.modal-field input {
		padding: 0.45rem 0.6rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 0.9rem;
		outline: none;
	}
	.modal-field input:focus { border-color: #6366f1; box-shadow: 0 0 0 2px #e0e7ff; }
	.modal-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.25rem; }
	.btn-cancel {
		padding: 0.4rem 1rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		background: #fff;
		color: #374151;
		font-size: 0.875rem;
		cursor: pointer;
	}
	.btn-cancel:hover { background: #f3f4f6; }
	.btn-confirm {
		padding: 0.4rem 1rem;
		border: none;
		border-radius: 6px;
		background: #6366f1;
		color: #fff;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
	}
	.btn-confirm:hover { background: #4f46e5; }
</style>


