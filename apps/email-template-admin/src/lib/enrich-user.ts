import { authApi } from '$lib/api';

/**
 * Enriches a list of records that have a `user_id` field with a `user_email` field.
 * Non-fatal: if the auth API call fails, records are returned unchanged.
 */
export async function enrichWithUserEmail(
	rows: any[],
	opts: { fingerprint?: string; token?: string; origin?: string }
): Promise<void> {
	const userIds = [...new Set(rows.map((r) => r.user_id).filter(Boolean))];
	if (!userIds.length) return;

	try {
		const usersRes = await authApi('/users', {
			params: new URLSearchParams({
				id: `in|${userIds.join(',')}`,
				page_size: String(userIds.length)
			}),
			fingerprint: opts.fingerprint,
			token: opts.token,
			origin: opts.origin
		});
		const users: any[] = usersRes.data?.data?.result ?? usersRes.data?.result ?? [];
		const emailMap = Object.fromEntries(users.map((u: any) => [u.id, u.email]));
		for (const row of rows) {
			row.user_email = emailMap[row.user_id] ?? null;
		}
	} catch {
		// Non-fatal — user lookup failure should not break the main response
	}
}

/**
 * Enriches a single record that has a `user_id` field with a `user_email` field.
 */
export async function enrichOneWithUserEmail(
	record: any,
	opts: { fingerprint?: string; token?: string; origin?: string }
): Promise<void> {
	if (!record?.user_id) return;
	await enrichWithUserEmail([record], opts);
}
