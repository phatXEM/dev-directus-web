"use client";

import { useCallback, useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import type { SessionProviderProps } from "next-auth/react";
import { Session } from "next-auth";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { usePathname } from "@/i18n/routing";

export const NextAuthProvider = ({
  children,
  ...rest
}: SessionProviderProps) => {
  // const [session, setSession] = useState<Session | null>(null);
  // const pathName = usePathname();
  // const sessionData = useCurrentSession().session;

  // const fetchSession = useCallback(async () => {
  //   try {
  //     setSession(sessionData);
  //   } catch (error) {
  //     setSession(null);

  //     if (process.env.NODE_ENV === "development") {
  //       console.error(error);
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   fetchSession().finally();
  // }, [fetchSession, pathName]);

  return <SessionProvider {...rest}>{children}</SessionProvider>;
};
