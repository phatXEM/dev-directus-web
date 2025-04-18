"use client";

import { memo } from "react";
import Image from "next/image";
import { Group } from "@mantine/core";
import { Link } from "@/i18n/routing";
import HeaderRight from "./HeaderRight";

const Header = () => {
  return (
    <Group justify="space-between" align="center" className="flex-1">
      <Link href="/home">
        <Image
          src="/images/soc-logo.png"
          alt="logo"
          className="w-auto h-auto"
          width={60}
          height={30}
          priority
        />
      </Link>
      <HeaderRight />
    </Group>
  );
};

export default memo(Header);
