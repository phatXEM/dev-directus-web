"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Group,
  MantineColorScheme,
  Radio,
  Stack,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import Select from "@/components/shared/Select";
import { usePathname, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { COLOR_SCHEME } from "@/data/theme";
import classes from "@/styles/Settings.module.css";
import clsx from "clsx";
import { Currency } from "@/types/currency";
import { DEFAULT_CURRENCY } from "@/data/currency";
import { useCurrentCurrency } from "@/hooks/useCurrencies";
import { useBalance } from "@/hooks/useBalance";
import { SYSTEM_LANGUAGES } from "@/data/languages";

const Settings = () => {
  const t = useTranslations();
  const { locale } = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const { updateCurrentCurrency } = useCurrentCurrency();
  const { updateBalance } = useBalance();

  const getLocalCurrency = () => {
    const localCurrency = localStorage.getItem("currency");
    if (localCurrency) {
      try {
        return JSON.parse(localCurrency);
      } catch (error) {
        return DEFAULT_CURRENCY;
      }
    }
    return DEFAULT_CURRENCY;
  };

  const [currentCurrency, setCurrentCurrency] =
    useState<Currency>(getLocalCurrency);

  useEffect(() => {
    localStorage.setItem("currency", JSON.stringify(currentCurrency));
    updateCurrentCurrency();
    updateBalance();
  }, [currentCurrency, updateBalance, updateCurrentCurrency]);

  const onCurrencyChange = (currencyId: string) => {
    const currency = getLocalCurrencies().find((c) => c.id === currencyId);
    if (currency?.id && currency.id !== currentCurrency.id) {
      setCurrentCurrency(currency);
    }
  };

  const onChangeLanguage = (langCode: string) => {
    if (langCode !== locale) {
      router.replace({ pathname }, { locale: langCode });
      router.refresh();
    }
  };

  const getLocalCurrencies = (): Currency[] => {
    const localCurrencies = localStorage.getItem("currencies");
    if (localCurrencies) {
      try {
        return JSON.parse(localCurrencies);
      } catch (error) {
        return [];
      }
    }
    return [];
  };

  return (
    <Container fluid mx={0}>
      <Stack>
        <Stack gap={5}>
          <Text size="sm" fw={600}>
            {t("language")}
          </Text>
          <Select
            data={SYSTEM_LANGUAGES}
            value={locale as string}
            onChange={onChangeLanguage}
            inputProps={{
              maw: 300,
              size: "sm",
            }}
          />
        </Stack>
        <Stack gap={5}>
          <Text size="sm" fw={600}>
            {t("currency")}
          </Text>
          <Select
            data={getLocalCurrencies().map((currency) => ({
              ...currency,
              label: currency.name,
              value: currency.id,
            }))}
            value={currentCurrency.id}
            onChange={onCurrencyChange}
            inputProps={{
              maw: 300,
              size: "sm",
            }}
            renderItem={(item) => (
              <Group justify="space-between" align="center">
                <Text size="sm">
                  {item?.name} ({item?.id})
                </Text>
                <Text
                  size="sm"
                  fw={400}
                  c="gray.6"
                  style={{ fontFamily: "sans-serif" }}
                >
                  {item?.symbol}
                </Text>
              </Group>
            )}
            renderInputValue={(item) => (
              <Text size="sm">
                {item?.name} ({item?.id})
              </Text>
            )}
          />
        </Stack>
        <Stack gap={5}>
          <Text size="sm" fw={600}>
            {t("theme")}
          </Text>
          <Radio.Group
            value={colorScheme}
            onChange={(scheme) => setColorScheme(scheme as MantineColorScheme)}
          >
            <Group>
              {COLOR_SCHEME.map((scheme) => (
                <Radio.Card
                  key={scheme.value}
                  value={scheme.value}
                  w={160}
                  className={clsx(
                    scheme.value === colorScheme && classes.activeTheme
                  )}
                >
                  <Stack gap="xs" align="center" py="sm">
                    <scheme.icon size={40} stroke={1} />
                    <Text size="sm">{t(scheme.value)}</Text>
                  </Stack>
                </Radio.Card>
              ))}
            </Group>
          </Radio.Group>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Settings;
