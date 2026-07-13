<script lang="ts">
	import { fingerprint } from '$lib/fingerprint';
	import { get } from 'svelte/store';

	let email = $state('');
	let password = $state('');
	let language = $state('en-US');
	let error = $state('');

	async function handleRegister(e: Event) {
		e.preventDefault();
		error = '';
		const res = await fetch('/api/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'X-Client-Fingerprint': get(fingerprint) },
			body: JSON.stringify({ email, password, language })
		});
		const data = await res.json();
		if (res.ok) {
			window.location.href = '/admin';
		} else {
			error = data.data?.error_type || 'Registration failed';
		}
	}
</script>

<div class="auth-page">
	<div class="auth-card">
		<h1>Register</h1>
		{#if error}<p class="error">{error}</p>{/if}
		<form onsubmit={handleRegister}>
			<div class="field">
				<label for="email">Email</label>
				<input id="email" type="email" bind:value={email} required />
			</div>
			<div class="field">
				<label for="password">Password</label>
				<input id="password" type="password" bind:value={password} required />
			</div>
			<div class="field">
				<label for="language">Language</label>
				<select id="language" bind:value={language}>
					<option value="en-US">English</option>
					<option value="vi-VN">Tiếng Việt</option>
				</select>
			</div>
			<button type="submit" class="btn-submit">Register</button>
		</form>
		<p class="link">Already have an account? <a href="/authenticate">Login</a></p>
	</div>
</div>

<style>
	.auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
	.auth-card { background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
	h1 { margin-bottom: 1.5rem; text-align: center; }
	.field { margin-bottom: 1rem; }
	.field label { display: block; margin-bottom: 0.3rem; font-weight: 500; }
	.field input, .field select { width: 100%; padding: 0.6rem; border: 1px solid #ddd; border-radius: 4px; }
	.btn-submit { width: 100%; padding: 0.7rem; background: #4f46e5; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; }
	.btn-submit:hover { background: #4338ca; }
	.error { color: #dc2626; margin-bottom: 1rem; text-align: center; }
	.link { margin-top: 1rem; text-align: center; font-size: 0.9rem; }
</style>
