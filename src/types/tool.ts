import { ForwardRefExoticComponent, RefAttributes } from "react";
import { Icon, IconProps } from "@tabler/icons-react";

export type Tool = {
  label: string;
  route: string;
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  description: string;
};
