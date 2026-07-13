import { fail, redirect } from '@sveltejs/kit';
import { api } from '$lib/api';

export async function load({ url, cookies }) {
	const clientId = url.searchParams.get('client_id') || '';
	const rawScopes = url.searchParams.get('scopes') || '';
	const redirectUrl = url.searchParams.get('redirect_url') || '';
	const state = url.searchParams.get('state') || '';

	const res = await api('/public/requests/code', {
		method: 'POST',
		body: {
			client_id: clientId || null,
			redirect_uri: redirectUrl || null,
			response_type: 'code',
			scopes: rawScopes ? rawScopes.split(',') : null,
			state: state || null,
		},
		origin: url.origin
	});

	if (res.status !== 200) {
		return { validationError: res.data?.data?.error_type || 'Invalid request parameters', validated: false };
	}

	// Save the original authenticate URL so logout can redirect back to it
	if (clientId) {
		const authUrl = url.pathname + url.search;
		cookies.set('auth_login_url', authUrl, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 60 * 60 * 24 * 7
		});
	}

	return { validationError: null, validated: true, requestId: res.data.data.id };
}

export const actions = {
	login: async ({ request, url }) => {
		const form = await request.formData();
		const email = form.get('email') as string;
		const password = form.get('password') as string;
		const state = form.get('state') as string;
		const fingerprint = form.get('fingerprint') as string || undefined;
		const clientId = form.get('client_id') as string;

		const res = await api('/public/requests/login', {
			method: 'POST',
			body: { email, password, state },
			fingerprint,
			origin: url.origin
		});

		if (res.status !== 200) {
			return fail(res.status, { error: res.data?.data?.error_type || 'Login failed' });
		}

		redirect(303, `/login-verify?user_id=${res.data.data.user_id}&client_id=${clientId}`);
	},

	signup: async ({ request, cookies, url }) => {
		const form = await request.formData();
		const email = form.get('email') as string;
		const password = form.get('password') as string;
		const language = form.get('language') as string;
		const state = form.get('state') as string;
		const fingerprint = form.get('fingerprint') as string || undefined;

		console.log('')

		const res = await api('/public/requests/register', {
			method: 'POST',
			body: { email, password, language, state },
			fingerprint,
			origin: url.origin
		});

		if (res.status !== 200) {
			return fail(res.status, { error: res.data?.data?.error_type || 'Registration failed' });
		}

		redirect(303, `/activate?user_id=${res.data.data.user_id}`);
	}
};
