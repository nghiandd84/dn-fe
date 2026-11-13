<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { LL, setLocale, locale } from '$i18n/i18n-util';
	import type { Locales } from '$i18n/i18n-util';

	const { userId, clientId } = $page.data;
	let error = $state($page.form?.error || '');
	$effect(() => { error = $page.form?.error || ''; });
</script>

<div class="auth-page">
	<div class="auth-card">
		<div class="lang-switcher">
			<button class:active={$locale === 'en-US'} onclick={() => setLocale('en-US' as Locales)}>EN</button>
			<button class:active={$locale === 'vi-VN'} onclick={() => setLocale('vi-VN' as Locales)}>VI</button>
		</div>

		{#if !userId}
			<p class="error">{$LL.login_verify.invalid_user()}</p>
		{:else}
			<h1>{$LL.login_verify.title()}</h1>
			<p class="desc">{$LL.login_verify.description()}</p>
			{#if error}<p class="error">{error}</p>{/if}
			<form method="POST" use:enhance>
				<input type="hidden" name="user_id" value={userId} />
				<input type="hidden" name="client_id" value={clientId} />
				<div class="field">
					<label for="login_code">{$LL.login_verify.code_label()}</label>
					<input id="login_code" name="login_code" type="text" required autocomplete="one-time-code" />
				</div>
				<button type="submit" class="btn-submit">{$LL.login_verify.submit()}</button>
			</form>
		{/if}
	</div>
</div>

<style>
	/* OTP code input: large centered with letter spacing */
	.field input { font-size: 1.1rem; letter-spacing: 0.2em; text-align: center; }
</style>
