import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	return {
		typeCode: params.type_code,
		itemId: params.item_id
	};
};
