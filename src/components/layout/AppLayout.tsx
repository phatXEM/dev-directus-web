"use client";

import { ReactNode, useEffect } from "react";
import { AppShell, Burger, em, Group } from "@mantine/core";
import { useDisclosure, useMediaQuery, useViewportSize } from "@mantine/hooks";
import Header from "@/components/header/Header";
import SideBar from "@/components/sidebar/SideBar";
import ChildrenWrapper from "./ChildrenWrapper";
import classes from "@/styles/layout/AppLayout.module.css";
import clsx from "clsx";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const [isCollapsed, { toggle: toggleCollapsed }] = useDisclosure(
    localStorage.getItem("sidebar_collapse") === "true" || false
  );
  const { width } = useViewportSize();
  const isMobile = useMediaQuery(`(max-width: ${em(576)})`);

  useEffect(() => {
    localStorage.setItem("sidebar_collapse", isCollapsed ? "true" : "false");
  }, [isCollapsed]);

  return (
    <AppShell
      header={{ height: 48 }}
      navbar={{
        width: isCollapsed ? (isMobile ? 10 : 72) : isMobile ? width - 4 : 240,
        breakpoint: 72,
      }}
    >
      <AppShell.Header
        className={clsx("content-center", classes.app_bg)}
        bd="none"
        px="md"
      >
        <Group h="100%">
          <Burger
            opened={!isCollapsed}
            onClick={toggleCollapsed}
            hiddenFrom="xs"
            size="sm"
          />
          <Header />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar bd="none" className={classes.app_bg}>
        <SideBar
          isCollapsed={isCollapsed}
          toggleCollapsed={toggleCollapsed}
          isMobile={!!isMobile}
        />
      </AppShell.Navbar>
      <AppShell.Main className={classes.app_bg}>
        <ChildrenWrapper>{children}</ChildrenWrapper>
      </AppShell.Main>
    </AppShell>
  );
};

export default AppLayout;
