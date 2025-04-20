import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const data = await request.json();
    const { accessToken } = data;

    const userInfoResponse = await fetch(
      `https://graph.facebook.com/v19.0/me?fields=email,name&access_token=${accessToken}`
    );

    if (!userInfoResponse.ok) {
      throw new Error("Failed to fetch user info from Facebook");
    }

    const userInfo = await userInfoResponse.json();

    // You might want to log or handle cases where email is undefined
    if (!userInfo.email) {
      return NextResponse.json({
        error: "Email not provided by Facebook or permission not granted",
      });
    }

    const res = await fetch(
      process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI || "",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userInfo.email,
          name: userInfo.name || "",
        }),
      }
    );
    const { access_token, refresh_token, expires } = await res.json();
    return NextResponse.json({
      access_token,
      refresh_token,
      expires,
    });
  } catch (error: any) {
    console.error("Error in Facebook authentication process:", error);
    return NextResponse.json({
      error: typeof error === "string" ? error : JSON.stringify(error),
    });
  }
};
