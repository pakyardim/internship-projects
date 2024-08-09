import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

const localizationMiddleware = createMiddleware({
  locales: ["en", "tr"],
  defaultLocale: "en",
});

function authenticationMiddleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("auth-token");

  const url = request.nextUrl.clone();

  if (url.pathname === "/login" && isLoggedIn) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export default async function middleware(request: NextRequest) {
  const localizationResponse = localizationMiddleware(request);

  if (localizationResponse) {
    return localizationResponse;
  }

  return authenticationMiddleware(request);
}

export const config = {
  matcher: ["/", "/(tr|en)/:path*"],
};
