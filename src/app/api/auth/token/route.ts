import { setTokens } from "@/utils/auth/tokenHandler";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const data = await request.json();
  const access_token = data?.access_token ?? "";
  const refresh_token = data?.refresh_token ?? "";
  const expires = data?.expires ?? 0;

  await setTokens({
    access_token,
    refresh_token,
    expires,
  });

  return NextResponse.json({ code: 200 });
};

export const DELETE = async (request: Request) => {
  await setTokens({
    access_token: "",
    refresh_token: "",
    expires: 0,
  });

  return NextResponse.json({ code: 200 });
};
