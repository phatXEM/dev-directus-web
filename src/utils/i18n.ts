import { routing } from "@/i18n/routing";
import { ensurePrefix } from "@/utils/string";

// Check if the url is missing the locale
export const isUrlMissingLocale = (url: string) => {
  return routing.locales.every(
    (locale) => !(url.startsWith(`/${locale}/`) || url === `/${locale}`)
  );
};

// Get the localized url
export const getLocalizedUrl = (url: string, languageCode: string): string => {
  if (!url || !languageCode)
    throw new Error("URL or Language Code can't be empty");

  return isUrlMissingLocale(url)
    ? `/${languageCode}${ensurePrefix(url, "/")}`
    : url;
};
