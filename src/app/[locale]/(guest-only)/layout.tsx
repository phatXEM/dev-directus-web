import { ReactNode } from "react";
import GuestOnlyRoute from "@/hocs/GuestOnlyRoute";
import { Locale } from "@/i18n/types";

const GuestOnlyLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: Locale };
}) => {
  const { locale } = await params;

  return <GuestOnlyRoute locale={locale}>{children}</GuestOnlyRoute>;
};

export default GuestOnlyLayout;
