<script lang="ts">
	import { LL, setLocale, locale } from '$i18n/i18n-util';
	import type { Locales } from '$i18n/i18n-util';
	import '@dn-fe/ui/styles/auth-page.css';

	let { data } = $props();

	function switchLocale(lang: Locales) {
		setLocale(lang);
	}
</script>

{#if !data.valid}
	<div class="auth-page">
		<div class="auth-card error-card">
			<div class="lang-switcher">
				<button class:active={$locale === 'en-US'} onclick={() => switchLocale('en-US')}>EN</button>
				<button class:active={$locale === 'vi-VN'} onclick={() => switchLocale('vi-VN')}>VI</button>
			</div>
			<h1>{$LL.authenticate.error_title()}</h1>
			<p>{$LL.authenticate.missing_params()}</p>
		</div>
	</div>
{:else}
	<div class="auth-page">
		<div class="auth-card">
			<div class="lang-switcher">
				<button class:active={$locale === 'en-US'} onclick={() => switchLocale('en-US')}>EN</button>
				<button class:active={$locale === 'vi-VN'} onclick={() => switchLocale('vi-VN')}>VI</button>
			</div>
			<h1>{$LL.authenticate.welcome_title()}</h1>
			<p class="desc">{$LL.authenticate.welcome_desc()}</p>
			<div class="btn-group">
				<a href={data.loginUrl} class="btn-login">{$LL.authenticate.login()}</a>
				<a href={data.signupUrl} class="btn-signup">{$LL.authenticate.signup()}</a>
			</div>
		</div>
	</div>
{/if}

