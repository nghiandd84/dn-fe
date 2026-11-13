export interface ApiOptions {
	method?: string;
	body?: unknown;
	token?: string;
	fingerprint?: string;
	params?: URLSearchParams;
	origin?: string;
}

export interface ApiResponse {
	status: number;
	data: any;
}

export type ApiFn = (path: string, opts?: ApiOptions) => Promise<ApiResponse>;

export function createApi(baseUrl: string): ApiFn {
	return async function api(path: string, opts: ApiOptions = {}): Promise<ApiResponse> {
		const url = new URL(baseUrl.replace(/\/$/, '') + path);
		if (opts.params) {
			opts.params.forEach((v, k) => url.searchParams.set(k, v));
		}

		const headers: Record<string, string> = { 'Content-Type': 'application/json' };
		if (opts.origin) headers['Origin'] = opts.origin;
		if (opts.token) headers['Authorization'] = `Bearer ${opts.token}`;
		if (opts.fingerprint) headers['X-Client-Fingerprint'] = opts.fingerprint;

		console.log(url, headers, opts);

		const res = await fetch(url.toString(), {
			method: opts.method || 'GET',
			headers,
			body: opts.body ? JSON.stringify(opts.body) : undefined
		});
		console.log(res);
		const resBody = await res.json();
		console.log(JSON.stringify(resBody));

		return { status: res.status, data: resBody };
	};
}
