const TRUNCATE_STRING_LENGTH = 24;
const TRUNCATE_STRING_LAST_LENGTH = 5;

export const formatNumberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const truncateString = (
  str: string,
  str_len = TRUNCATE_STRING_LENGTH,
  str_last_len = TRUNCATE_STRING_LAST_LENGTH
) => {
  return str.length > str_len
    ? str.slice(0, str_len - (str_last_len + 3)) +
        "..." +
        str.slice(str.length - str_last_len)
    : str;
};

export const truncateLink = (link: string) => {
  return link
    .replace("https://", "")
    .replace("http://", "")
    .replace("www.", "");
};

export const formatNumber = (
  amount: number | string,
  currencySymbol: string = "",
  decimalPlaces: number = 2,
  short: boolean = false,
  showSmallNumbers: boolean = false
): string => {
  let amountNumber: number;

  try {
    amountNumber = parseFloat(amount.toString()); // Handle both number and string inputs
    if (isNaN(amountNumber)) {
      return ""; // Return empty string for invalid inputs
    }
  } catch (error) {
    return "";
  }

  // If short is true, convert large numbers to shorthand notation
  if (short) {
    if (amountNumber >= 1_000_000_000) {
      amountNumber = amountNumber / 1_000_000_000; // Convert to billions
      return `${currencySymbol}${amountNumber.toFixed(decimalPlaces)}B`;
    } else if (amountNumber >= 1_000_000) {
      amountNumber = amountNumber / 1_000_000; // Convert to millions
      return `${currencySymbol}${amountNumber.toFixed(decimalPlaces)}M`;
    } else if (amountNumber >= 1_000) {
      amountNumber = amountNumber / 1_000; // Convert to thousands
      return `${currencySymbol}${amountNumber.toFixed(decimalPlaces)}K`;
    }
  }

  // If showSmallNumbers is true, handle very small numbers with precision
  if (
    showSmallNumbers &&
    Math.abs(amountNumber) > 0 &&
    Math.abs(amountNumber) < Math.pow(10, -decimalPlaces)
  ) {
    const smallNumberString = amountNumber.toFixed(15); // Force fixed-point representation
    const match = smallNumberString.match(/(0\.0*)(\d+)/); // Regex to find trailing zeros and non-zero part
    if (match) {
      const [_, leadingZeros, trailingDigits] = match;
      return `${currencySymbol}0.0${
        leadingZeros.length > 3 ? `{${leadingZeros.length - 3}}` : ""
      }${trailingDigits}`;
    }
  }

  // For non-short format or smaller numbers, format with commas
  const hasFraction = amountNumber % 1 !== 0;
  const formattedAmount = Math.abs(amountNumber).toLocaleString(undefined, {
    minimumFractionDigits: hasFraction ? decimalPlaces : 0,
    maximumFractionDigits: decimalPlaces,
  });

  // Remove trailing zeros after the decimal point
  const formattedAmountWithoutTrailingZeros = hasFraction
    ? formattedAmount.replace(/(\.\d*?[1-9])0+$/g, "$1")
    : formattedAmount;

  let result = `${currencySymbol}${formattedAmountWithoutTrailingZeros}`;
  if (amountNumber < 0) {
    result = `-${result}`;
  }

  return result;
};
