import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { cookies } from "next/headers";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/en", "/tr"];

const handleI18nRouting = createMiddleware({
  locales: ["en", "tr"],
  defaultLocale: "en",
});

function authenticationMiddleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const strippedPath = path.replace(/^\/(en|tr)\//, "/");
  const isProtectedRoute = protectedRoutes.includes(strippedPath);
  const isPublicRoute = publicRoutes.includes(strippedPath);

  const locale = path.split("/")[1] || "en";

  const cookie = cookies().get("auth-token")?.value;

  if (isProtectedRoute && !cookie) {
    return NextResponse.redirect(
      new URL(`/${locale}/not-authenticated`, request.nextUrl.origin)
    );
  }

  if (
    isPublicRoute &&
    cookie &&
    !request.nextUrl.pathname.startsWith(`/${locale}/dashboard`)
  ) {
    return NextResponse.redirect(
      new URL(`/${locale}/dashboard`, request.nextUrl)
    );
  }
}

export default async function middleware(request: NextRequest) {
  const authResponse = authenticationMiddleware(request);
  if (authResponse) {
    return authResponse;
  }

  const response = handleI18nRouting(request);
  if (response) return response;

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
