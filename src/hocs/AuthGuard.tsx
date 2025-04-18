import { ReactNode } from "react";
import { auth } from "@/libs/auth";
import { Locale } from "@/i18n/types";
import { redirect } from "next/navigation";

const AuthGuard = async ({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) => {
  const session = await auth();

  if (!session) {
    redirect(`/${locale}/home`);
  }

  return <>{children}</>;
};

export default AuthGuard;
