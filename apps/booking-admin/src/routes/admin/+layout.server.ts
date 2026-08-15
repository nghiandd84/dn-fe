import type { LayoutServerLoad } from './$types';
import { cookiePrefix } from '@dn-fe/ui/session';

export const load: LayoutServerLoad = async ({ locals, cookies, url }) => {
	const prefix = cookiePrefix(url);

	let bookingResources: string[] = [];
	try {
		const raw = cookies.get(`${prefix}resources`);
		if (raw) bookingResources = JSON.parse(raw);
	} catch {
		bookingResources = [];
	}

	let authMasks: Record<string, number> = {};
	try {
		const raw = cookies.get(`${prefix}auth_masks`);
		if (raw) authMasks = JSON.parse(raw);
	} catch {
		authMasks = {};
	}

	return {
		user: locals.user ?? null,
		bookingResources,
		authMasks
	};
};
