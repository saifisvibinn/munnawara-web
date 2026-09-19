const ARABIC_INDIC_DIGITS = "٠١٢٣٤٥٦٧٨٩"

/** Convert Western digits to Arabic-Indic when locale is Arabic. */
export const toLocaleDigits = (
  value: string | number,
  locale: string,
): string => {
  const text = String(value)
  if (!locale.startsWith("ar")) return text
  return text.replace(/\d/g, (digit) => ARABIC_INDIC_DIGITS[Number(digit)] ?? digit)
}
