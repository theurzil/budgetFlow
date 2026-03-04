export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'housing'
  | 'entertainment'
  | 'health'
  | 'work'
  | 'other'

export type IncomeCategory =
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'gift'
  | 'other'

export type TransactionCategory = ExpenseCategory | IncomeCategory

export interface Transaction {
  id: string
  amount: number
  description: string
  category: TransactionCategory
  type: 'income' | 'expense'
  date: string
  createdAt: string
}

export interface TimeSession {
  id: string
  project: string
  description: string
  duration: number // seconds
  date: string
  startedAt: string
  endedAt: string
}

export interface ActiveSession {
  project: string
  startedAt: string
  pausedAt: string | null
  totalPaused: number // seconds paused
}

export type ToastVariant = 'success' | 'error' | 'warning'

export interface Toast {
  id: string
  message: string
  variant: ToastVariant
}
