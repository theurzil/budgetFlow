export function formatDate(isoString: string): string {
  const date = new Date(isoString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const normalize = (d: Date) => d.toDateString()

  if (normalize(date) === normalize(today)) return 'Today'
  if (normalize(date) === normalize(yesterday)) return 'Yesterday'

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatDateShort(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function getISODate(date = new Date()): string {
  return date.toISOString().split('T')[0]
}

export function startOfWeek(date = new Date()): Date {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - day)
  d.setHours(0, 0, 0, 0)
  return d
}

export function endOfWeek(date = new Date()): Date {
  const d = startOfWeek(date)
  d.setDate(d.getDate() + 6)
  d.setHours(23, 59, 59, 999)
  return d
}

export function startOfMonth(date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function endOfMonth(date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
}

export function startOfLastMonth(date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1)
}

export function endOfLastMonth(date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 0, 23, 59, 59, 999)
}

export function getLast7Days(): string[] {
  const days: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(getISODate(d))
  }
  return days
}

export function getDayLabel(isoDate: string): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days[new Date(isoDate + 'T12:00:00').getDay()]
}

export function getMonthLabel(isoDate: string): string {
  return new Date(isoDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short' })
}

export function getLast6Months(): string[] {
  const months: string[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i, 1)
    months.push(getISODate(d).slice(0, 7)) // YYYY-MM
  }
  return months
}
