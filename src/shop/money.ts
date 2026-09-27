// Stripe amounts use the currency's minor unit. ISK and UGX are exceptions:
// Stripe expects two-decimal amounts for charges even though Intl displays
// them without fractional digits.
export function formatMoney(minorUnits: number, currency: string): string {
  const code = currency.toUpperCase();
  try {
    const formatter = new Intl.NumberFormat(undefined, { style: 'currency', currency: code });
    const digits = code === 'ISK' || code === 'UGX' ? 2 : (formatter.resolvedOptions().maximumFractionDigits ?? 2);
    return formatter.format(minorUnits / 10 ** digits);
  } catch {
    return `${minorUnits} ${code} (minor units)`;
  }
}
