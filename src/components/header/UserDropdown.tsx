import { signOut } from "next-auth/react";
import { directus } from "@/libs/directus";
import { Avatar, Group, Menu, UnstyledButton, Text, rem } from "@mantine/core";
import classes from "@/styles/layout/header/UserDropdown.module.css";
import {
  IconChevronDown,
  IconLogout,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Session } from "next-auth";
import UserBalance from "./UserBalance";

type UserDropdownProps = {
  session: Session | null;
  logOut: () => void;
  balance: string;
};

const UserDropdown = ({ session, logOut, balance }: UserDropdownProps) => {
  const t = useTranslations();

  const onLogout = async () => {
    logOut();
    await signOut();
    await fetch("/api/auth/token", {
      method: "DELETE",
    });
    await directus.logout();
  };

  return (
    <Menu
      width={180}
      position="bottom-end"
      transitionProps={{ transition: "pop-top-right" }}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton className={classes.user}>
          <Group gap={3}>
            <Avatar
              src={
                session?.user?.avatar
                  ? `https://soc.socjsc.com/assets/${session?.user?.avatar}?key=system-small-cover`
                  : "/images/user.png"
              }
              alt="Avatar"
              radius="xl"
              size={24}
            />
            <UserBalance balance={balance} />
            <IconChevronDown
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown p={0}>
        <Menu.Item
          className={classes.item_no_hover}
          component="div"
          closeMenuOnClick={false}
        >
          <Text size="sm">{session?.user.username}</Text>
          <Text size="xs" c="gray">
            {session?.user.email}
          </Text>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          leftSection={
            <IconUser
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          }
          component={Link}
          href="/profile"
        >
          {t("my_profile")}
        </Menu.Item>
        <Menu.Item
          leftSection={
            <IconSettings
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          }
          component={Link}
          href="/settings"
        >
          {t("settings")}
        </Menu.Item>
        <Menu.Item
          leftSection={
            <IconLogout
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          }
          onClick={onLogout}
        >
          {t("logout")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserDropdown;
