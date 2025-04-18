import { useQuery } from "@tanstack/react-query";
import { useCurrentSession } from "./useCurrentSession";
import { getCurrentCurrency } from "@/utils/getCurrency";

export const useBalance = () => {
  const { session } = useCurrentSession();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["balance", session?.user?.id],
    queryFn: async () => {
      const currency = getCurrentCurrency().id;
      if (session?.user?.id) {
        const res = await fetch("/api/directus/request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "readItems",
            collection: "balance",
            params: {
              fields: ["balance"],
              filter: {
                currency_id: {
                  _eq: currency,
                },
              },
              limit: 1,
            },
          }),
        });

        const json = await res.json();
        if (json.ok) {
          return json?.result?.[0]?.balance ?? "0";
        }
      }

      return "...";
    },
  });

  return { balance: data, isLoading, updateBalance: refetch };
};
