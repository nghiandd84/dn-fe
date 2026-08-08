import { URL_SHORTENER_API_URL, AUTH_API_URL } from '$env/static/private';
import { createApi } from '@dn-fe/ui/api';

export const api = createApi(URL_SHORTENER_API_URL);
export const authApi = createApi(AUTH_API_URL);
