import type { LayoutServerLoad } from './$types';
import { cookiePrefix } from '@dn-fe/ui/session';

export const load: LayoutServerLoad = async ({ locals, cookies, url }) => {
	let authResources: string[] = [];
	try {
		const prefix = cookiePrefix(url);
		const raw = cookies.get(`${prefix}resources`);
		if (raw) authResources = JSON.parse(raw);
	} catch {
		authResources = [];
	}

	return {
		user: locals.user,
		authResources
	};
};
