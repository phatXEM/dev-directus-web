import Home from "@/views/app/Home";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async () => {
  const t = await getTranslations();

  return {
    title: t("tools_soc"),
  };
};

const HomePage = () => {
  return <Home />;
};

export default HomePage;
