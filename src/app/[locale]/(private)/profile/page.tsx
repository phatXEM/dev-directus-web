import Profile from "@/views/user/Profile";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async () => {
  const t = await getTranslations();

  return {
    title: t("profile"),
  };
};

const ProfilePage = () => {
  return <Profile />;
};

export default ProfilePage;