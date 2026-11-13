import type { PageServerLoad } from './$types';
import { api } from '$lib/api';

export const load: PageServerLoad = async ({ params, locals, url }) => {
	let itemCode = '';
	let itemName = '';

	try {
		const res = await api(`/lookup-types/${params.type_code}/items/${params.item_id}`, {
			token: locals.token,
			origin: url.origin
		});
		if (res.status === 200) {
			itemCode = res.data?.data?.code ?? '';
			itemName = res.data?.data?.name ?? '';
		}
	} catch {
		// fallback to empty — page still works
	}

	return {
		typeCode: params.type_code,
		itemId: params.item_id,
		itemCode,
		itemName,
		from: url.searchParams.get('from') ?? null
	};
};
