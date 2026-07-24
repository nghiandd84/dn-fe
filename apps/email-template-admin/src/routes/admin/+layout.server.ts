import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	let emailTemplateResources: string[] = [];
	try {
		const raw = cookies.get('email_template_resources');
		if (raw) emailTemplateResources = JSON.parse(raw);
	} catch {
		emailTemplateResources = [];
	}

	return {
		user: locals.user ?? null,
		emailTemplateResources
	};
};
