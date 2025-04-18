export const checkAccess = async () => {
  try {
    const countryResponse = await fetch(`https://api.country.is/`);
    const countryCode = await countryResponse.json();

    return countryCode?.ip === process.env.NEXT_PUBLIC_COMPANY_IP;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("ERROR check access:", error);
    }

    return false;
  }
};
