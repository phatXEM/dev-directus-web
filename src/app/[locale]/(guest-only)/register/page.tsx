import Register from "@/views/auth/Register";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async () => {
  const t = await getTranslations();

  return {
    title: t("register"),
  };
};

const RegisterPage = () => {
  return <Register />;
};

export default RegisterPage;
