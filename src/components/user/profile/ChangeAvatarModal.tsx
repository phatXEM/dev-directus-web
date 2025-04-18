import { RefObject } from "react";
import { Avatar, Button, Group, Stack, Text } from "@mantine/core";
import Modal, { ModalHandles } from "@/components/shared/Modal";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useTranslations } from "next-intl";

type ChangeAvatarModalProps = {
  modalRef: RefObject<ModalHandles>;
  avatar: string | null;
};

const ChangeAvatarModal = ({ modalRef, avatar }: ChangeAvatarModalProps) => {
  const t = useTranslations();

  return (
    <Modal ref={modalRef} centered size="xs" title={t("change_avatar")}>
      <Stack align="center">
        <Dropzone
          onDrop={(files) => console.log("accepted files", files)}
          onReject={(files) => console.log("rejected files", files)}
          maxSize={5 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
          w={250}
        >
          <Group
            justify="center"
            gap="xl"
            mih={220}
            style={{ pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <IconUpload
                size={52}
                color="var(--mantine-color-blue-6)"
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                size={52}
                color="var(--mantine-color-red-6)"
                stroke={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              {avatar ? (
                <Avatar src={avatar} size={200} radius="xl" />
              ) : (
                <IconPhoto
                  size={52}
                  color="var(--mantine-color-dimmed)"
                  stroke={1.5}
                />
              )}
            </Dropzone.Idle>
          </Group>
        </Dropzone>
        <Group>
          <Button variant="outline">{t("upload")}</Button>
          <Button color="red">{t("remove")}</Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ChangeAvatarModal;
