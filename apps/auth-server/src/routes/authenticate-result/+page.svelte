<script lang="ts">
	import { page } from '$app/stores';
	import { LL } from '$i18n/i18n-util';

	const { error, access_token, refresh_token, permissions } = $page.data;

	$effect(() => {
		if (access_token) sessionStorage.setItem('access_token', access_token);
		if (refresh_token) sessionStorage.setItem('refresh_token', refresh_token);
	});
</script>

<div class="page">
	<div class="card">
		{#if error}
			<div class="icon error-icon">✕</div>
			<h1 class="error-title">{$LL.authenticate_result.title_failed()}</h1>
			<p class="error-msg">{error}</p>
		{:else}
			<div class="icon success-icon">✓</div>
			<h1>{$LL.authenticate_result.title_success()}</h1>
			<div class="token-block">
				<span class="token-label">{$LL.authenticate_result.access_token()}</span>
				<code>{access_token}</code>
			</div>
			<div class="token-block">
				<span class="token-label">{$LL.authenticate_result.refresh_token()}</span>
				<code>{refresh_token}</code>
			</div>
			{#if permissions?.length}
			<div class="permissions">
				<span class="token-label">{$LL.authenticate_result.permissions()}</span>
				<table>
					<thead>
						<tr>
							<th>{$LL.authenticate_result.col_resource()}</th>
							<th>{$LL.authenticate_result.col_mask()}</th>
							<th>{$LL.authenticate_result.col_description()}</th>
						</tr>
					</thead>
					<tbody>
						{#each permissions as p}
							<tr><td>{p.resource}</td><td>{p.mask}</td><td>{p.description}</td></tr>
						{/each}
					</tbody>
				</table>
			</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	/* Page-specific styles for the result display */
	.page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f5f5f5; }
	.card { background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); width: 100%; max-width: 480px; text-align: center; }
	.icon { font-size: 3rem; margin-bottom: 1rem; }
	.success-icon { color: #16a34a; }
	.error-icon { color: #dc2626; }
	h1 { margin-bottom: 1.5rem; font-size: 1.4rem; }
	.error-title { color: #dc2626; }
	.error-msg { color: #555; }
	.token-block { text-align: left; margin-bottom: 1rem; }
	.token-label { display: block; font-weight: 600; font-size: 0.8rem; color: #555; margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.05em; }
	.token-block code { display: block; background: #f3f4f6; padding: 0.6rem; border-radius: 4px; font-size: 0.75rem; word-break: break-all; color: #1f2937; }
	.permissions { text-align: left; margin-top: 1.5rem; }
	table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
	th, td { padding: 0.4rem 0.6rem; border: 1px solid #e5e7eb; text-align: left; }
	th { background: #f3f4f6; font-weight: 600; }
</style>
