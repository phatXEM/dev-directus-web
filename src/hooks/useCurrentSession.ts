import { useCallback, useEffect, useState } from "react";
import { usePathname } from "@/i18n/routing";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

export const useCurrentSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<
    "authenticated" | "unauthenticated" | "loading"
  >("unauthenticated");
  const pathName = usePathname();

  const getCurrentSession = useCallback(async () => {
    setStatus("loading");
    try {
      const sessionData = await getSession();

      if (sessionData) {
        setSession(sessionData);
        setStatus("authenticated");
      } else {
        setSession(null);
        setStatus("unauthenticated");
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.log("ERROR get current session", err);
      }
      setSession(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    getCurrentSession();
  }, [getCurrentSession, pathName]);

  return { session, status };
};
