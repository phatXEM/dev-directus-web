import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const POST = async (request: Request) => {
  try {
    const data = await request.json();
    const name = data?.name ?? "";

    if (name) {
      const cookieStore = await cookies();
      cookieStore.delete(name);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error clear cookie", error);
    }
    return NextResponse.json({ error: "Failed clear cookie" }, { status: 500 });
  }
};
