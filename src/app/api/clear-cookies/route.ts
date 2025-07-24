import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.redirect(new URL('/cookie-test', process.env.NEXTAUTH_URL || 'http://localhost:3001'));
  
  // Clear all cookies by setting them to expire
  response.cookies.set('user-token', '', { maxAge: 0 });
  response.cookies.set('visit-time', '', { maxAge: 0 });
  response.cookies.set('last-dashboard-visit', '', { maxAge: 0 });
  
  return response;
}
