export interface CachedUser {
	user_id: string;
	client_id: string;
	accesses: any[];
}

const VERIFY_CACHE_TTL_MS = 60_000;

const cache = new Map<string, { user: CachedUser; expiresAt: number }>();

export function getCachedUser(token: string): CachedUser | null {
	const entry = cache.get(token);
	if (entry && Date.now() < entry.expiresAt) return entry.user;
	cache.delete(token);
	return null;
}

export function setCachedUser(token: string, user: CachedUser) {
	cache.set(token, { user, expiresAt: Date.now() + VERIFY_CACHE_TTL_MS });
}

export function evictCachedUser(token: string) {
	cache.delete(token);
}
