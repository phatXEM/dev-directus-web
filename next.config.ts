import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  redirects: async () => [
    {
      source: "/",
      destination: "/vi-VN/home",
      permanent: true,
      locale: false,
    },
    {
      source: "/:lang(vi-VN|en-US)",
      destination: "/:lang/home",
      permanent: true,
      locale: false,
    },
    {
      source: "/((?!(?:vi-VN:en-US|front-pages|favicon.ico)\\b)):path",
      destination: "/vi-VN/:path",
      permanent: true,
      locale: false,
    },
  ],
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "soc.socjsc.com",
        port: "",
        pathname: "/assets/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
