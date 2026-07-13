import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	let authResources: string[] = [];
	try {
		const raw = cookies.get('auth_resources');
		if (raw) authResources = JSON.parse(raw);
	} catch {
		authResources = [];
	}

	return {
		user: locals.user,
		authResources
	};
};
