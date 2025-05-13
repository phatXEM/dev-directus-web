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
  IconBrandGoogle,
  IconBrandFacebook,
  IconBrandStrava,
} from "@tabler/icons-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import LanguageDropdown from "@/components/header/LanguageDropdown";
import { Link } from "@/i18n/routing";
import Logo from "@/components/shared/Logo";
import Modal, { ModalHandles } from "@/components/shared/Modal";
import { useScript } from "@/hooks/useScript";
import { isAppleSignInSupported, signInWithApple } from "@/services/appleAuth";
import { signInWithGoogle } from "@/services/googleAuth";
import { signInWithFacebook } from "@/services/facebookAuth";
import { useSetState } from "@mantine/hooks";
import { exchangeStravaCodeForToken } from "@/services/stravaAuth";

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
  const [loading, setLoading] = useSetState({
    isAppleSupported: false,
    apple: false,
    google: false,
    facebook: false,
    strava: false,
  });
  const router = useRouter();
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const modalRef = useRef<ModalHandles>(null);
  const theme = useMantineTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  useScript(
    "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
  );
  const googleLogin = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      onGoogleLogin(credentialResponse);
    },
  });

  useEffect(() => {
    setLoading({ isAppleSupported: isAppleSignInSupported() });
  }, [setLoading]);

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

  const onAppleLogin = async () => {
    return; // TODO: Fix this
    try {
      setLoading({ apple: true });
      const response = await signInWithApple();

      console.log("Apple sign-in response:", response);
    } catch (error: any) {
      console.error(
        "Apple sign-in error:",
        typeof error === "string" ? error : JSON.stringify(error)
      );
      setErrorMessage(
        t("apple_login_error") || "Apple sign-in failed. Please try again."
      );
      modalRef.current?.open();
    } finally {
      setLoading({ apple: false });
    }
  };

  const onGoogleLogin = async (credentialResponse: any) => {
    try {
      setLoading({ google: true });

      // Process the Google sign-in response
      const authResult = await signInWithGoogle(credentialResponse);

      const loginAPI = await signIn("credentials", {
        access_token: authResult.access_token,
        refresh_token: authResult.refresh_token,
        expires: authResult.expires,
        redirect: false,
      });

      if (loginAPI && loginAPI.ok) {
        const redirect = searchParams?.get("redirect");
        router.push(`/${locale}/${redirect || "home"}`);
        router.refresh();
      } else {
        if (loginAPI?.error) {
          setErrorMessage(
            typeof loginAPI.error === "string"
              ? loginAPI.error
              : JSON.stringify(loginAPI.error)
          );
          modalRef.current?.open();
        }
      }

      // If authentication is successful, redirect to the home page or the requested redirect URL
      const redirect = searchParams?.get("redirect");
      router.push(`/${locale}/${redirect || "home"}`);
      router.refresh();
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      setErrorMessage("Google sign-in failed. Please try again.");
      modalRef.current?.open();
    } finally {
      setLoading({ google: false });
    }
  };

  const onFacebookLogin = async (facebookResponse: any) => {
    try {
      setLoading({ facebook: true });

      // Process the Facebook sign-in response
      const authResult = await signInWithFacebook(facebookResponse);

      const loginAPI = await signIn("credentials", {
        access_token: authResult.access_token,
        refresh_token: authResult.refresh_token,
        expires: authResult.expires,
        redirect: false,
      });

      if (loginAPI && loginAPI.ok) {
        const redirect = searchParams?.get("redirect");
        router.push(`/${locale}/${redirect || "home"}`);
        router.refresh();
      }
      if (loginAPI && loginAPI.error) {
        setErrorMessage(
          typeof loginAPI.error === "string"
            ? loginAPI.error
            : JSON.stringify(loginAPI.error)
        );
        modalRef.current?.open();
      }
    } catch (error: any) {
      console.error("Facebook sign-in error:", error);
      setErrorMessage("Facebook sign-in failed. Please try again.");
      modalRef.current?.open();
    } finally {
      setLoading({ facebook: false });
    }
  };

  const onStravaLogin = async () => {
    return;
    try {
      setLoading({ strava: true });

      // Generate a random state for CSRF protection
      const state = Math.random().toString(36).substring(2, 15);

      // Build the authorization URL with required parameters
      const redirectUri = `${window.location.origin}${window.location.pathname}`;
      const authUrl = `https://www.strava.com/oauth/authorize?client_id=${
        process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID
      }&response_type=code&state=${state}&scope=read_all,activity:read,profile:read_all&approval_prompt=force&redirect_uri=${encodeURIComponent(
        redirectUri
      )}`;

      // Open in the same window - simpler approach
      window.location.href = authUrl;

      // We don't need to set loading to false here as we're redirecting away
    } catch (error: any) {
      console.error("Strava sign-in error:", error);
      setErrorMessage("Strava sign-in failed. Please try again.");
      modalRef.current?.open();
      setLoading({ strava: false });
    }
  };

  // Check for Strava auth code on component mount
  useEffect(() => {
    const processStravaAuth = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");

      if (code) {
        console.log("Received Strava code:", code);
        // Here you can add code to handle the authorization code
        // For example, display it or store it temporarily
        const stravaAuthRes = await exchangeStravaCodeForToken(code);
        console.log("Strava auth response:", stravaAuthRes);

        // Remove code from URL to prevent issues on refresh
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete("code");
        cleanUrl.searchParams.delete("state");
        window.history.replaceState({}, document.title, cleanUrl.toString());
      }
    };

    processStravaAuth();
  }, []);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("strava_auth_state");
    };
  }, []);

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
                <Divider my="xs" label={t("or")} labelPosition="center" />

                <Stack gap="xs">
                  {loading.isAppleSupported && (
                    <Button
                      leftSection={<IconBrandApple size={18} />}
                      variant="default"
                      w="100%"
                      onClick={onAppleLogin}
                      loading={loading.apple}
                    >
                      {"Sign in with Apple"}
                    </Button>
                  )}
                  <Button
                    leftSection={<IconBrandGoogle size={18} />}
                    variant="default"
                    w="100%"
                    loading={loading.google}
                    onClick={() => googleLogin()}
                  >
                    {"Sign in with Google"}
                  </Button>
                  <FacebookLogin
                    appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || ""}
                    onSuccess={onFacebookLogin}
                    onFail={(error) => {
                      console.error("Facebook sign-in error:", error);
                      setErrorMessage(
                        "Facebook sign-in failed. Please try again."
                      );
                      modalRef.current?.open();
                    }}
                    render={({ onClick, logout }) => (
                      <Button
                        leftSection={<IconBrandFacebook size={18} />}
                        variant="default"
                        w="100%"
                        loading={loading.facebook}
                        onClick={onClick}
                      >
                        {"Sign in with Facebook"}
                      </Button>
                    )}
                  />
                  {/* <Button
                    leftSection={<IconBrandStrava size={18} />}
                    variant="default"
                    w="100%"
                    loading={loading.strava}
                    onClick={onStravaLogin}
                  >
                    {"Sign in with Strava"}
                  </Button> */}
                </Stack>
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
