import { cookies } from "next/headers";
import { getUrlPath } from "@/utils/url";

export const setRedirectPath = async () => {
  // Get current url
  const cookieStore = await cookies();
  const url = cookieStore.get("x-url")?.value || "";
  const { baseUrl, locale, path } = getUrlPath(url);

  // Storage baseUrl
  cookieStore.set(
    "x-base",
    `${url.includes("https://") ? "https://" : "http://"}${baseUrl}`
  );

  if (!path.includes("login") && !path.includes("home")) {
    // Set redirect path
    const redirectPath = `/${locale}/login?redirect=${path}`;
    cookieStore.set("x-redirect", redirectPath);
  }
};
