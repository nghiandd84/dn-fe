declare global {
	namespace App {
		interface Locals {
			lang: string;
			token?: string;
			user?: {
				user_id: string;
				client_id: string;
				accesses: { role_name: string; key?: string | null }[];
			};
		}
	}
}

export {};
