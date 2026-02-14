import { cookies } from "next/headers"
import { fail, ok, parseBody } from "@/lib/api-helpers"

export async function POST(request: Request) {
  const body = await parseBody<{ password?: string }>(request).catch(() => null)
  if (!body?.password) return fail("Password is required", 400)

  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return fail("ADMIN_PASSWORD is not configured", 500)
  if (body.password !== expected) return fail("Invalid password", 401)

  const cookieStore = await cookies()
  cookieStore.set("lp_admin_session", "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  })

  return ok({ authenticated: true })
}
