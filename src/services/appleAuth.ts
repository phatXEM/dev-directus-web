import { waitForVar } from "@/utils/scripts";

declare global {
  interface Window {
    AppleID?: any;
  }
}

/**
 * Checks if the current browser and OS support Apple Sign In
 * @returns boolean indicating whether Apple Sign In is supported
 */
export const isAppleSignInSupported = (): boolean => {
  // Check if on Safari browser (includes iOS Safari)
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  // Check if on macOS or iOS
  const isMacOS = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Also support Chrome and Firefox on macOS (as they can handle Apple login as well)
  const isSupportedBrowser =
    isSafari || (isMacOS && /Chrome|Firefox/.test(navigator.userAgent));

  return isSafari || isMacOS || isIOS || isSupportedBrowser;
};

/**
 * Initialize and trigger Apple Sign In
 * @param callback Optional callback function to handle the Apple Sign In response
 * @returns Promise resolving to the Apple Sign In response
 */
export const signInWithApple = async (): Promise<any> => {
  try {
    // Wait for Apple ID script to load and be available globally
    const AppleID = await waitForVar<any>("AppleID");

    if (!AppleID) {
      throw new Error("Apple Sign In script did not load properly");
    }

    // Initialize the Apple authentication
    window.AppleID.auth.init({
      clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "",
      redirectURI: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI || "",
      scope: "email name",
      usePopup: true,
    });

    // Trigger the Apple login
    const response = await window.AppleID.auth.signIn();

    // Call backend endpoint with the authorization code
    const res: Response = await fetch(
      process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI || "",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: response.authorization.code,
        }),
      }
    );

    return res;
  } catch (error: any) {
    console.error(
      "Apple sign-in error:",
      typeof error === "string" ? error : JSON.stringify(error)
    );

    // Return error in the expected format
    return {
      error: typeof error === "string" ? error : JSON.stringify(error),
    };
  }
};
