import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware ensures that the service worker is properly registered
export function middleware(_request: NextRequest) {
  const response = NextResponse.next();
  
  // Add headers to ensure service worker can control the page
  response.headers.set('Service-Worker-Allowed', '/');
  
  return response;
}

// See: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - sw.js (service worker)
    // - manifest.json
    // - icons
    '/((?!_next/static|_next/image|favicon\\.ico|sw\\.js|workbox-|manifest\\.json|icons).*)',
  ],
}; 