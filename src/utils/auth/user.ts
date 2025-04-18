import { readMe, withToken } from "@directus/sdk";
import { getTokens } from "./tokenHandler";
import { directus } from "@/libs/directus";

export const getUser = async () => {
  const { access_token } = await getTokens();

  if (access_token) {
    const res = await directus.request(
      withToken(
        access_token,
        readMe({
          fields: ["*", "balance.currency_id", "balance.balance"],
        })
      )
    );
    if (res.email) {
      return res;
    }
  }

  return false;
};
