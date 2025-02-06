import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Dapatkan current path
    const { pathname } = req.nextUrl;
    
    // Daftar path yang diizinkan untuk publik (tidak perlu login)
    const publicPaths = ["/login", "/register"];
    
    // Cek jika user belum login dan mencoba mengakses rute yang dilindungi
    if (!req.nextauth.token && !publicPaths.includes(pathname)) {
      const loginUrl = new URL("/login", req.url);
      // Tambahkan redirect URL sebagai query parameter
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Jika user sudah login dan mencoba mengakses login/register, redirect ke home
    if (req.nextauth.token && publicPaths.includes(pathname)) {
      const homeUrl = new URL("/", req.url);
      return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Fungsi authorized akan dipanggil sebelum middleware
      authorized: ({ token }) => {
        return true; // Kita handle logikanya di dalam middleware
      },
    },
  }
);

// Konfigurasi path mana saja yang akan diproteksi oleh middleware
export const config = {
  matcher: [
    /*
     * Match semua path kecuali:
     * 1. /api (API routes)
     * 2. /_next (Next.js internals)
     * 3. /_static (static files)
     * 4. /_vercel (Vercel internals)
     * 5. /favicon.ico, /sitemap.xml (public files)
     */
    "/((?!api|_next|_static|_vercel|favicon.ico|sitemap.xml).*)",
  ],
};