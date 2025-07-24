import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // This API route will be rate-limited by middleware
  
  const requestHeaders = Object.fromEntries(request.headers.entries());
  const middlewareHeaders = Object.keys(requestHeaders).filter(key => 
    key.startsWith('x-') || key.startsWith('X-')
  );
  
  return NextResponse.json({
    message: 'API request successful!',
    timestamp: new Date().toISOString(),
    headers: {
      middleware: middlewareHeaders.reduce((acc, key) => {
        acc[key] = requestHeaders[key];
        return acc;
      }, {} as Record<string, string>),
    },
    rateLimitInfo: {
      remaining: request.headers.get('x-ratelimit-remaining'),
      reset: request.headers.get('x-ratelimit-reset'),
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  
  return NextResponse.json({
    message: 'POST request received',
    data: body,
    timestamp: new Date().toISOString(),
    userAgent: request.headers.get('user-agent'),
  });
}
