import type { LayoutServerLoad } from './$types';
import { api } from '$lib/api';

export const load: LayoutServerLoad = async ({ params, locals, url }) => {
	const res = await api(`/projects/${params.id}`, {
		token: locals.token,
		origin: url.origin
	});

	const project = res.status === 200 ? (res.data?.data ?? null) : null;

	return { project };
};
