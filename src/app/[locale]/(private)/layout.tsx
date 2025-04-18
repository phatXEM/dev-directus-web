import { ReactNode } from "react";
import AuthGuard from "@/hocs/AuthGuard";
import AppLayout from "@/components/layout/AppLayout";
import { Locale } from "@/i18n/types";
import AccessRoute from "@/hocs/AccessRoute";

const PrivateLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: Locale };
}) => {
  const { locale } = await params;

  return (
    <AccessRoute>
      <AuthGuard locale={locale}>
        <AppLayout>{children}</AppLayout>
      </AuthGuard>
    </AccessRoute>
  );
};

export default PrivateLayout;
