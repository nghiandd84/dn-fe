<script lang="ts">
	interface Props {
		/** Href for the My Account link */
		accountHref?: string;
		/** Label for the My Account button */
		accountLabel?: string;
		/** Label for the logout button */
		logoutLabel?: string;
		/** Called when the user clicks Logout */
		onLogout: () => void;
		/** Currently active locale, e.g. 'en-US' */
		locale: string;
		/** Called when the user picks a locale */
		onLocaleChange: (locale: string) => void;
		/** Supported locales — array of { value, label } */
		locales?: { value: string; label: string }[];
	}

	let {
		accountHref = '/account',
		accountLabel = 'My Account',
		logoutLabel = 'Logout',
		onLogout,
		locale,
		onLocaleChange,
		locales = [
			{ value: 'en-US', label: 'EN' },
			{ value: 'vi-VN', label: 'VI' }
		]
	}: Props = $props();
</script>

<div class="sidebar-footer">
	<a href={accountHref} class="account-btn">{accountLabel}</a>

	<div class="lang-switcher">
		{#each locales as loc}
			<button
				class:active={locale === loc.value}
				onclick={() => onLocaleChange(loc.value)}
			>
				{loc.label}
			</button>
		{/each}
	</div>

	<button class="logout-btn" onclick={onLogout}>
		{logoutLabel}
	</button>
</div>

<style>
	.sidebar-footer {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: auto;
		padding-top: 1rem;
		border-top: 1px solid #3730a3;
	}

	.account-btn {
		display: block;
		padding: 0.4rem 0.7rem;
		border: 1px solid #4338ca;
		border-radius: 4px;
		color: #c7d2fe;
		font-size: 0.8rem;
		font-weight: 600;
		text-align: center;
		text-decoration: none;
	}

	.account-btn:hover {
		background: #3730a3;
		color: #fff;
	}

	.lang-switcher {
		display: flex;
		gap: 0.4rem;
	}

	.lang-switcher button {
		flex: 1;
		padding: 0.3rem 0;
		border: 1px solid #4338ca;
		border-radius: 4px;
		background: none;
		color: #a5b4fc;
		cursor: pointer;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.lang-switcher button:hover { background: #3730a3; color: #fff; }
	.lang-switcher button.active { background: #4f46e5; color: #fff; border-color: #4f46e5; }

	.logout-btn {
		width: 100%;
		padding: 0.4rem 0;
		border: 1px solid #7f1d1d;
		border-radius: 4px;
		background: none;
		color: #fca5a5;
		cursor: pointer;
		font-size: 0.8rem;
		font-weight: 600;
	}

	.logout-btn:hover { background: #7f1d1d; color: #fff; border-color: #7f1d1d; }
</style>
