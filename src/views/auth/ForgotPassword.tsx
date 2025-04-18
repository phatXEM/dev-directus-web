"use client";

import { useRef } from "react";
import {
  Button,
  Card,
  Center,
  Container,
  Group,
  Stack,
  TextInput,
  Text,
  Flex,
  useMantineTheme,
} from "@mantine/core";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useTranslations } from "next-intl";
import LanguageDropdown from "@/components/header/LanguageDropdown";
import { Link } from "@/i18n/routing";
import Logo from "@/components/shared/Logo";
import { IconChevronLeft, IconMail, IconMailOpened } from "@tabler/icons-react";
import { directus } from "@/libs/directus";
import { passwordRequest } from "@directus/sdk";
import Modal, { ModalHandles } from "@/components/shared/Modal";

type FormData = z.infer<typeof schema>;

const schema = z.object({
  email: z.string().min(1, "required").email("email_is_invalid"),
});

const ForgotPassword = () => {
  const t = useTranslations();
  const modalRef = useRef<ModalHandles>(null);
  const theme = useMantineTheme();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    directus.request(passwordRequest(values.email));
    modalRef?.current?.open();
    reset();
  };

  return (
    <Container fluid>
      <Group pos="absolute" top={16} right={16}>
        <LanguageDropdown />
      </Group>
      <Center className="min-w-[360px] h-screen py-4">
        <Card
          padding="lg"
          radius="md"
          withBorder
          className="w-full max-w-[360px] my-auto"
        >
          <Flex mt="sm" align="center" justify="center">
            <Logo />
          </Flex>
          <Stack mt="md">
            <Text size="xl" ta="center">
              {t("forgot_password")}
            </Text>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-4"
            >
              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    label={t("email")}
                    placeholder={t("enter_email")}
                    onChange={(event) => {
                      field.onChange(event.currentTarget.value);
                    }}
                    leftSectionPointerEvents="none"
                    leftSection={<IconMail size={18} />}
                    error={
                      errors.email?.message ? t(errors.email?.message) : ""
                    }
                    disabled={isSubmitting}
                  />
                )}
              />
              <Button type="submit" w="100%" loading={isSubmitting}>
                {t("send_reset_link")}
              </Button>
            </form>
            <Link href="/login">
              <Group gap={3} justify="center" align="center">
                <IconChevronLeft
                  size={18}
                  stroke={1.5}
                  color={theme.colors.blue[7]}
                />
                <Text size="sm" fw={500} c="blue.7">
                  {t("back_to_login")}
                </Text>
              </Group>
            </Link>
          </Stack>
        </Card>
      </Center>
      <Modal ref={modalRef} withCloseButton={false} centered>
        <Stack gap="xs" align="center">
          <IconMailOpened color="green" size={80} />
          <Text size="md" ta="center">
            {t("if_email_exist")}
          </Text>
          <Button onClick={() => modalRef.current?.close()}>Ok</Button>
        </Stack>
      </Modal>
    </Container>
  );
};

export default ForgotPassword;
