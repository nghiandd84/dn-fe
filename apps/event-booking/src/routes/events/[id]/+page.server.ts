import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ApiEnvelope, EventData } from '$lib/types';
import { getToken } from '@dn-fe/ui/session';
import { authApi } from '$lib/api';
import { extractMeEmail } from '$lib/booking';

// Resolve the signed-in user's email so the booking form can prefill it.
// Non-fatal: any failure just leaves the field empty for manual entry.
async function resolveUserEmail(token: string, origin: string): Promise<string | null> {
	try {
		const res = await authApi('/users/me', {
			params: new URLSearchParams({ includes: 'accesses' }),
			token,
			origin
		});
		if (res.status !== 200) return null;
		return extractMeEmail(res.data);
	} catch {
		return null;
	}
}

export const load: PageServerLoad = async ({ fetch, params, cookies, url }) => {
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

	const token = getToken(cookies, url);
	const userEmail = token ? await resolveUserEmail(token, url.origin) : null;

	return { event, userEmail };
};
