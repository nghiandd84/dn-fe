import type { LayoutServerLoad } from './$types';
import { cookiePrefix } from '@dn-fe/ui/session';

export const load: LayoutServerLoad = async ({ locals, cookies, url }) => {
	let emailTemplateResources: string[] = [];
	try {
		const prefix = cookiePrefix(url);
		const raw = cookies.get(`${prefix}resources`);
		if (raw) emailTemplateResources = JSON.parse(raw);
	} catch {
		emailTemplateResources = [];
	}

	return {
		user: locals.user ?? null,
		emailTemplateResources
	};
};
