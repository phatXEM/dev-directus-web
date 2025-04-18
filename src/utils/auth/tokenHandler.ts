import { directus } from "@/libs/directus";
import { refresh } from "@directus/sdk";
import { cookies } from "next/headers";
import { encrypt, decrypt } from "@/utils/crypto";
import { logoutServerSide } from "./logoutServerSide";

export const setTokens = async ({
  access_token,
  refresh_token,
  expires,
}: {
  access_token: string;
  refresh_token: string;
  expires: number;
}) => {
  const cookieStore = await cookies();

  cookieStore.set("access_token", encrypt(access_token), {
    httpOnly: true,
    secure: true,
    path: "/",
  });
  cookieStore.set("refresh_token", encrypt(refresh_token), {
    httpOnly: true,
    secure: true,
    path: "/",
  });
  cookieStore.set("expires", encrypt(expires.toString()), {
    httpOnly: true,
    secure: true,
    path: "/",
  });
};

export const getTokens = async () => {
  const cookieStore = await cookies();
  const access_token =
    decrypt(cookieStore.get("access_token")?.value ?? "") || null;
  const refresh_token =
    decrypt(cookieStore.get("refresh_token")?.value ?? "") || null;
  const expires = cookieStore.get("expires")?.value
    ? parseInt(decrypt(cookieStore.get("expires")?.value ?? ""), 10)
    : null;

  return { access_token, refresh_token, expires };
};

// Prevent concurrent refresh calls
let refreshPromise: Promise<any> | null = null;
let lastRefreshTime = 0;
const REFRESH_COOLDOWN = 5000; // 5 seconds cooldown between refresh attempts
const TOKEN_BUFFER = 60000; // 1 minute buffer for token expiration

export const refreshToken = async () => {
  // If there's already a refresh in progress, return that promise
  if (refreshPromise) {
    console.log(`[${new Date().toISOString()}] Using existing refresh promise`);
    return refreshPromise;
  }

  // Check if we've recently attempted a refresh
  const now = Date.now();
  if (now - lastRefreshTime < REFRESH_COOLDOWN) {
    console.log(`[${new Date().toISOString()}] Skipping refresh due to cooldown`);
    return null;
  }

  const { refresh_token, expires } = await getTokens();
  let shouldLogout = false;

  if (!refresh_token) {
    console.error(`[${new Date().toISOString()}] No refresh token available`);
    await logoutServerSide();
    return null;
  }

  // Check if token is still valid (with buffer)
  if (Date.now() < (expires || 0) - TOKEN_BUFFER) {
    console.log(`[${new Date().toISOString()}] Token still valid, skipping refresh. Time until expiry: ${Math.floor(((expires || 0) - Date.now())/1000)}s`);
    return null;
  }

  // Create new refresh promise
  refreshPromise = (async () => {
    try {
      lastRefreshTime = now;
      console.log(`[${new Date().toISOString()}] Starting token refresh...`);

      const response = await directus.request(
        refresh("json", refresh_token)
      );
      
      console.log(`[${new Date().toISOString()}] Refresh successful, setting new tokens`);
      await setTokens({
        access_token: response.access_token || "",
        refresh_token: response.refresh_token || "",
        expires: Date.now() + (response.expires || 0) - TOKEN_BUFFER,
      });
      
      return response;
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Failed to refresh token:`, error);
      const { expires: ex } = await getTokens();
      if (!ex || Date.now() > ex) {
        shouldLogout = true;
      }
      return null;
    } finally {
      // Clear the promise when done
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};
