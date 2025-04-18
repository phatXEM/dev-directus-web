export const getUrlPath = (url: string) => {
  const pathname = url.replace("http://", "").replace("https://", "");
  const [baseUrl, locale, path] = pathname.split("/");

  return { baseUrl, locale, path };
};
