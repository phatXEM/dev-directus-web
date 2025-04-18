"use client";

import { ReactNode, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type AccessRouteProps = {
  children: ReactNode;
};

const AccessRoute = ({ children }: AccessRouteProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const checkUser = useCallback(async () => {
    const user = await fetch(`/api/auth/user`);
    if (user.status !== 200 || (!session && status !== "loading")) {
      await fetch(`/api/auth/logout-server`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      router.refresh();
    }
  }, [router, session, status]);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  return <>{children}</>;
};

export default AccessRoute;
