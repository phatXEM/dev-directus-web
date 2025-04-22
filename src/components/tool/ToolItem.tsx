import { Tool } from "@/types/tool";
import { Card, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import classes from "@/styles/tools/ToolItem.module.css";

type ToolItemProps = {
  tool: Tool;
  hasSession: boolean;
};

const ToolItem = ({ tool, hasSession }: ToolItemProps) => {
  const t = useTranslations();

  return (
    <Card
      withBorder
      radius="md"
      p="sm"
      component={Link}
      href={`/${hasSession ? "" : "login?redirect="}${tool.route}`}
      className={classes.tool}
      flex={1}
    >
      <tool.icon className="self-center" size={50} />
      <Text c="blue.7" ta="center" size="xl" fw={600} className="capitalize">
        {t(tool.label)}
      </Text>
      <Text ta="center">{t(tool.description)}</Text>
    </Card>
  );
};

export default ToolItem;
