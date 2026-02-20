import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_AUTH_PATHS = ["/giris", "/kayit", "/sifremi-unuttum"];

const isPublicAuthPath = (pathname: string): boolean =>
  PUBLIC_AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;

  if (isPublicAuthPath(pathname)) {
    if (isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/giris";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"],
};
