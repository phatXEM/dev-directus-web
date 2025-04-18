import React, {
  forwardRef,
  PropsWithChildren,
  useImperativeHandle,
} from "react";
import { Modal as MTModal, ModalProps as MTModalProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export type ModalHandles = {
  open: () => void;
  openWithAutoClose: (time?: number) => void;
  close: () => void;
};

type ModalProps = PropsWithChildren & Omit<MTModalProps, "opened" | "onClose">;

const Modal = forwardRef<ModalHandles, ModalProps>(function Modal(
  { children, ...props },
  ref
) {
  const [opened, { open, close }] = useDisclosure(false);

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        open();
      },
      openWithAutoClose: (time) => {
        open();

        setTimeout(() => {
          close();
        }, time || 3000);
      },
      close: () => {
        close();
      },
    }),
    [close, open]
  );

  return (
    <MTModal {...props} opened={opened} onClose={close}>
      {children}
    </MTModal>
  );
});

export default Modal;
