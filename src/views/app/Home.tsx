"use client";

import { Container, Text, Title } from "@mantine/core";
import { useSession } from "next-auth/react";

const Home = () => {
  const { data: session } = useSession();
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
    </Container>
  );
};

export default Home;
