import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.redirect(new URL('/cookie-test', process.env.NEXTAUTH_URL || 'http://localhost:3001'));
  
  // Set a user token cookie
  response.cookies.set('user-token', 'abc123xyz', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });
  
  return response;
}
