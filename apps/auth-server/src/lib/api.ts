import { AUTH_API_URL } from '$env/static/private';
import { createApi } from '@dn-fe/ui/api';

export const api = createApi(AUTH_API_URL);
