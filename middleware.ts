import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the request is for admin routes (except login)
  if (request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    
    // Check for admin session cookie
    const adminSession = request.cookies.get('admin_session')
    
    if (!adminSession || adminSession.value !== 'authenticated') {
      // Redirect to login page
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  // Allow request to continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
