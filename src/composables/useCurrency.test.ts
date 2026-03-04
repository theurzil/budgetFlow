import { describe, it, expect } from 'vitest'
import { useCurrency } from './useCurrency'

describe('useCurrency', () => {
  const { formatCurrency, formatCompact } = useCurrency()

  describe('formatCurrency', () => {
    it('formats a whole number', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00')
    })

    it('formats with cents', () => {
      expect(formatCurrency(9.99)).toBe('$9.99')
    })

    it('formats zero', () => {
      expect(formatCurrency(0)).toBe('$0.00')
    })

    it('formats negative values', () => {
      expect(formatCurrency(-50)).toBe('-$50.00')
    })
  })

  describe('formatCompact', () => {
    it('formats thousands with K', () => {
      expect(formatCompact(1500)).toBe('$1.50K')
    })

    it('formats millions with M', () => {
      expect(formatCompact(2_000_000)).toBe('$2M')
    })

    it('falls back to full format for small numbers', () => {
      expect(formatCompact(99)).toBe('$99.00')
    })
  })
})
