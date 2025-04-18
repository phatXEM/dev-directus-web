"use client";

import { useRef, useState } from "react";
import {
  ActionIcon,
  Button,
  Card,
  Center,
  Checkbox,
  Container,
  Flex,
  Group,
  Radio,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import LanguageDropdown from "@/components/header/LanguageDropdown";
import Logo from "@/components/shared/Logo";
import {
  IconMail,
  IconKey,
  IconEyeOff,
  IconEye,
  IconInfoCircle,
  IconDeviceMobile,
  IconUser,
  IconCode,
  IconChevronLeft,
} from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import CallingCodeSelect, {
  CallingCodeSelectHandles,
} from "@/components/form/CallingCodeSelect";
import Modal, { ModalHandles } from "@/components/shared/Modal";

type FormData = z.infer<typeof schema>;

const schema = z.object({
  fullname: z.string().min(1, "required"),
  gender: z.string(),
  phoneNumber: z.string().min(9, "phone_number_is_invalid"),
  email: z.string().min(1, "required").email("email_is_invalid"),
  password: z.string().min(1, "required"),
  agreeTerm: z.boolean().refine((val) => val === true, {
    message: "you_must_agree_term",
  }),
  otp: z.string(),
});

const Register = () => {
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const t = useTranslations();
  const callingCodeRef = useRef<CallingCodeSelectHandles>(null);
  const modalRef = useRef<ModalHandles>(null);
  const theme = useMantineTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullname: "",
      gender: "male",
      phoneNumber: "",
      email: "",
      password: "",
      agreeTerm: false,
      otp: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    setIsSubmitting(true);
    const callingCode = callingCodeRef?.current?.getCallingCode();
    const countryCode = callingCode?.name ?? "VN";
    const { email, password, fullname, gender, phoneNumber, otp } = values;

    try {
      const loginAPI = await signIn("credentials", {
        email,
        password,
        otp,
        redirect: false,
        fromRegister: true,
        full_name: fullname,
        gender,
        phone:
          "+" +
          (callingCode?.value ?? "") +
          (phoneNumber.startsWith("0") ? phoneNumber.slice(1) : phoneNumber),
        country_code: countryCode,
      });

      if (loginAPI && loginAPI.ok && loginAPI.error === null) {
        router.push("/home");
        router.refresh();
      } else {
        if (loginAPI?.error) {
          if (process.env.NODE_ENV === "development") {
            console.log("ERROR register:", loginAPI?.error);
          }
          let error =
            typeof loginAPI.error === "string"
              ? loginAPI.error
              : JSON.stringify(loginAPI.error);
          if (error === "INVALID_OTP" && !showOTPInput) {
            setValue("otp", "");
            setShowOTPInput(true);
          } else {
            if (
              error === "CredentialsSignin" ||
              error === "INVALID_CREDENTIALS"
            ) {
              console.log("ERROR login: Invalid user credentials.");
              error = t("invalid_credentials");
            } else if (error === "INVALID_OTP") {
              console.log("ERROR login: Invalid OTP");
              error = t("invalid_otp");
            } else {
              console.log("ERROR login:", error);
            }
            setErrorMessage(error);
            modalRef.current?.open();
          }
        }
        setIsSubmitting(false);
      }
    } catch (err: any) {
      if (err?.errors?.[0]?.extensions?.code === "INVALID_CREDENTIALS") {
        console.log("ERROR register: Invalid user credentials.");
        setErrorMessage(t("invalid_credentials"));
      } else {
        console.log("ERROR register:", err);
        setErrorMessage(err?.errors?.[0]?.message ?? t("register_error"));
      }
      modalRef.current?.open();
      setIsSubmitting(false);
    }
  };

  const onToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onChangePhoneNumber = (
    text: string,
    onChange: (val: string) => void
  ) => {
    if (text.match(/^\d+$/) || text === "") onChange(text);
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
              {t(showOTPInput ? "login_to_countinue_otp" : "create_an_account")}
            </Text>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-4"
            >
              {showOTPInput && (
                <Controller
                  name="otp"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label="OTP"
                      placeholder="000000"
                      onChange={(event) => {
                        field.onChange(event.currentTarget.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      leftSectionPointerEvents="none"
                      leftSection={<IconCode size={18} />}
                      error={errors.otp?.message ? t(errors.otp?.message) : ""}
                      disabled={isSubmitting}
                      autoFocus
                    />
                  )}
                />
              )}
              <Stack display={showOTPInput ? "none" : "flex"} gap="xs">
                <Controller
                  name="fullname"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      label={t("fullname")}
                      placeholder={t("enter_fullname")}
                      onChange={(event) => {
                        field.onChange(event.currentTarget.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      leftSectionPointerEvents="none"
                      leftSection={<IconUser size={18} />}
                      error={
                        errors.fullname?.message
                          ? t(errors.fullname?.message)
                          : ""
                      }
                      disabled={isSubmitting}
                    />
                  )}
                />
                <Controller
                  name="gender"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Radio.Group value={value} onChange={onChange}>
                      <Group gap="lg">
                        <Radio
                          size="xs"
                          value="male"
                          label={
                            <Title size="sm" fw={400} ta="center">
                              {t("male")}
                            </Title>
                          }
                        />
                        <Radio
                          size="xs"
                          value="female"
                          label={
                            <Title size="sm" fw={400} ta="center">
                              {t("female")}
                            </Title>
                          }
                        />
                      </Group>
                    </Radio.Group>
                  )}
                />
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Stack gap={3}>
                      <Group gap={5} align="top">
                        <CallingCodeSelect
                          ref={callingCodeRef}
                          inputProps={{
                            className: "flex-1",
                            label: t("phone_number"),
                            disabled: isSubmitting,
                            leftSection: <IconDeviceMobile size={18} />,
                            w: 200,
                          }}
                        />
                        <TextInput
                          {...field}
                          w={150}
                          label={" "}
                          placeholder={t("enter_phone_number")}
                          onChange={(event) => {
                            onChangePhoneNumber(
                              event.currentTarget.value,
                              field.onChange
                            );
                            if (errorMessage) setErrorMessage("");
                          }}
                          disabled={isSubmitting}
                          error={!!errors.phoneNumber?.message}
                        />
                      </Group>
                      {errors.phoneNumber?.message ? (
                        <Text c="red" size="xs">
                          {t(errors.phoneNumber.message)}
                        </Text>
                      ) : null}
                    </Stack>
                  )}
                />
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
                        if (errorMessage) setErrorMessage("");
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
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      type={showPassword ? "text" : "password"}
                      label={t("password")}
                      placeholder={t("enter_password")}
                      onChange={(event) => {
                        field.onChange(event.currentTarget.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      leftSectionPointerEvents="none"
                      leftSection={<IconKey size={18} />}
                      rightSection={
                        <ActionIcon
                          variant="transparent"
                          onClick={onToggleShowPassword}
                          size={20}
                        >
                          {showPassword ? <IconEyeOff /> : <IconEye />}
                        </ActionIcon>
                      }
                      disabled={isSubmitting}
                      error={
                        errors.password?.message
                          ? t(errors.password?.message)
                          : ""
                      }
                    />
                  )}
                />
                <Controller
                  name="agreeTerm"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Stack gap={3}>
                      <Checkbox
                        checked={value}
                        onChange={(event) =>
                          onChange(event.currentTarget.checked)
                        }
                        label={
                          <Title size="sm" fw={400} ta="center">
                            {t("I_agree_with")}{" "}
                            <Text
                              span
                              c="blue.7"
                              fw={500}
                              inherit
                              component={Link}
                              href="https://docs.socjsc.com/docs/terms-privacy/terms-of-service/"
                              target="_blank"
                            >
                              {t("terms_&_policies")}
                            </Text>
                          </Title>
                        }
                        size="xs"
                        disabled={isSubmitting}
                      />
                      {!!errors.agreeTerm?.message && (
                        <Text c="red" size="xs">
                          {t(errors.agreeTerm?.message)}
                        </Text>
                      )}
                    </Stack>
                  )}
                />
              </Stack>
              <Button type="submit" w="100%" loading={isSubmitting}>
                {t(showOTPInput ? "confirm" : "register")}
              </Button>
            </form>
            {showOTPInput ? (
              <Group
                gap={3}
                justify="center"
                align="center"
                onClick={() => {
                  setValue("otp", "");
                  setShowOTPInput(false);
                }}
                className="cursor-pointer"
              >
                <IconChevronLeft
                  size={18}
                  stroke={1.5}
                  color={theme.colors.blue[7]}
                />
                <Text size="sm" fw={500} c="blue.7">
                  {t("back")}
                </Text>
              </Group>
            ) : (
              <Title size="sm" fw={400} ta="center">
                {t("already_have_an_account")}{" "}
                <Text
                  component={Link}
                  href="/login"
                  c="blue.7"
                  size="sm"
                  fw={500}
                >
                  {t("login_now")}
                </Text>
              </Title>
            )}
          </Stack>
        </Card>
      </Center>
      <Modal ref={modalRef} withCloseButton={false} centered>
        <Stack gap="xs" align="center">
          <IconInfoCircle color="red" size={60} />
          <Text size="md" ta="center">
            {errorMessage}
          </Text>
          <Button
            onClick={() => {
              modalRef.current?.close();
              setErrorMessage("");
            }}
          >
            Ok
          </Button>
        </Stack>
      </Modal>
    </Container>
  );
};

export default Register;
