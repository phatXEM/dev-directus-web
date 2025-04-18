import { NextResponse } from "next/server";
import { logoutServerSide } from "@/utils/auth/logoutServerSide";

export const POST = async (request: Request) => {
  await logoutServerSide();

  return NextResponse.json({ code: 200 });
};
