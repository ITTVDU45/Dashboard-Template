import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicPaths = ["/login", "/api/auth", "/_next", "/favicon.ico"]

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isPublic = publicPaths.some((path) => pathname.startsWith(path))

  if (isPublic) return NextResponse.next()

  const session = request.cookies.get("lp_admin_session")?.value
  if (session === "ok") return NextResponse.next()

  const loginUrl = new URL("/login", request.url)
  loginUrl.searchParams.set("next", pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/((?!api/health|.*\\..*).*)"]
}
