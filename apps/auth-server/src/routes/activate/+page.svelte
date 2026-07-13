<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { LL, setLocale, locale } from '$i18n/i18n-util';
	import type { Locales } from '$i18n/i18n-util';

	const { userId } = $page.data;

	let error = $state($page.form?.error || '');
	let clientId = $state('');

	$effect(() => { error = $page.form?.error || ''; });
	$effect(() => { clientId = sessionStorage.getItem('client_id') || ''; });
</script>

<div class="page">
	<div class="card">
		<div class="lang-switcher">
			<button class:active={$locale === 'en-US'} onclick={() => setLocale('en-US' as Locales)}>EN</button>
			<button class:active={$locale === 'vi-VN'} onclick={() => setLocale('vi-VN' as Locales)}>VI</button>
		</div>

		{#if !userId}
			<p class="error">{$LL.activate.invalid_user()}</p>
		{:else}
			<h1>{$LL.activate.title()}</h1>
			<p class="desc">{$LL.activate.description()}</p>
			{#if error}
				<p class="error">{$LL.activate.failed()}</p>
			{/if}
			<form method="POST" use:enhance>
				<input type="hidden" name="user_id" value={userId} />
				<input type="hidden" name="client_id" value={clientId} />
				<div class="field">
					<label for="code">{$LL.activate.code_label()}</label>
					<input id="code" name="code" type="text" required autocomplete="one-time-code" />
				</div>
				<button type="submit" class="btn-submit">{$LL.activate.submit()}</button>
			</form>
		{/if}
	</div>
</div>

<style>
	.page { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
	.card { background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
	.lang-switcher { display: flex; justify-content: flex-end; gap: 0.3rem; margin-bottom: 1rem; }
	.lang-switcher button { padding: 0.3rem 0.6rem; border: 1px solid #ddd; border-radius: 4px; background: #fff; cursor: pointer; font-size: 0.8rem; }
	.lang-switcher button.active { background: #4f46e5; color: #fff; border-color: #4f46e5; }
	h1 { margin-bottom: 0.5rem; text-align: center; }
	.desc { color: #555; text-align: center; margin-bottom: 1.5rem; font-size: 0.9rem; }
	.field { margin-bottom: 1rem; }
	.field label { display: block; margin-bottom: 0.3rem; font-weight: 500; }
	.field input { width: 100%; padding: 0.6rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1.1rem; letter-spacing: 0.2em; text-align: center; }
	.btn-submit { width: 100%; padding: 0.7rem; background: #4f46e5; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; }
	.btn-submit:hover { background: #4338ca; }
	.error { color: #dc2626; margin-bottom: 1rem; text-align: center; }
</style>
