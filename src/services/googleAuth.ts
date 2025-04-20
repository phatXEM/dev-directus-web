interface GoogleSignInResponse {
  error?: string;
  access_token?: string;
}

/**
 * Handles the Google Sign In response by sending it to the backend
 * @param response The response from Google Sign In
 * @returns Promise resolving to the backend response
 */
export const signInWithGoogle = async (
  response: GoogleSignInResponse
): Promise<any> => {
  // If we have an error from Google, handle it
  if (response?.error) {
    console.error("Google sign-in error:", response.error);
    throw new Error(response.error);
  }

  if (!response || !response.access_token) {
    console.error("Invalid Google sign-in response:", response);
    throw new Error("Invalid Google sign-in response");
  }

  try {
    // Call backend endpoint
    const res = await fetch("/api/quick-auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: response.access_token,
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
  } catch (e) {
    console.error("Error in Google sign-in process:", e);
    return {
      error: typeof e === "string" ? e : JSON.stringify(e),
    };
  }
};
