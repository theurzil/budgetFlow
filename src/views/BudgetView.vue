<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useBudgetStore } from '@/stores/budgetStore'
import { useToastStore } from '@/stores/toastStore'
import { useCurrency } from '@/composables/useCurrency'
import type { Transaction, TransactionCategory } from '@/types'
import { getISODate } from '@/utils/dateHelpers'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import BaseModal from '@/components/BaseModal.vue'
import BaseBadge from '@/components/BaseBadge.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import TransactionItem from '@/components/TransactionItem.vue'

const budgetStore = useBudgetStore()
const toastStore = useToastStore()
const { formatCurrency } = useCurrency()

// Filter state
const filterType = ref<'all' | 'income' | 'expense'>('all')
const filterCategory = ref<string>('all')
const searchQuery = ref('')

// Form state
const showForm = ref(false)
const editingId = ref<string | null>(null)

interface FormState {
  amount: string
  description: string
  category: TransactionCategory | ''
  type: 'income' | 'expense'
  date: string
}

const emptyForm = (): FormState => ({
  amount: '',
  description: '',
  category: '',
  type: 'expense',
  date: getISODate(),
})

const form = ref<FormState>(emptyForm())
const errors = ref<Partial<Record<keyof FormState, string>>>({})

// Reset category when switching type so no cross-contamination
watch(() => form.value.type, () => {
  form.value.category = ''
})

// Delete confirm
const confirmId = ref<string | null>(null)

const expenseCategoryOptions = [
  { value: 'food', label: '🍔 Food' },
  { value: 'transport', label: '🚗 Transport' },
  { value: 'housing', label: '🏠 Housing' },
  { value: 'entertainment', label: '🎮 Entertainment' },
  { value: 'health', label: '❤️ Health' },
  { value: 'work', label: '💼 Work' },
  { value: 'other', label: '📦 Other' },
]

const incomeCategoryOptions = [
  { value: 'salary', label: '💵 Salary' },
  { value: 'freelance', label: '🧑‍💻 Freelance' },
  { value: 'investment', label: '📈 Investment' },
  { value: 'gift', label: '🎁 Gift' },
  { value: 'other', label: '📦 Other' },
]

// Switches based on current form type selection
const categoryOptions = computed(() =>
  form.value.type === 'income' ? incomeCategoryOptions : expenseCategoryOptions,
)

const typeOptions = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
]

const filterTypeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
]

const allCategoryOptions = [...expenseCategoryOptions, ...incomeCategoryOptions]
const filterCategoryOptions = [
  { value: 'all', label: 'All Categories' },
  ...allCategoryOptions.filter((o, i, arr) => arr.findIndex((x) => x.value === o.value) === i),
]

