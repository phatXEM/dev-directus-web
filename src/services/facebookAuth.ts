interface FacebookSignInResponse {
  accessToken?: string;
  userID?: string;
  error?: string;
}

/**
 * Handles the Facebook Sign In response by sending it to the backend
 * @param response The response from Facebook Sign In
 * @returns Promise resolving to the backend response
 */
export const signInWithFacebook = async (
  response: FacebookSignInResponse
): Promise<any> => {
  // If we have an error from Facebook, handle it
  if (response?.error) {
    console.error("Facebook sign-in error:", response.error);
    throw new Error(response.error);
  }

  // Check for access token and user ID
  if (!response || !response.accessToken || !response.userID) {
    console.error("Invalid Facebook sign-in response:", response);
    throw new Error("Invalid Facebook sign-in response");
  }

  try {
    const res = await fetch("/api/quick-auth/facebook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: response.accessToken,
      }),
    });

    if (!res.ok) {
      console.error("Failed to send user info to backend");
      throw new Error("Failed to send user info to backend");
    }
    // Parse the response
    const { access_token, refresh_token, expires } = await res.json();
    if (!access_token || !refresh_token || !expires) {
      console.error("Invalid response from backend:", res);
      throw new Error("Invalid response from backend");
    }
    // Return the tokens
    return {
      access_token,
      refresh_token,
      expires,
    };
  } catch (error) {
    console.error("Error fetching user info from Facebook:", error);
    return {
      error: typeof error === "string" ? error : JSON.stringify(error),
    };
  }
};
