import { fail, redirect } from '@sveltejs/kit';
import { api } from '$lib/api';

export async function load({ url }) {
	const userId = url.searchParams.get('user_id');
	if (!userId) return { userId: null };
	return { userId };
}

export const actions = {
	default: async ({ request, url }) => {
		const form = await request.formData();
		const userId = form.get('user_id') as string;
		const code = form.get('code') as string;

		const res = await api('/public/signup/active', {
			method: 'POST',
			body: { user_id: userId, code },
			origin: url.origin
		});

		if (res.status !== 200) {
			return fail(res.status, { error: res.data?.data?.error_type || 'failed' });
		}

		const { auth_code, redirect_uri } = res.data.data;
		const clientId = form.get('client_id') as string;

		const target = new URL(redirect_uri);
		target.searchParams.set('auth_code', auth_code);
		target.searchParams.set('client_id', clientId);
		redirect(303, target.toString());
	}
};
