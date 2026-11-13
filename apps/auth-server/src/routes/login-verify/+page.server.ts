import { fail, redirect } from '@sveltejs/kit';
import { api } from '$lib/api';

export async function load({ url }) {
	const userId = url.searchParams.get('user_id');
	const clientId = url.searchParams.get('client_id') || '';
	if (!userId) return { userId: null, clientId };
	return { userId, clientId };
}

export const actions = {
	default: async ({ request, url }) => {
		const form = await request.formData();
		const userId = form.get('user_id') as string;
		const loginCode = form.get('login_code') as string;
		const clientId = form.get('client_id') as string;

		const res = await api('/public/login/code', {
			method: 'POST',
			body: { user_id: userId, login_code: loginCode },
			origin: url.origin
		});

		if (res.status !== 200) {
			return fail(res.status, { error: res.data?.data?.error_type || 'invalid_code' });
		}

		const { auth_code, redirect_uri } = res.data.data;
		const target = new URL(redirect_uri);
		target.searchParams.set('auth_code', auth_code);
		target.searchParams.set('client_id', clientId);
		redirect(303, target.toString());
	}
};
