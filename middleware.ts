// middleware.ts
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intl = createMiddleware({
  locales: ["ru", "uk", "de"],
  defaultLocale: "ru",
  localePrefix: "always",
});

const protectedRoutes = new Set(["profile", "stats"]);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (/^\/ua(\/|$)/i.test(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(/^\/ua/i, "/uk");
    return NextResponse.redirect(url);
  }

  const res = intl(req);

  const [, locale, section] = pathname.split("/");
  if (protectedRoutes.has(section ?? "")) {
    const hasRefresh = Boolean(req.cookies.get("refreshToken")?.value);
    if (!hasRefresh) {
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/auth/login`;
      url.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next|_vercel|api|.*\\..*|favicon.ico).*)"],
};