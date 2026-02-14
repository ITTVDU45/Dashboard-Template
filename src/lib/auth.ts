import { cookies } from "next/headers"

export const AUTH_COOKIE_NAME = "lp_admin_session"

export async function isAuthenticated() {
  const cookieStore = await cookies()
  const session = cookieStore.get(AUTH_COOKIE_NAME)?.value
  return session === "ok"
}
