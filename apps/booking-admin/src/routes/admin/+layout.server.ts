import type { LayoutServerLoad } from './$types';
import { cookiePrefix } from '@dn-fe/ui/session';

export const load: LayoutServerLoad = async ({ locals, cookies, url }) => {
	let bookingResources: string[] = [];
	try {
		const prefix = cookiePrefix(url);
		const raw = cookies.get(`${prefix}resources`);
		if (raw) bookingResources = JSON.parse(raw);
	} catch {
		bookingResources = [];
	}

	return {
		user: locals.user ?? null,
		bookingResources
	};
};
