import { Suspense } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import LocaleProvider from "@/contexts/LocaleProvider";
import { NextAuthProvider } from "@/contexts/nextAuthProvider";
import GoogleAuthProvider from "@/contexts/GoogleAuthProvider";
import Loading from "@/components/shared/Loading";
import { Notifications } from "@mantine/notifications";
import ReactQueryProvider from "@/contexts/ReactQueryProvider";

const LocaleLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) => {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleProvider>
        <NextAuthProvider>
          <GoogleAuthProvider>
            <Notifications />
            <Suspense fallback={<Loading />}>
              <ReactQueryProvider>{children}</ReactQueryProvider>
            </Suspense>
          </GoogleAuthProvider>
        </NextAuthProvider>
      </LocaleProvider>
    </NextIntlClientProvider>
  );
};

export default LocaleLayout;
