import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const data = await request.json();
    const { accessToken } = data;

    if (!accessToken) {
      return NextResponse.json({ error: "Access token is required" });
    }

    const res = await fetch(process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: accessToken,
      }),
    });

    const { access_token, refresh_token, expires } = await res.json();

    return NextResponse.json({
      access_token,
      refresh_token,
      expires,
    });
  } catch (error: any) {
    console.error("Error in Google authentication process:", error);
    return NextResponse.json({
      error: typeof error === "string" ? error : JSON.stringify(error),
    });
  }
};
