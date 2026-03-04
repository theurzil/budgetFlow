import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { Transaction, ExpenseCategory } from '@/types'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { generateId } from '@/utils/formatters'
import { getLast6Months } from '@/utils/dateHelpers'

export const useBudgetStore = defineStore('budget', () => {
  const transactions = useLocalStorage<Transaction[]>('budget-transactions', [])

  function addTransaction(data: Omit<Transaction, 'id' | 'createdAt'>) {
    transactions.value.unshift({
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    })
  }

  function deleteTransaction(id: string) {
    transactions.value = transactions.value.filter((t) => t.id !== id)
  }

  function editTransaction(id: string, data: Partial<Omit<Transaction, 'id' | 'createdAt'>>) {
    const idx = transactions.value.findIndex((t) => t.id === id)
    if (idx !== -1) {
      transactions.value[idx] = { ...transactions.value[idx], ...data }
    }
  }

  const totalIncome = computed(() =>
    transactions.value
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
  )

  const totalExpenses = computed(() =>
    transactions.value
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
  )

  const balance = computed(() => totalIncome.value - totalExpenses.value)

  const byCategory = computed(() => {
    const map: Record<ExpenseCategory, number> = {
      food: 0,
      transport: 0,
      housing: 0,
      entertainment: 0,
      health: 0,
      work: 0,
      other: 0,
    }
    transactions.value
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const key = t.category as ExpenseCategory
        map[key] = (map[key] ?? 0) + t.amount
      })
    return map
  })

  const byMonth = computed(() => {
    const months = getLast6Months()
    return months.map((month) => {
      const monthTx = transactions.value.filter((t) => t.date.startsWith(month))
      return {
        month,
        income: monthTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        expenses: monthTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      }
    })
  })

  const recentTransactions = computed(() => transactions.value.slice(0, 5))

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    editTransaction,
    totalIncome,
    totalExpenses,
    balance,
    byCategory,
    byMonth,
    recentTransactions,
  }
})
