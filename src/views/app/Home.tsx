"use client";

import { Container, Grid, Text, Title } from "@mantine/core";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { TOOLS_MENU } from "@/data/tools";
import ToolItem from "@/components/tool/ToolItem";

const Home = () => {
  const { session } = useCurrentSession();
  return (
    <Container fluid mx={0}>
      <Title size="md">
        <Text inherit span fw={400}>
          Hello{" "}
        </Text>
        {session?.user?.first_name
          ? session?.user?.first_name + " " + session?.user?.last_name
          : session?.user?.full_name || session?.user?.email || ""}
      </Title>
      <Grid gutter="md">
        {TOOLS_MENU.map((tool, index) => (
          <Grid.Col
            key={index}
            span={{ base: 12, xs: 6, sm: 4, md: 3 }}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <ToolItem
              tool={tool}
              hasSession={!!session || !!localStorage.getItem("ss_state")}
            />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
