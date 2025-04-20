import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const data = await request.json();
    const { accessToken } = data;

    if (!accessToken) {
      return NextResponse.json({ error: "Access token is required" });
    }
    // Get user info from Google
    const userInfo = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!userInfo.ok) {
      console.error("Failed to fetch user info from Google");
      throw new Error("Failed to fetch user info from Google");
    }
    const userInfoData = await userInfo.json();

    if (!userInfoData.email) {
      console.error("Email not provided by Google or permission not granted");
      throw new Error("Email not provided by Google or permission not granted");
    }

    if (!userInfoData.email) {
      return NextResponse.json({
        error: "Email not provided by Google or permission not granted",
      });
    }
    const res = await fetch(process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userInfoData.email,
        name: userInfoData?.name ?? "",
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
