/** Split display values like "+1500" into prefix / number / suffix for count-up. */
export const parseStatValue = (value: string) => {
  const match = value.match(/^(\D*?)(\d+)(\D*)$/)
  if (!match) {
    return { prefix: "", target: 0, suffix: value }
  }

  return {
    prefix: match[1] ?? "",
    target: Number(match[2]),
    suffix: match[3] ?? "",
  }
}
