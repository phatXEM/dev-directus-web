import { getUser } from "@/utils/auth/user";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const user = await getUser();

  if (user) {
    return NextResponse.json({ user });
  }

  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
};
