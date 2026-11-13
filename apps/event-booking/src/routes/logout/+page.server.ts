import { redirect } from '@sveltejs/kit';
import { clearToken } from '@dn-fe/ui/session';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies, url }) => {
	// Match the port-scoped cookie set by the OAuth callback.
	clearToken(cookies, url);
	throw redirect(302, '/');
};
