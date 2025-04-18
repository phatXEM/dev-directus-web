import { CALLING_LIST } from "@/data/common";
import { getCountryCode } from "./getLocale";

export const getCurrentCallingCode = async () => {
  try {
    const countryCode = await getCountryCode();
    const currentCallingCode = CALLING_LIST.find(
      (calling) => calling.name === countryCode
    ) ?? { name: "VN", value: "84" };

    return currentCallingCode;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.log("ERROR getting calling code:", err);
    }

    return { name: "VN", value: "84" };
  }
};
