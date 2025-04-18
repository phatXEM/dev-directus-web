import { DEFAULT_CURRENCY } from "@/data/currency";

export const getCurrentCurrency = () => {
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
