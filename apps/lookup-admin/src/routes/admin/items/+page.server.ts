import type { PageServerLoad } from './$types';
import { api } from '$lib/api';

export const load: PageServerLoad = async ({ locals, url }) => {
	let lookupTypes: { code: string; name: string }[] = [];

	try {
		const allRows: any[] = [];
		let currentPage = 1;
		let totalPages = 1;
		do {
			const res = await api('/lookup-types', {
				params: new URLSearchParams({ page: String(currentPage), page_size: '10' }),
				token: locals.token,
				origin: url.origin
			});
			if (res.status === 200) {
				allRows.push(...(res.data?.data?.result || []));
				totalPages = res.data?.data?.total_page || 1;
			} else {
				break;
			}
			currentPage++;
		} while (currentPage <= totalPages);

		lookupTypes = allRows.map((t: any) => ({ code: t.code, name: t.name }));
	} catch {
		lookupTypes = [];
	}

	return { lookupTypes };
};
