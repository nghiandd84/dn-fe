<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { fingerprint } from '$lib/fingerprint';
	import { LL, setLocale, locale } from '$i18n/i18n-util';
	import type { Locales } from '$i18n/i18n-util';

	const { validated, validationError } = $page.data;
	const requestId = $derived($page.data.requestId);

	const params = $derived($page.url.searchParams);
	const clientId = $derived(params.get('client_id') || '');
	const rawScope = $derived(params.get('scope') || '');
	const redirectUrl = $derived(params.get('redirect_url') || '');
	const screenParam = $derived(params.get('screen') || '');

	const hasClientId = $derived(!!clientId);
	const isValid = $derived(hasClientId && validated);
	const serverError = $derived(hasClientId && !validated ? validationError : '');
	const isAdminMode = $derived(!!clientId && !rawScope && !redirectUrl && !screenParam);

	let screen = $state($page.url.searchParams.get('screen') || 'login');
	let language = $state('en-US');
	let error = $state($page.form?.error || '');
	let fp = $state('');

	$effect(() => { error = $page.form?.error || ''; });
	$effect(() => { fp = $fingerprint; });

	function switchScreen(s: string) {
		screen = s;
		error = '';
	}

	function switchLocale(lang: Locales) {
		setLocale(lang);
	}
</script>

{#if !isValid}
	<div class="error-page">
		<div class="error-card">
			<div class="lang-switcher">
				<button class:active={$locale === 'en-US'} onclick={() => switchLocale('en-US')}>EN</button>
				<button class:active={$locale === 'vi-VN'} onclick={() => switchLocale('vi-VN')}>VI</button>
			</div>
			<h1>{$LL.authenticate.error_title()}</h1>
			<p>{serverError ? $LL.authenticate.validation_failed() + serverError : $LL.authenticate.missing_params()}</p>
		</div>
	</div>
{:else}
	<div class="auth-page">
		<div class="auth-card">
			<div class="lang-switcher">
				<button class:active={$locale === 'en-US'} onclick={() => switchLocale('en-US')}>EN</button>
				<button class:active={$locale === 'vi-VN'} onclick={() => switchLocale('vi-VN')}>VI</button>
			</div>
			<h1>{screen === 'login' ? $LL.authenticate.login() : $LL.authenticate.signup()}</h1>
			{#if error}
				{#if error === 'no_permission'}<p class="error">{$LL.authenticate.no_permission()}</p>
				{:else}<p class="error">{error}</p>{/if}
			{/if}
			<form method="POST" action="?/{screen}" use:enhance onsubmit={() => { if (screen === 'signup') sessionStorage.setItem('client_id', clientId); }}>
				<input type="hidden" name="state" value={requestId} />
				<input type="hidden" name="isAdminMode" value={String(isAdminMode)} />
				<input type="hidden" name="fingerprint" value={fp} />
				<input type="hidden" name="client_id" value={clientId} />
				<div class="field">
					<label for="email">{$LL.authenticate.email()}</label>
					<input id="email" name="email" type="email" required />
				</div>
				<div class="field">
					<label for="password">{$LL.authenticate.password()}</label>
					<input id="password" name="password" type="password" required />
				</div>
				{#if screen === 'signup'}
					<div class="field">
						<label for="language">{$LL.authenticate.language_label()}</label>
						<select id="language" name="language" bind:value={language}>
							<option value="en-US">English</option>
							<option value="vi-VN">Tiếng Việt</option>
						</select>
					</div>
				{/if}
				<button type="submit" class="btn-submit">{screen === 'login' ? $LL.authenticate.login() : $LL.authenticate.signup()}</button>
			</form>
			{#if !isAdminMode}
				{#if screen === 'login'}
					<p class="link">{$LL.authenticate.no_account()} <button class="link-btn" onclick={() => switchScreen('signup')}>{$LL.authenticate.switch_signup()}</button></p>
				{:else}
					<p class="link">{$LL.authenticate.has_account()} <button class="link-btn" onclick={() => switchScreen('login')}>{$LL.authenticate.switch_login()}</button></p>
				{/if}
			{/if}
		</div>
	</div>
{/if}

<style>
	.auth-page, .error-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
	.auth-card, .error-card { background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
	.error-card h1 { color: #dc2626; margin-bottom: 1rem; }
	.error-card p { color: #555; }
	.lang-switcher { display: flex; justify-content: flex-end; gap: 0.3rem; margin-bottom: 1rem; }
	.lang-switcher button { padding: 0.3rem 0.6rem; border: 1px solid #ddd; border-radius: 4px; background: #fff; cursor: pointer; font-size: 0.8rem; }
	.lang-switcher button.active { background: #4f46e5; color: #fff; border-color: #4f46e5; }
	h1 { margin-bottom: 1.5rem; text-align: center; }
	.field { margin-bottom: 1rem; }
	.field label { display: block; margin-bottom: 0.3rem; font-weight: 500; }
	.field input, .field select { width: 100%; padding: 0.6rem; border: 1px solid #ddd; border-radius: 4px; }
	.btn-submit { width: 100%; padding: 0.7rem; background: #4f46e5; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; }
	.btn-submit:hover { background: #4338ca; }
	.error { color: #dc2626; margin-bottom: 1rem; text-align: center; }
	.link { margin-top: 1rem; text-align: center; font-size: 0.9rem; }
	.link-btn { background: none; border: none; color: #4f46e5; cursor: pointer; font-size: 0.9rem; text-decoration: underline; }
</style>
