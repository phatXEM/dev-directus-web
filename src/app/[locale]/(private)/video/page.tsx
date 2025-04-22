import Video from "@/views/app/Video";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async () => {
  const t = await getTranslations();

  return {
    title: t("video"),
  };
};

const VideoPage = () => {
  return <Video />;
};

export default VideoPage;
