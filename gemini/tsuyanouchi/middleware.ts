import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const UNDER_CONSTRUCTION = process.env.NEXT_PUBLIC_UNDER_CONSTRUCTION === 'true'

export function middleware(request: NextRequest) {
  if (UNDER_CONSTRUCTION) {
    const pathname = request.nextUrl.pathname
    const isUnderConstructionPage = pathname === '/under-construction'
    const isApi = pathname.startsWith('/api')
    const isStatic = pathname.startsWith('/_next/static') || pathname.startsWith('/_next/image')
    const isFavicon = pathname === '/favicon.ico'

    const previewCookie = request.cookies.get('preview_access')
    const hasPreviewAccess = previewCookie?.value === 'granted'

    if (!isUnderConstructionPage && !isApi && !isStatic && !isFavicon && !hasPreviewAccess) {
      return NextResponse.redirect(new URL('/under-construction', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
