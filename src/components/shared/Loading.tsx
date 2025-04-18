import { Flex, Loader } from "@mantine/core";

const Loading = () => {
  return (
    <Flex align="center" justify="center" className="h-screen">
      <Loader color="blue" />
    </Flex>
  );
};

export default Loading;
