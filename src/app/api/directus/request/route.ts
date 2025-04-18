import { auth } from "@/libs/auth";
import { NextResponse } from "next/server";
import { directus } from "@/libs/directus";
import { readItem, readItems, withToken } from "@directus/sdk";
import { getTokens, refreshToken } from "@/utils/auth/tokenHandler";

export const POST = async (request: Request) => {
  await refreshToken();

  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const type = data?.type ?? "";
    const collection = data?.collection ?? "";
    const id = data?.id ?? "";
    const params = data?.params ?? {};

    if (type) {
      let res;

      const { access_token } = await getTokens();

      switch (type) {
        case "readItem":
          res = await directus.request(
            withToken(access_token || "", readItem(collection, id, params))
          );
        case "readItems":
          res = await directus.request(
            withToken(access_token || "", readItems(collection, params))
          );
      }

      if (res) {
        return NextResponse.json({ ok: true, result: res });
      }
    }

    return NextResponse.json({
      error: "DIRECTUS_REQUEST_ERROR",
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error API directus:", error);
    }
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      return NextResponse.json(
        { error: "Directus Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.json({
      error: "DIRECTUS_REQUEST_ERROR",
    });
  }
};
