import { memo } from "react";
import { Title, Text } from "@mantine/core";
import { formatNumber } from "@/utils/format";
import { useCurrentCurrency } from "@/hooks/useCurrencies";

type UserBalanceProps = {
  balance: string;
};

const UserBalance = ({ balance }: UserBalanceProps) => {
  const { currentCurrency } = useCurrentCurrency();

  return (
    <Title size="md" fw={600} lh={1} ml={5}>
      {currentCurrency?.symbol &&
        currentCurrency?.symbol_position === "before" && (
          <Text
            span
            inherit
            style={{
              fontFamily: "sans-serif",
              marginRight: "3px",
              fontSize: "0.9rem",
            }}
            fw={400}
          >
            {currentCurrency?.symbol}
          </Text>
        )}
      {balance && formatNumber(balance) ? formatNumber(balance) : "..."}
      {currentCurrency?.symbol &&
        currentCurrency?.symbol_position === "after" && (
          <Text
            span
            inherit
            style={{
              fontFamily: "sans-serif",
              marginLeft: "3px",
              fontSize: "0.9rem",
            }}
            fw={400}
          >
            {currentCurrency?.symbol}
          </Text>
        )}
    </Title>
  );
};

export default memo(UserBalance);
