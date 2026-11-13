import { EVENT_API_URL, AUTH_API_URL } from '$env/static/private';
import { createApi } from '@dn-fe/ui/api';

export const api = createApi(EVENT_API_URL);
export const authApi = createApi(AUTH_API_URL);
