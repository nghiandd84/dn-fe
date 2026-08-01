import type { LayoutServerLoad } from './$types';
import { cookiePrefix } from '@dn-fe/ui/session';

export const load: LayoutServerLoad = async ({ locals, cookies, url }) => {
	let lookupResources: string[] = [];
	try {
		const prefix = cookiePrefix(url);
		const raw = cookies.get(`${prefix}resources`);
		if (raw) lookupResources = JSON.parse(raw);
	} catch {
		lookupResources = [];
	}

	return {
		user: locals.user ?? null,
		lookupResources
	};
};
