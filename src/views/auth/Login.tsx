"use client";

import { useEffect, useRef, useState } from "react";
import {
  Flex,
  Button,
  Text,
  TextInput,
  ActionIcon,
  Stack,
  Card,
  Center,
  Container,
  Group,
  Title,
  useMantineTheme,
  Divider,
} from "@mantine/core";
import {
  IconMail,
  IconInfoCircle,
  IconKey,
  IconEye,
  IconEyeOff,
  IconChevronLeft,
  IconCode,
  IconBrandApple,
} from "@tabler/icons-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import LanguageDropdown from "@/components/header/LanguageDropdown";
import { Link } from "@/i18n/routing";
import Logo from "@/components/shared/Logo";
import Modal, { ModalHandles } from "@/components/shared/Modal";
import { useScript } from "@/hooks/useScript";

type FormData = z.infer<typeof schema>;

const schema = z.object({
  email: z.string().min(1, "required").email("email_is_invalid"),
  password: z.string().min(1, "required"),
  otp: z.string(),
});

const Login = () => {
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const modalRef = useRef<ModalHandles>(null);
  const theme = useMantineTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  useScript(
    "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      otp: "",
    },
  });

  useEffect(() => {
    if (localStorage.getItem("ss_state")) {
      localStorage.removeItem("ss_state");
    }
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    setIsSubmitting(true);
    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        otp: values.otp,
        redirect: false,
      });

      if (res && res.ok && res.error === null) {
        const redirect = searchParams?.get("redirect");
        router.push(`/${locale}/${redirect || "home"}`);
        router.refresh();
      } else {
        if (res?.error) {
          let error =
            typeof res.error === "string"
              ? res.error
              : JSON.stringify(res.error);
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
        console.log("ERROR login: Invalid user credentials.");
        setErrorMessage(t("invalid_credentials"));
      } else {
        console.log("ERROR login:", err);
        setErrorMessage(err?.errors?.[0]?.message ?? t("login_error"));
      }
      modalRef.current?.open();
      setIsSubmitting(false);
    }
  };

  const onToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleAppleSignIn = async (response: any) => {
    console.log("Apple Sign In response:", response);

    // If we close the popup without completing sign up, response may have an error
    if (response?.error) {
      console.error("Apple sign-in error:", response.error);
      setErrorMessage(
        t("apple_login_error") || "Apple sign-in failed. Please try again."
      );
      modalRef.current?.open();
      return;
    }

    // Check for authorization code
    if (!response || !response.authorization || !response.authorization.code) {
      console.error("Invalid Apple sign-in response:", response);
      setErrorMessage(
        t("apple_login_error") || "Invalid Apple sign-in response"
      );
      modalRef.current?.open();
      return;
    }

    setIsAppleLoading(true);
    try {
      // Call backend endpoint with the authorization code
      const directUrl = process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI || "";
      const res: Response = await fetch(directUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: response.authorization.code,
          state: response.authorization.state,
        }),
        credentials: "include", // Include cookies if your backend uses session cookies
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Failed to authenticate with Apple: ${errorData}`);
      }

      const data = await res.json();
      console.log("Apple login successful:", data);

      // If your backend returns a JWT token or other auth data
      if (data.token || data.user) {
        // Handle successful login (redirect or update UI)
        const redirect = searchParams?.get("redirect");
        router.push(`/${locale}/${redirect || "home"}`);
        router.refresh();
      } else {
        throw new Error("Invalid response from authentication server");
      }
    } catch (err: any) {
      console.error("Apple sign-in error:", err);
      setErrorMessage(`Apple sign-in failed: ${err.message}`);
      modalRef.current?.open();
    } finally {
      setIsAppleLoading(false);
    }
  };

  const appleSignin = async () => {
    waitForVar("AppleID").then(() => {
      window.AppleID.auth.init({
        clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "",
        redirectURI: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI || "",
        scope: "email name",
        usePopup: true,
      });

      return window.AppleID.auth
        .signIn()
        .then((response: any) => {
          console.error("Apple Sign In response:", response);
        })
        .catch((error: any) => {
          console.error(
            "Apple sign-in error:",
            typeof error === "string" ? error : JSON.stringify(error)
          );
        });
    });
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
              {t(
                showOTPInput ? "login_to_countinue_otp" : "login_to_countinue"
              )}
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
                <Group justify="flex-end">
                  <Text
                    size="sm"
                    fw={500}
                    c="blue.7"
                    component={Link}
                    href="/forgot-password"
                  >
                    {t("forgot_password")}?
                  </Text>
                </Group>
              </Stack>
              <Button type="submit" w="100%" loading={isSubmitting}>
                {t(showOTPInput ? "confirm" : "login")}
              </Button>
            </form>

            {!showOTPInput && (
              <>
                <Divider my="xs" label={"or"} labelPosition="center" />

                <Button
                  leftSection={<IconBrandApple size={18} />}
                  variant="default"
                  w="100%"
                  onClick={appleSignin}
                >
                  {"Sign in with Apple"}
                </Button>
              </>
            )}

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
                {t("dont_have_account")}{" "}
                <Text
                  component={Link}
                  href="/register"
                  c="blue.7"
                  size="sm"
                  fw={500}
                >
                  {t("create_an_account")}
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

export default Login;

const waitForVar = (
  name,
  {
    pollFrequency = 1000,
    retries: inRetries = 100,
    parent = window,
  }: {
    pollFrequency?: number | (({ retries: number }) => number);
    retries?: number;
    parent?: object;
  } = { pollFrequency: 1000, retries: 100, parent: window }
) => {
  if (parent && parent.hasOwnProperty(name)) {
    return Promise.resolve(parent[name]);
  }
  if (!inRetries) {
    return Promise.resolve(undefined);
  }
  const retries = inRetries - 1;
  return new Promise((resolve) =>
    setTimeout(
      resolve,
      typeof pollFrequency === "function"
        ? pollFrequency({ retries })
        : pollFrequency
    )
  ).then(() => waitForVar(name, { pollFrequency, parent, retries }));
};
