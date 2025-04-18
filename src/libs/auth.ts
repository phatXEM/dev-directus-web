import NextAuth, { DefaultSession } from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { directus } from "./directus";
import {
  login,
  readMe,
  registerUser,
  updateMe,
  withToken,
} from "@directus/sdk";
import { setTokens } from "@/utils/auth/tokenHandler";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials): Promise<any> {
        if (credentials === null) return null;

        const { email, password, otp, ...params } = credentials as {
          email: string;
          password: string;
          otp: string;
          fromRegister?: boolean;
          full_name?: string;
          gender?: string;
          phone?: string;
          country_code?: string;
        };

        try {
          if (params?.fromRegister) {
            const registerAPI = await directus.request(
              registerUser(email, password)
            );
          }

          // Login API
          const loginAPI = await directus.request(
            login(email, password, { mode: "json", ...(otp && { otp }) })
          );

          if (loginAPI && loginAPI.access_token) {
            // Set token to cookie
            setTokens({
              access_token: loginAPI.access_token,
              refresh_token: loginAPI.refresh_token || "",
              expires: Date.now() + (loginAPI.expires || 0) - 60000,
            });

            // Get user profile
            const getProfileAPI = await directus.request(
              withToken(loginAPI.access_token, readMe())
            );

            if (params?.fromRegister) {
              const updateProfileAPI = await directus.request(
                withToken(
                  loginAPI.access_token,
                  updateMe({
                    full_name: params?.full_name ?? "",
                    gender: params?.gender ?? "",
                    phone: params?.phone ?? "",
                    country_code: params?.country_code ?? "",
                    ...(!getProfileAPI?.referrer_id && {
                      referrer_id: process.env.SOC_DEV_ID,
                    }),
                  })
                )
              );

              return { ...loginAPI, ...updateProfileAPI };
            }

            return { ...loginAPI, ...getProfileAPI };
          } else {
            return null;
          }
        } catch (err: any) {
          if (process.env.NODE_ENV === "development") {
            console.log("---- ERROR credentials", err);
          }

          if (err?.errors?.[0]) {
            throw new Error(
              err?.errors?.[0]?.extensions?.code ?? "INVALID_CREDENTIALS"
            );
          }
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial Login
      if (account && user) {
        return {
          ...token,
          ...account,
          ...user,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token?.expires) {
        return token;
      }

      return token;
    },
    async session({ session, token, user }) {
      session.user = { ...token } as any;

      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    user: {
      access_token: string;
      refresh_token: string;
      email: string;
      full_name: string;
      username: string;
      avatar: string | null;
      id: string;
      first_name: string;
      last_name: string;
      phone: string;
      kyc_verified: boolean;
      gender: string;
      birthday: string;
      country_code: string;
      referrer_id: string;
    } & DefaultSession["user"];
  }
}
