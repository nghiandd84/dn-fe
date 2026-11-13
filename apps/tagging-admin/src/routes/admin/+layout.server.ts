import type { LayoutServerLoad } from './$types';
import { cookiePrefix } from '@dn-fe/ui/session';

export const load: LayoutServerLoad = async ({ locals, cookies, url }) => {
	const prefix = cookiePrefix(url);

	let taggingResources: string[] = [];
	try {
		const raw = cookies.get(`${prefix}resources`);
		if (raw) taggingResources = JSON.parse(raw);
	} catch {
		taggingResources = [];
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
		taggingResources,
		authMasks
	};
};