const filteredTransactions = computed(() => {
  return budgetStore.transactions.filter((tx) => {
    if (filterType.value !== 'all' && tx.type !== filterType.value) return false
    if (filterCategory.value !== 'all' && tx.category !== filterCategory.value) return false
    if (
      searchQuery.value &&
      !tx.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
      return false
    return true
  })
})

function validate(): boolean {
  errors.value = {}
  if (!form.value.amount || isNaN(Number(form.value.amount)) || Number(form.value.amount) <= 0) {
    errors.value.amount = 'Enter a valid positive amount'
  }
  if (!form.value.description.trim()) {
    errors.value.description = 'Description is required'
  }
  if (!form.value.category) {
    errors.value.category = 'Select a category'
  }
  if (!form.value.date) {
    errors.value.date = 'Date is required'
  }
  return Object.keys(errors.value).length === 0
}

function openAdd() {
  form.value = emptyForm()
  editingId.value = null
  errors.value = {}
  showForm.value = true
}

function openEdit(id: string) {
  const tx = budgetStore.transactions.find((t) => t.id === id)
  if (!tx) return
  form.value = {
    amount: String(tx.amount),
    description: tx.description,
    category: tx.category,
    type: tx.type,
    date: tx.date,
  }
  editingId.value = id
  errors.value = {}
  showForm.value = true
}

function submit() {
  if (!validate()) return
  const data = {
    amount: Number(form.value.amount),
    description: form.value.description.trim(),
    category: form.value.category as TransactionCategory,
    type: form.value.type,
    date: form.value.date,
  }
  if (editingId.value) {
    budgetStore.editTransaction(editingId.value, data)
    toastStore.show('Transaction updated')
  } else {
    budgetStore.addTransaction(data)
    toastStore.show('Transaction added')
  }
  showForm.value = false
}

function requestDelete(id: string) {
  confirmId.value = id
}

function confirmDelete() {
  if (confirmId.value) {
    budgetStore.deleteTransaction(confirmId.value)
    toastStore.show('Transaction deleted', 'error')
    confirmId.value = null
  }
}
</script>

<template>
  <div class="view">
    <div class="page-header">
      <div>
        <h1>Budget Tracker</h1>
        <p class="page-subtitle">Track your income and expenses</p>
      </div>
      <BaseButton @click="openAdd">+ Add Transaction</BaseButton>
    </div>

    <!-- Balance summary -->
    <div class="balance-strip">
      <div class="balance-item">
        <span class="balance-label">Income</span>
        <span class="balance-value balance-value--income">{{ formatCurrency(budgetStore.totalIncome) }}</span>
      </div>
      <div class="balance-divider" />
      <div class="balance-item">
        <span class="balance-label">Expenses</span>
        <span class="balance-value balance-value--expense">{{ formatCurrency(budgetStore.totalExpenses) }}</span>
      </div>
      <div class="balance-divider" />
      <div class="balance-item">
        <span class="balance-label">Balance</span>
        <span :class="['balance-value', budgetStore.balance >= 0 ? 'balance-value--income' : 'balance-value--expense']">
          {{ formatCurrency(budgetStore.balance) }}
        </span>
      </div>
    </div>

    <!-- Filters -->
    <BaseCard>
      <div class="filters">
        <BaseInput v-model="searchQuery" placeholder="Search transactions..." />
        <BaseSelect v-model="filterType" :options="filterTypeOptions" />
        <BaseSelect v-model="filterCategory" :options="filterCategoryOptions" />
      </div>
    </BaseCard>

    <!-- Transactions list -->
    <BaseCard :no-padding="true">
      <template #header>
        <h3 class="card-title">
          Transactions
          <BaseBadge size="sm" variant="accent">{{ filteredTransactions.length }}</BaseBadge>
        </h3>
      </template>

      <div v-if="filteredTransactions.length">
        <TransactionItem
          v-for="tx in filteredTransactions"
          :key="tx.id"
          :transaction="tx"
          @edit="openEdit"
          @delete="requestDelete"
        />
      </div>
      <div v-else class="empty-state">
        <p v-if="searchQuery || filterType !== 'all' || filterCategory !== 'all'">
          No transactions match your filters.
        </p>
        <p v-else>No transactions yet. Click "Add Transaction" to get started.</p>
      </div>
    </BaseCard>

    <!-- Add/Edit Modal -->
    <BaseModal
      :open="showForm"
      :title="editingId ? 'Edit Transaction' : 'Add Transaction'"
      @close="showForm = false"
    >
      <form class="tx-form" @submit.prevent="submit">
        <div class="form-row">
          <BaseSelect
            v-model="form.type"
            label="Type"
            :options="typeOptions"
            required
          />
          <BaseInput
            v-model="form.amount"
            label="Amount"
            type="number"
            placeholder="0.00"
            :error="errors.amount"
            required
          />
        </div>
        <BaseInput
          v-model="form.description"
          label="Description"
          placeholder="e.g. Grocery shopping"
          :error="errors.description"
          required
        />
        <div class="form-row">
          <BaseSelect
            v-model="form.category"
            label="Category"
            :options="categoryOptions"
            placeholder="Select category"
            :error="errors.category"
            required
          />
          <BaseInput
            v-model="form.date"
            label="Date"
            type="date"
            :error="errors.date"
            required
          />
        </div>
      </form>
      <template #footer>
        <BaseButton variant="ghost" @click="showForm = false">Cancel</BaseButton>
        <BaseButton @click="submit">{{ editingId ? 'Update' : 'Add' }}</BaseButton>
      </template>
    </BaseModal>

    <!-- Confirm delete modal -->
    <ConfirmModal
      :open="!!confirmId"
      message="Are you sure you want to delete this transaction? This action cannot be undone."
      @confirm="confirmDelete"
      @cancel="confirmId = null"
    />
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}
.page-header h1 { margin-bottom: 0.25rem; }
.page-subtitle { color: var(--text-muted); font-size: 0.9375rem; }

.balance-strip {
  display: flex;
  align-items: center;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.25rem 2rem;
  gap: 2rem;
}

.balance-divider {
  width: 1px;
  height: 40px;
  background: var(--border);
}

.balance-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.balance-label {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.balance-value {
  font-size: 1.5rem;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--text-primary);
}
.balance-value--income { color: var(--success); }
.balance-value--expense { color: var(--danger); }

.filters {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.75rem;
  align-items: end;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: var(--text-muted);
}

.tx-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

@media (max-width: 640px) {
  .balance-strip { padding: 1rem; gap: 1rem; }
  .balance-value { font-size: 1.125rem; }
  .filters { grid-template-columns: 1fr; }
  .form-row { grid-template-columns: 1fr; }
  .page-header { flex-direction: column; }
}
</style>
