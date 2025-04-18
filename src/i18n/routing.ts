import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["vi-VN", "en-US"],
  defaultLocale: "vi-VN",
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
