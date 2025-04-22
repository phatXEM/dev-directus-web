import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { Tool } from "@/types/tool";

export const TOOLS_MENU: Tool[] = [
  {
    label: "video",
    route: "video",
    icon: IconPlayerPlayFilled,
    description: "video_desc",
  },
];

export const TOOL_PATHS = TOOLS_MENU.map((tool) => `/%{tool.route}`);
