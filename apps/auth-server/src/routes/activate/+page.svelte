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

<div class="auth-page">
	<div class="auth-card">
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
	/* OTP code input: large centered with letter spacing */
	.field input { font-size: 1.1rem; letter-spacing: 0.2em; text-align: center; }
</style>
