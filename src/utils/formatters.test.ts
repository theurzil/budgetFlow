import { describe, it, expect } from 'vitest'
import { generateId, formatDuration, formatDurationFull, formatHours } from './formatters'

describe('generateId', () => {
  it('returns a non-empty string', () => {
    expect(typeof generateId()).toBe('string')
    expect(generateId().length).toBeGreaterThan(0)
  })

  it('returns unique values', () => {
    expect(generateId()).not.toBe(generateId())
  })
})

describe('formatDuration', () => {
  it('formats seconds only', () => {
    expect(formatDuration(45)).toBe('45s')
  })

  it('formats minutes and seconds', () => {
    expect(formatDuration(90)).toBe('1m 30s')
  })

  it('formats hours and minutes', () => {
    expect(formatDuration(3661)).toBe('1h 1m')
  })

  it('handles zero', () => {
    expect(formatDuration(0)).toBe('0s')
  })
})

describe('formatDurationFull', () => {
  it('formats as HH:MM:SS', () => {
    expect(formatDurationFull(3661)).toBe('01:01:01')
  })

  it('pads single digits', () => {
    expect(formatDurationFull(65)).toBe('00:01:05')
  })

  it('handles zero', () => {
    expect(formatDurationFull(0)).toBe('00:00:00')
  })
})

describe('formatHours', () => {
  it('converts seconds to hours with one decimal', () => {
    expect(formatHours(3600)).toBe('1.0h')
    expect(formatHours(5400)).toBe('1.5h')
  })

  it('handles zero', () => {
    expect(formatHours(0)).toBe('0.0h')
  })
})
