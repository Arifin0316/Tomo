import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If user is not authenticated, redirect to login
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => token !== null
    }
  }
);

// Protected routes
export const config = { 
  matcher: [
    '/',
    '/explore',
    '/profile/:path*',
    '/messages/:path*',
    '/create',
  ]
};