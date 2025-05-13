/**
 * Strava authentication service
 */

interface StravaTokenResponse {
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete?: any;
}

interface StravaAuthResult {
  access_token: string;
  refresh_token: string;
  expires: number;
  athlete?: any;
}

/**
 * Exchange authorization code for tokens
 */
export const exchangeStravaCodeForToken = async (
  code: string
): Promise<StravaAuthResult> => {
  const response = await fetch(`https://www.strava.com/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code: ${error}`);
  }

  const data: StravaTokenResponse = await response.json();

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires: data.expires_at,
    athlete: data.athlete,
  };
};

/**
 * Refresh an expired Strava access token
 */
export const refreshStravaToken = async (
  refreshToken: string
): Promise<StravaAuthResult> => {
  const response = await fetch(`https://www.strava.com/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh token: ${error}`);
  }

  const data: StravaTokenResponse = await response.json();

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires: data.expires_at,
    athlete: data.athlete,
  };
};

/**
 * Get user information from Strava
 */
export const getStravaUserInfo = async (accessToken: string): Promise<any> => {
  const response = await fetch("https://www.strava.com/api/v3/athlete", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get user info: ${error}`);
  }

  return response.json();
};

/**
 * Checks if a token needs to be refreshed (expired or about to expire)
 */
export const isTokenExpired = (expiresAt: number): boolean => {
  // Check if token expires in less than 5 minutes
  const expiryTimeWithBuffer = expiresAt - 300; // 5 minutes buffer
  return Math.floor(Date.now() / 1000) > expiryTimeWithBuffer;
};
