import { AUTH_API_URL, LOOKUP_API_URL } from '$env/static/private';
import { AUTH_SERVER_URL } from '$env/static/private';
import { createApi } from '@dn-fe/ui/api';

/** API client for the Lookup backend */
export const api = createApi(LOOKUP_API_URL);

/** API client for the Auth server (token exchange, roles, permissions) */
export const authApi = createApi(AUTH_API_URL);
