// Auth configuration - Currently disabled (next-auth not installed)
// This will be set up in Phase 2 of the implementation roadmap
// See IMPLEMENTATION_ROADMAP.md for setup instructions

import { redirect } from "next/navigation"
import { NextResponse } from "next/server"

export async function auth() {
  return null
}

export async function signIn(_provider?: string, _options?: { redirectTo?: string }) {
  redirect(_options?.redirectTo ?? "/")
}

export async function signOut(_options?: { callbackUrl?: string }) {
  redirect(_options?.callbackUrl ?? "/")
}

export const handlers = {
  GET: () => NextResponse.json({ error: "Auth not configured" }, { status: 501 }),
  POST: () => NextResponse.json({ error: "Auth not configured" }, { status: 501 }),
}
