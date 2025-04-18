"use client";

import { Center, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";

const NotFound = () => {
  const t = useTranslations();

  return (
    <Center>
      <Stack align="center">
        <Text size="xl" fw={500}>
          {t("page_not_found")}
        </Text>
        <Text>{t("we_counld_not_find_page")}</Text>
      </Stack>
    </Center>
  );
};

export default NotFound;
