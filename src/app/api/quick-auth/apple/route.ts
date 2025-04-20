import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const data = await request.json();
    const { code } = data;
    if (!code) {
      return NextResponse.json({ error: "Code is required" });
    }
    const res = await fetch(process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI || "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
      }),
    });
    if (res.status !== 200) {
      return NextResponse.json({
        error: "Failed to send user info to backend",
      });
    }
    const { access_token, refresh_token, expires } = await res.json();
    return NextResponse.json({
      access_token,
      refresh_token,
      expires,
    });
  } catch (error: any) {
    console.error("Error in apple authentication process:", error);
    return NextResponse.json({
      error: typeof error === "string" ? error : JSON.stringify(error),
    });
  }
};
