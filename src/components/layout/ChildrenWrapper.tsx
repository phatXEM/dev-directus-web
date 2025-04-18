import { memo, ReactNode } from "react";
import { Container } from "@mantine/core";
import classes from "@/styles/layout/AppLayout.module.css";

const ChildrenWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Container fluid className={classes.content_wrapper}>
      {children}
    </Container>
  );
};

export default memo(ChildrenWrapper);
