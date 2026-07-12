// Helper to extract the symbol from strings like "USD ($)", "INR (Rs)"
export function extractCurrencySymbol(currencyStr: string): string {
  const match = currencyStr.match(/\((.*?)\)/);
  if (match && match[1]) {
    return match[1];
  }
  // Fallback to the whole string if no parentheses
  return currencyStr;
}

// Helper for distance unit
export function formatDistanceUnit(unitStr: string): string {
  if (unitStr.toLowerCase() === "kilometers") return "km";
  if (unitStr.toLowerCase() === "miles") return "mi";
  return unitStr;
}
