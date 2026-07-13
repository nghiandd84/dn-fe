import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { api } from '$lib/api';
import { setToken } from '$lib/session';

export const POST: RequestHandler = async ({ request, cookies, url }) => {
	const body = await request.json();
	const fingerprint = request.headers.get('x-client-fingerprint') || undefined;

	const res = await api('/public/requests/login', {
		method: 'POST',
		body: { email: body.email, password: body.password, state: body.state },
		fingerprint,
		origin: url.origin
	});

	if (res.status === 200) {
		setToken(cookies, res.data.data.id_token);
	}

	return json(res.data, { status: res.status });
};
