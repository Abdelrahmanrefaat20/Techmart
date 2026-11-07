// import { getToken } from 'next-auth/jwt'
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export async function proxy(request: NextRequest) {

//     // Must be the same secret used by the NextAuth handler, otherwise the
//     // session cookie cannot be decrypted and every user looks unauthenticated.
//     const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

//     const token = await getToken({ req: request, secret })

//     const isAuthenticated = !!token;
//     const pathname = request.nextUrl.pathname;

//     // Authenticated users cannot access signin
//     if (isAuthenticated && (pathname === "/auth/signin" || pathname === "/auth/signup")) {
//         return NextResponse.redirect(new URL("/products", request.url));
//     }

//     // Unauthenticated users cannot access protected pages
//     if (!isAuthenticated && (pathname.startsWith("/cart") || pathname.startsWith("/allorders"))) {
//         return NextResponse.redirect(new URL("/auth/signin", request.url));
//     }

//     return NextResponse.next();


// }


// export const config = {
//     matcher: ['/cart', "/allorders", "/auth/signin", "/auth/signup"],
// }






import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;

  const token = await getToken({
    req: request,
    secret,
  });

  const isAuthenticated = !!token;
  const pathname = request.nextUrl.pathname;

  const isAuthPage =
    pathname === "/auth/signin" ||
    pathname === "/auth/signup";

  const isProtectedPage =
    pathname === "/cart" ||
    pathname.startsWith("/cart/") ||
    pathname === "/allorders" ||
    pathname.startsWith("/allorders/");

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  if (!isAuthenticated && isProtectedPage) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart/:path*", "/allorders/:path*", "/auth/signin", "/auth/signup"],
};