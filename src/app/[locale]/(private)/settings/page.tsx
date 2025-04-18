import Settings from "@/views/user/Settings";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async () => {
  const t = await getTranslations();

  return {
    title: t("settings"),
  };
};

const SettingsPage = () => {
  return <Settings />;
};

export default SettingsPage;
