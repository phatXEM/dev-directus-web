import { useQuery } from "@tanstack/react-query";
import { useCurrentSession } from "./useCurrentSession";
import { Currency } from "@/types/currency";
import { DEFAULT_CURRENCY } from "@/data/currency";

export const useCurrencies = () => {
  const { session } = useCurrentSession();

  const { data, isLoading } = useQuery({
    queryKey: ["currency", session?.user?.id],
    queryFn: async (): Promise<Currency[]> => {
      if (session?.user?.id) {
        const res = await fetch("/api/directus/request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "readItems",
            collection: "currency",
          }),
        });

        const json = await res.json();
        if (json.ok) {
          return json?.result ?? [];
        }
      }

      return [];
    },
  });

  return { currencies: data, isLoading };
};

export const useCurrentCurrency = () => {
  const { data, refetch } = useQuery({
    queryKey: ["currentCurrency"],
    queryFn: async (): Promise<Currency> => {
      const localCurrency = localStorage.getItem("currency");
      if (localCurrency) {
        try {
          return JSON.parse(localCurrency);
        } catch (error) {
          return DEFAULT_CURRENCY;
        }
      }
      return DEFAULT_CURRENCY;
    },
  });

  return { currentCurrency: data, updateCurrentCurrency: refetch };
};
