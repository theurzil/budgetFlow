export function useCurrency() {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  function formatCurrency(amount: number): string {
    return formatter.format(amount)
  }

  function formatCompact(amount: number): string {
    if (Math.abs(amount) >= 1_000_000) {
      return formatter.format(amount / 1_000_000).replace(/\.00$/, '') + 'M'
    }
    if (Math.abs(amount) >= 1_000) {
      return formatter.format(amount / 1_000).replace(/\.00$/, '') + 'K'
    }
    return formatCurrency(amount)
  }

  return { formatCurrency, formatCompact }
}
