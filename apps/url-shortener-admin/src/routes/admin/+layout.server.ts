import type { LayoutServerLoad } from './$types';
import { cookiePrefix } from '@dn-fe/ui/session';

export const load: LayoutServerLoad = async ({ locals, cookies, url }) => {
	let urlShortenerResources: string[] = [];
	try {
		const prefix = cookiePrefix(url);
		const raw = cookies.get(`${prefix}resources`);
		if (raw) urlShortenerResources = JSON.parse(raw);
	} catch {
		urlShortenerResources = [];
	}

	return {
		user: locals.user ?? null,
		urlShortenerResources
	};
};
