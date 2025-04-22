"use client";

import { memo } from "react";
import { TOOLS_MENU } from "@/data/tools";
import { useTranslations } from "next-intl";
import { NavLink, Stack, Text, Title, Tooltip } from "@mantine/core";
import { Link, redirect } from "@/i18n/routing";
import { useParams, usePathname } from "next/navigation";
import { IconChevronsLeft, IconChevronsRight } from "@tabler/icons-react";
import classes from "@/styles/layout/SideBar.module.css";
import clsx from "clsx";
import { Locale } from "@/i18n/types";

type SideBarProps = {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  isMobile: boolean;
};

const SideBar = ({ isCollapsed, toggleCollapsed, isMobile }: SideBarProps) => {
  const t = useTranslations();
  const pathname = usePathname();
  const { locale } = useParams();

  return (
    <Stack
      pt={0}
      px="sm"
      gap={0}
      h="100%"
      justify="space-between"
      className={classes.sidebar}
    >
      <Stack p={0} gap={5} flex={1}>
        <Tooltip
          label={t("expand")}
          position="right"
          transitionProps={{ duration: 0 }}
          disabled={!isCollapsed}
          withArrow
          arrowSize={6}
          events={{ hover: true, touch: true, focus: false }}
        >
          <NavLink
            component="button"
            onClick={toggleCollapsed}
            leftSection={
              isCollapsed ? <IconChevronsRight /> : <IconChevronsLeft />
            }
            label={isCollapsed ? "" : t("collapse")}
            className={clsx(classes.navlink, classes.navlink_toggle)}
          />
        </Tooltip>
        {TOOLS_MENU.map((tool) => (
          <Tooltip
            key={tool.route}
            label={t(tool.label)}
            position="right"
            transitionProps={{ duration: 0 }}
            disabled={!isCollapsed}
            withArrow
            arrowSize={6}
          >
            {isMobile ? (
              <NavLink
                component="button"
                onClick={() => {
                  setTimeout(() => {
                    toggleCollapsed();
                  }, 200);
                  redirect({
                    href: `/${tool.route}`,
                    locale: locale as Locale,
                  });
                }}
                label={isCollapsed ? "" : t(tool.label)}
                leftSection={<tool.icon />}
                active={pathname.includes(tool.route)}
                className={clsx(
                  classes.navlink,
                  pathname.includes(tool.route) && classes.navlink_active,
                  isCollapsed && classes.navlink_collapsed
                )}
              />
            ) : (
              <NavLink
                component={Link}
                href={`/${tool.route}`}
                label={isCollapsed ? "" : t(tool.label)}
                leftSection={<tool.icon />}
                active={pathname.includes(tool.route)}
                className={clsx(
                  classes.navlink,
                  pathname.includes(tool.route) && classes.navlink_active
                )}
              />
            )}
          </Tooltip>
        ))}
      </Stack>
      {!isCollapsed && (
        <Stack bg="transparent" py={15}>
          <Title
            order={6}
            fw={400}
            ta="center"
            c="gray.6"
            pos="sticky"
            bottom={0}
          >
            <Text
              span
              c="blue.7"
              fw={500}
              inherit
              component={Link}
              href="https://socjsc.com"
              target="_blank"
            >
              SOC JSC
            </Text>{" "}
            © 2024
          </Title>
        </Stack>
      )}
    </Stack>
  );
};

export default memo(SideBar);
