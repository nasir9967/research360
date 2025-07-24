# 🛡️ Next.js Middleware Complete Guide

## 📋 Table of Contents
1. [What is Middleware?](#what-is-middleware)
2. [How It Works](#how-it-works)
3. [Configuration](#configuration)
4. [Real-World Examples](#real-world-examples)
5. [Testing Guide](#testing-guide)
6. [Best Practices](#best-practices)
7. [Common Patterns](#common-patterns)

## What is Middleware?

Middleware in Next.js runs **before** your page components and API routes. It's like a security guard that checks every request before allowing it to proceed.

### 🎯 Key Features:
- ✅ **Authentication** - Check if users are logged in
- ✅ **Rate Limiting** - Prevent API abuse
- ✅ **Security Headers** - Add protection headers
- ✅ **Redirects** - Route users based on conditions
- ✅ **Logging** - Track requests for monitoring
- ✅ **A/B Testing** - Show different content to different users

## How It Works

```
User Request → Middleware → Your Page/API
     ↓             ↓            ↓
   /dashboard  → Auth Check → Dashboard.tsx
     ↓             ↓            ↓
   Result:     Redirect to   OR  Show Dashboard
              /login if          Content
              not logged in
```

### 🔄 Execution Flow:
1. **Request arrives** at your Next.js app
2. **Middleware runs first** (on Edge Runtime)
3. **Decision made**: Allow, Redirect, or Block
4. **Page/API executes** (if allowed)
5. **Response sent** to user

## Configuration

### Basic Setup (`middleware.ts` in root):
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('Middleware running for:', request.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### 🎯 Matcher Patterns:
```typescript
// Run on all routes
matcher: '/'

// Run on specific routes
matcher: ['/dashboard', '/profile']

// Run on route patterns
matcher: '/api/:path*'

// Exclude static files (recommended)
matcher: '/((?!_next/static|_next/image|favicon.ico).*)'
```

## Real-World Examples

### 1. 🔐 Authentication Middleware
```typescript
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;
  
  // Protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/admin'];
  const isProtected = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  if (isProtected && !token) {
    // Redirect to login with return URL
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}
```

### 2. 🚦 Rate Limiting
```typescript
const rateLimitMap = new Map();

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const limit = 100; // requests per minute
  
  const requests = rateLimitMap.get(ip) || [];
  const validRequests = requests.filter(time => now - time < windowMs);
  
  if (validRequests.length >= limit) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }
  
  validRequests.push(now);
  rateLimitMap.set(ip, validRequests);
  
  return NextResponse.next();
}
```

### 3. 🌍 Geolocation & A/B Testing
```typescript
export function middleware(request: NextRequest) {
  const country = request.headers.get('x-vercel-ip-country') || 'US';
  const userId = request.cookies.get('user-id')?.value;
  
  // Redirect based on country
  if (request.nextUrl.pathname === '/pricing' && country === 'IN') {
    return NextResponse.redirect(new URL('/pricing/india', request.url));
  }
  
  // A/B Testing
  const response = NextResponse.next();
  if (request.nextUrl.pathname === '/') {
    const variant = getUserVariant(userId); // Your A/B logic
    response.headers.set('X-AB-Test-Variant', variant);
  }
  
  return response;
}
```

## Testing Guide

### 🧪 Test Your Middleware:

1. **Visit the test page**: `http://localhost:3001/middleware-test`

2. **Test Authentication**:
   ```bash
   # Try accessing protected route without login
   curl http://localhost:3001/dashboard
   # Should redirect to /login
   ```

3. **Test Rate Limiting**:
   ```bash
   # Send multiple requests quickly
   for i in {1..10}; do curl http://localhost:3001/api/test; done
   ```

4. **Check Headers**:
   ```bash
   curl -I http://localhost:3001/
   # Look for X-Middleware-Version, X-Request-ID, etc.
   ```

### 📊 Monitoring Middleware:
- **Browser DevTools** → Network tab → Response Headers
- **Server Logs** → Check console for middleware logs
- **Performance** → Check X-Processing-Time header

## Best Practices

### ✅ Do's:
1. **Keep it fast** - Middleware runs on every request
2. **Use Edge Runtime** - Faster than Node.js runtime
3. **Handle errors gracefully** - Don't crash on invalid input
4. **Log important events** - For debugging and monitoring
5. **Use TypeScript** - Better type safety and development experience

### ❌ Don'ts:
1. **Heavy computation** - Keep logic simple and fast
2. **Database calls** - Use caching instead
3. **Large dependencies** - Edge Runtime has limitations
4. **Complex logic** - Move heavy processing to API routes

### 🎯 Performance Tips:
```typescript
// ✅ Good: Fast checks
const isAuthenticated = !!request.cookies.get('token');

// ❌ Bad: Slow database validation
const user = await db.user.findUnique({ where: { token } });

// ✅ Good: Simple string matching
const isAPIRoute = pathname.startsWith('/api/');

// ❌ Bad: Complex regex
const isAPIRoute = /^\/api\/(?!auth).*$/.test(pathname);
```

## Common Patterns

### 1. 🔄 Conditional Redirects
```typescript
// Redirect based on user role
if (pathname.startsWith('/admin') && userRole !== 'admin') {
  return NextResponse.redirect(new URL('/unauthorized', request.url));
}

// Redirect mobile users
const isMobile = request.headers.get('user-agent')?.includes('Mobile');
if (pathname === '/' && isMobile) {
  return NextResponse.redirect(new URL('/mobile', request.url));
}
```

### 2. 🛡️ Security Headers
```typescript
const response = NextResponse.next();

// Security headers
response.headers.set('X-Frame-Options', 'DENY');
response.headers.set('X-Content-Type-Options', 'nosniff');
response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
response.headers.set('X-XSS-Protection', '1; mode=block');

// CORS headers
response.headers.set('Access-Control-Allow-Origin', 'https://yourdomain.com');
response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
```

### 3. 📝 Request Logging
```typescript
export function middleware(request: NextRequest) {
  const startTime = Date.now();
  
  // Log request
  console.log(`[${request.method}] ${request.nextUrl.pathname}`);
  
  const response = NextResponse.next();
  
  // Log response
  response.headers.set('X-Processing-Time', `${Date.now() - startTime}ms`);
  
  return response;
}
```

### 4. 🎭 Feature Flags
```typescript
const FEATURE_FLAGS = {
  newDashboard: true,
  betaFeatures: false,
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Add feature flags to headers
  Object.entries(FEATURE_FLAGS).forEach(([flag, enabled]) => {
    response.headers.set(`X-Feature-${flag}`, enabled.toString());
  });
  
  return response;
}
```

## 🚀 Files Created:

1. **`middleware.ts`** - Main middleware with multiple features
2. **`/middleware-examples/`** - Specialized middleware examples
3. **`/dashboard`** - Protected route for testing
4. **`/profile`** - Another protected route
5. **`/middleware-test`** - Interactive testing page
6. **`/api/test`** - API route for rate limiting tests

## 🎯 Next Steps:

1. **Visit** `http://localhost:3001/middleware-test` to test features
2. **Try accessing** `/dashboard` without authentication
3. **Check browser DevTools** for custom headers
4. **Send rapid requests** to test rate limiting
5. **Customize** middleware for your specific needs

## 🔧 Production Considerations:

1. **Use Redis** for rate limiting in production
2. **Implement JWT validation** for real authentication
3. **Add monitoring** with services like DataDog or New Relic
4. **Use CDN** for static assets to reduce middleware load
5. **Implement graceful degradation** for middleware failures

---

**Happy coding! 🚀**
