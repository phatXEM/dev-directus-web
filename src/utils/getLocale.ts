export const getLocaleByIP = async () => {
  try {
    const countryResponse = await fetch(`https://api.country.is/`);
    const countryCode = await countryResponse.json();

    return countryCode?.country === "VN" ? "vi-VN" : "en-US";
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("ERROR getLocaleByIP:", error);
    }

    return "en-US";
  }
};

export const getCountryCode = async () => {
  try {
    const countryResponse = await fetch(`https://api.country.is/`);
    const countryCode = await countryResponse.json();

    return countryCode?.country ?? "VN";
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("ERROR fetching user country:", error);
    }

    const countryResponse = await fetch(`https://ipinfo.io/json`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_IP_INFO_TOKEN}`,
      },
    });
    const countryCode = await countryResponse.json();

    return countryCode?.country ?? "VN";
  }
};
