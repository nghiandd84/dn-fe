import type { Handle } from '@sveltejs/kit';

// Public guest app: no route protection. The only auth is the OAuth token
// obtained on demand for payment, stored in a cookie and read by the promote
// proxy route directly. Here we only resolve a display locale.
export const handle: Handle = async ({ event, resolve }) => {
	event.locals.lang = 'en-US';
	return resolve(event);
};
