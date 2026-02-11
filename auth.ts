// Auth configuration - Currently disabled
// This will be set up in Phase 2 of the implementation roadmap
// See IMPLEMENTATION_ROADMAP.md for setup instructions

import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

// Only include Google provider if credentials are configured
const providers = []
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET && 
    process.env.AUTH_GOOGLE_ID !== "placeholder" && 
    process.env.AUTH_GOOGLE_SECRET !== "placeholder") {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  )
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: '/auth/signin',
  },
})
