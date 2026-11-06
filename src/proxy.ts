import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {

    const token = await getToken({ req: request })

    const isAuthenticated = !!token;
    const pathname = request.nextUrl.pathname;

    // Authenticated users cannot access signin
    if (isAuthenticated && (pathname === "/auth/signin" || pathname === "/auth/signup")) {
        return NextResponse.redirect(new URL("/products", request.url));
    }

    // Unauthenticated users cannot access protected pages
    if (!isAuthenticated && (pathname.startsWith("/cart") || pathname.startsWith("/allorders"))) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    return NextResponse.next();


}


export const config = {
    matcher: ['/cart', "/allorders", "/auth/signin", "/auth/signup"],
}