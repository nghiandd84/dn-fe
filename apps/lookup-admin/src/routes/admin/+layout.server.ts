import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	let lookupResources: string[] = [];
	try {
		const raw = cookies.get('lookup_resources');
		if (raw) lookupResources = JSON.parse(raw);
	} catch {
		lookupResources = [];
	}

	return {
		user: locals.user ?? null,
		lookupResources
	};
};
