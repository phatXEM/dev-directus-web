"use client";

import { ReactNode } from "react";
import { AppShell, Container, Title, Text } from "@mantine/core";
import Header from "@/components/header/Header";
import classes from "@/styles/layout/AppLayout.module.css";
import clsx from "clsx";
import { Link } from "@/i18n/routing";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AppShell header={{ height: 48 }}>
      <AppShell.Header
        className={clsx("content-center", classes.app_bg)}
        bd="none"
        px="md"
      >
        <Header />
      </AppShell.Header>
      <AppShell.Main className={classes.app_bg}>
        <Container
          fluid
          className={clsx(
            classes.content_wrapper,
            classes.content_wrapper_home
          )}
        >
          {children}
        </Container>
        <Title order={6} fw={400} ta="center" c="gray.6" py={15}>
          Copyright © 2024{" "}
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
          </Text>
        </Title>
      </AppShell.Main>
    </AppShell>
  );
};

export default HomeLayout;
