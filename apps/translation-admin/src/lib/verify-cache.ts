type CachedUser = {
	user_id: string;
	client_id: string;
	accesses: any[];
};

const cache = new Map<string, { user: CachedUser; expiresAt: number }>();
const TTL_MS = 60_000; // 1 minute

export function getCachedUser(token: string): CachedUser | null {
	const entry = cache.get(token);
	if (!entry) return null;
	if (Date.now() > entry.expiresAt) {
		cache.delete(token);
		return null;
	}
	return entry.user;
}

export function setCachedUser(token: string, user: CachedUser): void {
	cache.set(token, { user, expiresAt: Date.now() + TTL_MS });
}

export function evictCachedUser(token: string): void {
	cache.delete(token);
}
