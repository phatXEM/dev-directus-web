import { ReactNode } from "react";
import HomeLayout from "@/components/layout/HomeLayout";
import AccessRoute from "@/hocs/AccessRoute";

const PublicLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <AccessRoute>
      <HomeLayout>{children}</HomeLayout>
    </AccessRoute>
  );
};

export default PublicLayout;
