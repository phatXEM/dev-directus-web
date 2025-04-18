"use client";

import { ReactNode, useEffect, useState } from "react";
import { getLocaleByIP } from "@/utils/getLocale";
import { usePathname } from "@/i18n/routing";
import Loading from "@/components/shared/Loading";
import { redirect, useParams } from "next/navigation";
import { getLocalizedUrl } from "@/utils/i18n";
import { Locale } from "@/i18n/types";

type LocaleProviderProps = {
  children: ReactNode;
};

const LocaleProvider = ({ children }: LocaleProviderProps) => {
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [redirectPath, setRedirectPath] = useState("");
  const { locale } = useParams();

  useEffect(() => {
    const check = async () => {
      let langCode = sessionStorage.getItem("detect_locale");
      const fromStorage = !!langCode;

      if (!langCode) {
        langCode = await getLocaleByIP();

        sessionStorage.setItem("detect_locale", langCode);
      }

      if (!fromStorage && langCode !== locale) {
        setRedirectPath(getLocalizedUrl(pathname, langCode as Locale));
      }

      setIsChecking(false);
    };

    check();
  }, [locale, pathname]);

  if (isChecking) {
    return <Loading />;
  }

  if (redirectPath) {
    return redirect(redirectPath);
  }

  return <>{children}</>;
};

export default LocaleProvider;
