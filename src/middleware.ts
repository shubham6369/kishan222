import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'hi'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Check if the pathname is missing a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    // We only want to redirect for the root or paths that don't have a locale prefix
    // Skip static files and API routes
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.includes('.')
    ) {
      return;
    }

    const locale = defaultLocale;
    
    // Create redirect URL preserving the original pathname and query parameters (search)
    const redirectUrl = new URL(
      `/${locale}${pathname === '/' ? '' : pathname}${search}`,
      request.url
    );
    
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|.*\\.).*)',
  ],
};
