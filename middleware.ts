import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  // 🧪 TESTING: Add clear logs and headers
  console.log('🔒 AUTH MIDDLEWARE RUNNING!');
  console.log('📍 Path:', request.nextUrl.pathname);
  console.log('🍪 Token found:', !!token);
  console.log('🍪 Token value:', token || 'NO TOKEN');
  console.log('---');

  if (!token) {
    console.log('❌ NO TOKEN - Redirecting to /login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  console.log('✅ TOKEN FOUND - Access granted');
  const response = NextResponse.next();
  
  // Add headers to prove middleware ran
  response.headers.set('X-Auth-Check', 'PASSED');
  response.headers.set('X-Token-Status', 'FOUND');
  response.headers.set('X-Middleware-Time', new Date().toISOString());
  
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};