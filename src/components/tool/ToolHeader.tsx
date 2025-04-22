import { ReactNode } from "react";
import { Group } from "@mantine/core";
import classes from "@/styles/tools/ToolHeader.module.css";

type ToolHeaderProps = {
  children: ReactNode;
};

const ToolHeader = ({ children }: ToolHeaderProps) => {
  return <Group className={classes.header}>{children}</Group>;
};

export default ToolHeader;
