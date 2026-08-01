import type { LayoutServerLoad } from './$types';
import { cookiePrefix } from '@dn-fe/ui/session';

export const load: LayoutServerLoad = async ({ locals, cookies, url }) => {
	let eventResources: string[] = [];
	try {
		const prefix = cookiePrefix(url);
		const raw = cookies.get(`${prefix}resources`);
		if (raw) eventResources = JSON.parse(raw);
	} catch {
		eventResources = [];
	}

	return {
		user: locals.user ?? null,
		eventResources
	};
};
