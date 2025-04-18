import { Locale } from "@/i18n/types";
import { ActionIcon, Menu } from "@mantine/core";
import { IconLanguage } from "@tabler/icons-react";
import { useParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/routing";
import classes from "@/styles/layout/header/LanguageDropdown.module.css";
import clsx from "clsx";
import { SYSTEM_LANGUAGES } from "@/data/languages";

const LanguageDropdown = () => {
  const { locale } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const onChangeLanguage = (langCode: Locale) => () => {
    if (langCode !== locale) {
      router.replace({ pathname }, { locale: langCode });
      router.refresh();
    }
  };

  return (
    <Menu>
      <Menu.Target>
        <ActionIcon
          variant="transparent"
          radius="xl"
          size="sm"
          className={classes.language_button}
        >
          <IconLanguage stroke={1.5} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {SYSTEM_LANGUAGES.map((lang) => (
          <Menu.Item
            key={lang.value}
            onClick={onChangeLanguage(lang.value as Locale)}
            className={clsx(
              lang.value === locale && classes.language_item_active
            )}
          >
            {lang.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default LanguageDropdown;
