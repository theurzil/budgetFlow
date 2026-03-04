import { describe, it, expect } from 'vitest'
import { formatDate, getISODate, getLast7Days, getDayLabel, getLast6Months } from './dateHelpers'

describe('getISODate', () => {
  it('returns a date in YYYY-MM-DD format', () => {
    expect(getISODate()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('formats a given date correctly', () => {
    expect(getISODate(new Date('2024-06-15T12:00:00Z'))).toBe('2024-06-15')
  })
})

describe('formatDate', () => {
  it('returns "Today" for today\'s date', () => {
    const today = getISODate()
    expect(formatDate(today)).toBe('Today')
  })

  it('returns "Yesterday" for yesterday\'s date', () => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    expect(formatDate(getISODate(d))).toBe('Yesterday')
  })

  it('returns formatted date for older dates', () => {
    const result = formatDate('2020-01-15')
    expect(result).toBe('Jan 15, 2020')
  })
})

describe('getLast7Days', () => {
  it('returns exactly 7 entries', () => {
    expect(getLast7Days()).toHaveLength(7)
  })

  it('last entry is today', () => {
    const days = getLast7Days()
    expect(days[6]).toBe(getISODate())
  })

  it('entries are in YYYY-MM-DD format', () => {
    getLast7Days().forEach((d) => {
      expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })
})

describe('getDayLabel', () => {
  it('returns a 3-letter day abbreviation', () => {
    const label = getDayLabel('2024-01-01') // Monday
    expect(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).toContain(label)
  })
})

describe('getLast6Months', () => {
  it('returns exactly 6 entries', () => {
    expect(getLast6Months()).toHaveLength(6)
  })

  it('entries are in YYYY-MM format', () => {
    getLast6Months().forEach((m) => {
      expect(m).toMatch(/^\d{4}-\d{2}$/)
    })
  })

  it('last entry is the current month', () => {
    const months = getLast6Months()
    const now = getISODate().slice(0, 7)
    expect(months[5]).toBe(now)
  })
})
