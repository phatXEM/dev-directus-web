import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUrlPath } from "@/utils/url";
import { auth } from "./libs/auth";

const middleware = async (request: NextRequest) => {
  const handleI18nRouting = createMiddleware(routing);
  const response = handleI18nRouting(request);
  response.headers.set("x-url", request.url);

  const cookiesStore = await cookies();
  cookiesStore.set("x-url", request.url);

  const { path } = getUrlPath(request.url);
  if (path === "home") {
    const session = await auth();
    if (!session) {
      const redirectPath = cookiesStore.get("x-redirect")?.value || "";
      const basePath = cookiesStore.get("x-base")?.value || "";
      if (redirectPath && basePath) {
        // cookiesStore.set("x-redirect", "");
        return NextResponse.redirect(`${basePath}${redirectPath}`);
      }
    }
  }

  return response;
};

export default middleware;

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(vi-VN|en-US)/:path*"],
};
