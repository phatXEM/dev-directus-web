import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/libs/auth";
import { Locale } from "@/i18n/types";

const GuestOnlyRoute = async ({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) => {
  const session = await auth();

  if (session) {
    redirect(`/${locale}/home`);
  }

  return <>{children}</>;
};

export default GuestOnlyRoute;
