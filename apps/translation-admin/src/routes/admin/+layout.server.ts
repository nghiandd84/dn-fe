import type { LayoutServerLoad } from './$types';
import { cookiePrefix } from '@dn-fe/ui/session';

export const load: LayoutServerLoad = async ({ locals, cookies, url }) => {
	let translationResources: string[] = [];
	try {
		const prefix = cookiePrefix(url);
		const raw = cookies.get(`${prefix}resources`);
		if (raw) translationResources = JSON.parse(raw);
	} catch {
		translationResources = [];
	}

	return {
		user: locals.user ?? null,
		translationResources
	};
};
