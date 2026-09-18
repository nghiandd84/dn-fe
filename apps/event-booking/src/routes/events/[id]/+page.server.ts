import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ApiEnvelope, EventData } from '$lib/types';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const res = await fetch(`/api/event/events/${params.id}`);

	if (!res.ok) {
		throw error(res.status === 404 ? 404 : 502, 'Event not found');
	}

	const body = (await res.json()) as ApiEnvelope<EventData> | EventData;
	// The public event endpoint returns EventData directly (not wrapped).
	const event = (body as ApiEnvelope<EventData>)?.data ?? (body as EventData);

	if (!event?.id) {
		throw error(404, 'Event not found');
	}

	return { event };
};
