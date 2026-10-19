import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

export default createMiddleware(routing)

export const config = {
  // Exclude chat API rewrites + Socket.io from locale redirects.
  matcher: [
    "/",
    "/(ar|en|fr|id)/:path*",
    "/((?!_next|_vercel|chat|socket\\.io|.*\\..*).*)",
  ],
}
