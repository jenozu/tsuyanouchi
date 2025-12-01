// Auth configuration - Currently disabled
// This will be set up in Phase 2 of the implementation roadmap
// See IMPLEMENTATION_ROADMAP.md for setup instructions

import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || "placeholder",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "placeholder",
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
})
