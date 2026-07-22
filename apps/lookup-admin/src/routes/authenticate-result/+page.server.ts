import { redirect } from "@sveltejs/kit";
import type { Cookies } from "@sveltejs/kit";
import { AUTH_CLIENT_ID } from "$env/static/private";
import { PUBLIC_BASE_URL } from "$env/static/public";
import { authApi } from "$lib/api";
import { handleAuthResult, type Permission } from "@dn-fe/ui/auth-result";

function onPermissions(
  permissions: Permission[],
  _cookies: Cookies,
  _clientId: string,
) {
  if (permissions.length > 0) {
    throw redirect(302, "/admin");
  }
}

export async function load({ url, cookies }) {
  return handleAuthResult({
    api: authApi,
    cookies,
    url,
    origin: PUBLIC_BASE_URL,
    onPermissions,
    defaultClientId: AUTH_CLIENT_ID,
  });
}
