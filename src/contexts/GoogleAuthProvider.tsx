"use client";

import { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function GoogleAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      {children}
    </GoogleOAuthProvider>
  );
}