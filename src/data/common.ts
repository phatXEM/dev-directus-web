import countryCodesList from "country-codes-list";

export const CALLING_LIST = countryCodesList
  .customArray({
    name: "{countryCode}",
    value: "{countryCallingCode}",
  })
  .sort((a, b) => (a.name > b.name ? 1 : -1));
