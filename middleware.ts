import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AGE_GATE_COOKIE = "rb_age_verified";
const AGE_GATE_PATH = "/age-gate";

function isAllowedPath(pathname: string) {
  return pathname === AGE_GATE_PATH;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isAllowedPath(pathname)) {
    return NextResponse.next();
  }

  if (request.cookies.get(AGE_GATE_COOKIE)?.value === "1") {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = AGE_GATE_PATH;
  redirectUrl.search = "";
  redirectUrl.searchParams.set("next", `${pathname}${search}`);

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    "/((?!_next|api|.*\\..*).*)",
  ],
};
