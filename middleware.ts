// Middleware - Currently disabled for initial deployment
// This will be enabled in Phase 2 when authentication is set up
// See IMPLEMENTATION_ROADMAP.md for setup instructions

// export { auth as middleware } from "@/auth"

// export const config = {
//   matcher: ["/account/:path*", "/admin/:path*"],
// }

// For now, no middleware - all routes are public
export function middleware() {
  return null
}
