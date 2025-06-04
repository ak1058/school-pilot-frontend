// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Skip middleware for static files and API routes that don't need auth
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('.') || // Static files
    request.nextUrl.pathname.startsWith('/api/public') // Public APIs
  ) {
    return NextResponse.next();
  }

  // Clone headers to add Authorization
  const requestHeaders = new Headers(request.headers);
  const authToken = request.cookies.get('auth_token')?.value;

  // Forward token to API routes
  if (request.nextUrl.pathname.startsWith('/api') && authToken) {
    requestHeaders.set('Authorization', `Bearer ${authToken}`);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}