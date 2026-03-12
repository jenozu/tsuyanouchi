import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const UNDER_CONSTRUCTION = process.env.NEXT_PUBLIC_UNDER_CONSTRUCTION === 'true'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isUnderConstructionPage = pathname === '/under-construction'
  const isApi = pathname.startsWith('/api')
  const isStatic =
    pathname.startsWith('/_next/static') || pathname.startsWith('/_next/image')
  const isFavicon = pathname === '/favicon.ico'
  const isAdmin = pathname.startsWith('/admin')

  // Allow preview access when a valid preview cookie is present
  const previewAccessCookie = request.cookies.get('preview_access')
  const hasPreviewAccess = previewAccessCookie?.value === 'granted'

  // When under construction, redirect all page traffic to the under-construction page
  // unless the visitor has preview access or is visiting an allowed route.
  if (UNDER_CONSTRUCTION && !hasPreviewAccess) {
    if (!isUnderConstructionPage && !isApi && !isStatic && !isFavicon && !isAdmin) {
      return NextResponse.redirect(new URL('/under-construction', request.url))
    }
  }

  // Check if the request is for admin routes (except login)
  if (
    pathname.startsWith('/admin') &&
    !pathname.startsWith('/admin/login')
  ) {
    const adminSession = request.cookies.get('admin_session')

    if (!adminSession || adminSession.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Run on all paths except API, static assets, and favicon
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
