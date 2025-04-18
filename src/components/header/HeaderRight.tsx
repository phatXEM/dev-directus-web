import { memo, useEffect, useState } from "react";
import { Button, Group } from "@mantine/core";
import UserDropdown from "./UserDropdown";
import LanguageDropdown from "./LanguageDropdown";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Session } from "next-auth";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { useBalance } from "@/hooks/useBalance";
import { useCurrencies } from "@/hooks/useCurrencies";

const HeaderRight = memo(function HeaderRight() {
  const { session, status } = useCurrentSession();
  const t = useTranslations();
  const [localSession, setLocalSession] = useState<Session | null>(
    localStorage.getItem("ss_state")
      ? JSON.parse(localStorage.getItem("ss_state") || "")
      : null
  );

  const { currencies } = useCurrencies();
  const { balance } = useBalance();

  useEffect(() => {
    if (
      Array.isArray(currencies) &&
      currencies?.length &&
      !localStorage.getItem("currencies")
    ) {
      localStorage.setItem("currencies", JSON.stringify(currencies));
      if (!localStorage.getItem("currency")) {
        localStorage.setItem("currency", JSON.stringify(currencies[0]));
      }
    }
  }, [currencies]);

  useEffect(() => {
    if (session && !localSession) {
      // After Login
      const local = {
        user: {
          avatar: session?.user?.avatar,
          email: session?.user?.email,
          full_name: session?.user?.full_name,
          username: session?.user?.username,
          id: session?.user?.id,
          access_token: "",
          refresh_token: "",
        },
        expires: "",
      };
      setLocalSession(local);
      localStorage.setItem("ss_state", JSON.stringify(local));
    }
  }, [localSession, session]);

  useEffect(() => {
    if (!localSession && localStorage.getItem("ss_state")) {
      // After Logout
      localStorage.removeItem("ss_state");
    }
  }, [localSession]);

  const logOut = () => {
    setLocalSession(null);
    localStorage.removeItem("ss_state");
    localStorage.removeItem("currency");
    localStorage.removeItem("currencies");
  };

  if (!localSession && status === "loading") return null;

  return (
    <Group gap="sm" align="center">
      <LanguageDropdown />
      {localSession ? (
        <UserDropdown
          session={localSession}
          logOut={logOut}
          balance={balance}
        />
      ) : (
        <Button component={Link} href="/login">
          {t("login")}
        </Button>
      )}
    </Group>
  );
});

export default HeaderRight;
