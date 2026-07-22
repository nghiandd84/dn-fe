<script lang="ts">
	import { LL, setLocale, locale } from '$i18n/i18n-util';
	import type { Locales } from '$i18n/i18n-util';

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

<style>
	.auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
	.auth-card { background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
	.error-card h1 { color: #dc2626; margin-bottom: 1rem; }
	.error-card p { color: #555; }
	.lang-switcher { display: flex; justify-content: flex-end; gap: 0.3rem; margin-bottom: 1rem; }
	.lang-switcher button { padding: 0.3rem 0.6rem; border: 1px solid #ddd; border-radius: 4px; background: #fff; cursor: pointer; font-size: 0.8rem; }
	.lang-switcher button.active { background: #4f46e5; color: #fff; border-color: #4f46e5; }
	h1 { margin-bottom: 0.5rem; text-align: center; }
	.desc { color: #555; text-align: center; margin-bottom: 2rem; font-size: 0.95rem; }
	.btn-group { display: flex; flex-direction: column; gap: 0.75rem; }
	.btn-login, .btn-signup {
		display: block;
		width: 100%;
		padding: 0.75rem;
		border-radius: 4px;
		font-size: 1rem;
		font-weight: 500;
		text-align: center;
		text-decoration: none;
		cursor: pointer;
		box-sizing: border-box;
	}
	.btn-login { background: #4f46e5; color: #fff; border: 2px solid #4f46e5; }
	.btn-login:hover { background: #4338ca; border-color: #4338ca; text-decoration: none; }
	.btn-signup { background: #fff; color: #4f46e5; border: 2px solid #4f46e5; }
	.btn-signup:hover { background: #eef2ff; text-decoration: none; }
</style>
