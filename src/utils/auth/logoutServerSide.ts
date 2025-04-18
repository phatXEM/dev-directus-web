import { signOut } from "@/libs/auth";
import { setRedirectPath } from "./setRedirectPath";
import { setTokens } from "./tokenHandler";

export const logoutServerSide = async () => {
  await setTokens({
    access_token: "",
    refresh_token: "",
    expires: 0,
  });
  await setRedirectPath();
  await signOut();
};
