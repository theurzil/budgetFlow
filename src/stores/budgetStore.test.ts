import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBudgetStore } from './budgetStore'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

const sample = {
  amount: 100,
  description: 'Groceries',
  category: 'food' as const,
  type: 'expense' as const,
  date: '2024-06-01',
}

describe('budgetStore', () => {
  describe('addTransaction', () => {
    it('adds a transaction', () => {
      const store = useBudgetStore()
      store.addTransaction(sample)
      expect(store.transactions).toHaveLength(1)
      expect(store.transactions[0].description).toBe('Groceries')
    })

    it('assigns a unique id', () => {
      const store = useBudgetStore()
      store.addTransaction(sample)
      store.addTransaction(sample)
      const ids = store.transactions.map((t) => t.id)
      expect(new Set(ids).size).toBe(2)
    })
  })

  describe('deleteTransaction', () => {
    it('removes the correct transaction', () => {
      const store = useBudgetStore()
      store.addTransaction(sample)
      const id = store.transactions[0].id
      store.deleteTransaction(id)
      expect(store.transactions).toHaveLength(0)
    })

    it('ignores unknown ids', () => {
      const store = useBudgetStore()
      store.addTransaction(sample)
      store.deleteTransaction('nonexistent')
      expect(store.transactions).toHaveLength(1)
    })
  })

  describe('editTransaction', () => {
    it('updates the correct fields', () => {
      const store = useBudgetStore()
      store.addTransaction(sample)
      const id = store.transactions[0].id
      store.editTransaction(id, { description: 'Updated', amount: 200 })
      expect(store.transactions[0].description).toBe('Updated')
      expect(store.transactions[0].amount).toBe(200)
    })
  })

  describe('getters', () => {
    it('calculates totalIncome', () => {
      const store = useBudgetStore()
      store.addTransaction({ ...sample, type: 'income', amount: 500 })
      store.addTransaction({ ...sample, type: 'income', amount: 300 })
      expect(store.totalIncome).toBe(800)
    })

    it('calculates totalExpenses', () => {
      const store = useBudgetStore()
      store.addTransaction({ ...sample, type: 'expense', amount: 100 })
      store.addTransaction({ ...sample, type: 'expense', amount: 50 })
      expect(store.totalExpenses).toBe(150)
    })

    it('calculates balance correctly', () => {
      const store = useBudgetStore()
      store.addTransaction({ ...sample, type: 'income', amount: 1000 })
      store.addTransaction({ ...sample, type: 'expense', amount: 400 })
      expect(store.balance).toBe(600)
    })

    it('byCategory only sums expenses', () => {
      const store = useBudgetStore()
      store.addTransaction({ ...sample, type: 'expense', category: 'food', amount: 80 })
      store.addTransaction({ ...sample, type: 'income', category: 'food', amount: 999 })
      expect(store.byCategory.food).toBe(80)
    })
  })
})
