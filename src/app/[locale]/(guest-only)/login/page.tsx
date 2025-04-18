import Login from "@/views/auth/Login";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async () => {
  const t = await getTranslations();

  return {
    title: t("login"),
  };
};

const LoginPage = () => {
  return <Login />;
};

export default LoginPage;
