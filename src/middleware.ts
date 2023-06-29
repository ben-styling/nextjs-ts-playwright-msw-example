import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
export async function middleware(request: NextRequest) {
  const ignorePathsResponse = await handleIgnorePaths(request);
  if (ignorePathsResponse) return ignorePathsResponse;
}

const handleIgnorePaths = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    /\.(.*)$/.test(pathname) // exclude all files in the public folder (Assumes files in public folders have extensions)
  ) {
    return NextResponse.next();
  }
};
