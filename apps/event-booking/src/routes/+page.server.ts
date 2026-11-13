import type { PageServerLoad } from './$types';
import type { ApiEnvelope, EventData, QueryResult } from '$lib/types';

// Browse events. The backend /public/events endpoint exposes ordering +
// pagination only (no status filter param), so we page through all results
// (page_size capped at 20 per the pagination convention) and filter to
// bookable statuses client-side.
export const load: PageServerLoad = async ({ fetch }) => {
	const all: EventData[] = [];
	let currentPage = 1;
	let totalPages = 1;
	let ok = true;

	do {
		const params = new URLSearchParams({
			order_name: 'event_date',
			order_direction: 'asc',
			page: String(currentPage),
			page_size: '20'
		});

		const res = await fetch(`/api/event/events?${params}`);
		if (!res.ok) {
			ok = false;
			break;
		}

		const body = (await res.json()) as ApiEnvelope<QueryResult<EventData>>;
		all.push(...(body?.data?.result ?? []));
		totalPages = body?.data?.total_page || 1;
		currentPage++;
	} while (currentPage <= totalPages);

	// Show only events that are open for booking. Backend statuses vary; treat
	// UPCOMING / ON_SALE / PUBLISHED as bookable, and be lenient if status is null.
	const bookable = new Set(['UPCOMING', 'ON_SALE', 'PUBLISHED', 'ACTIVE']);
	const events = all.filter((e) => !e.status || bookable.has(e.status.toUpperCase()));

	return {
		events,
		totalPage: totalPages,
		ok
	};
};
