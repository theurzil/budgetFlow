<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBudgetStore } from '@/stores/budgetStore'
import { useTimeStore } from '@/stores/timeStore'
import { useExport } from '@/composables/useExport'
import { useCurrency } from '@/composables/useCurrency'
import {
  getISODate,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfLastMonth,
  endOfLastMonth,
  getLast6Months,
  getMonthLabel,
} from '@/utils/dateHelpers'
import { formatDuration } from '@/utils/formatters'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import BaseInput from '@/components/BaseInput.vue'
import ChartDoughnut from '@/components/ChartDoughnut.vue'
import ChartBar from '@/components/ChartBar.vue'

const budgetStore = useBudgetStore()
const timeStore = useTimeStore()
const { exportToCSV, triggerPrint } = useExport()
const { formatCurrency } = useCurrency()

type DateRange = 'this-week' | 'this-month' | 'last-month' | 'custom'
const selectedRange = ref<DateRange>('this-month')
const customStart = ref(getISODate(startOfMonth()))
const customEnd = ref(getISODate())

const rangeOptions = [
  { value: 'this-week', label: 'This Week' },
  { value: 'this-month', label: 'This Month' },
  { value: 'last-month', label: 'Last Month' },
  { value: 'custom', label: 'Custom Range' },
]

const dateRange = computed(() => {
  switch (selectedRange.value) {
    case 'this-week':
      return { start: getISODate(startOfWeek()), end: getISODate(endOfWeek()) }
    case 'this-month':
      return { start: getISODate(startOfMonth()), end: getISODate(endOfMonth()) }
    case 'last-month':
      return { start: getISODate(startOfLastMonth()), end: getISODate(endOfLastMonth()) }
    case 'custom':
      return { start: customStart.value, end: customEnd.value }
  }
})

const filteredTransactions = computed(() =>
  budgetStore.transactions.filter(
    (tx) => tx.date >= dateRange.value.start && tx.date <= dateRange.value.end,
  ),
)

const filteredSessions = computed(() =>
  timeStore.sessions.filter(
    (s) => s.date >= dateRange.value.start && s.date <= dateRange.value.end,
  ),
)

const categoryColors: Record<string, string> = {
  food: '#6c63ff',
  transport: '#22c55e',
  housing: '#f59e0b',
  entertainment: '#ef4444',
  health: '#3b82f6',
  work: '#ec4899',
  other: '#14b8a6',
}

const categoryLabels: Record<string, string> = {
  food: 'Food', transport: 'Transport', housing: 'Housing',
  entertainment: 'Entertainment', health: 'Health', work: 'Work', other: 'Other',
}

const expenseByCategory = computed(() => {
  const map: Record<string, number> = {}
  filteredTransactions.value
    .filter((t) => t.type === 'expense')
    .forEach((t) => { map[t.category] = (map[t.category] ?? 0) + t.amount })
  const entries = Object.entries(map).filter(([, v]) => v > 0)
  return {
    labels: entries.map(([k]) => categoryLabels[k] ?? k),
    values: entries.map(([, v]) => v),
    colors: entries.map(([k]) => categoryColors[k] ?? '#8b8b9e'),
  }
})

const months = computed(() => getLast6Months())
const monthlyLabels = computed(() => months.value.map((m) => getMonthLabel(m + '-01')))
const monthlyIncome = computed(() =>
  months.value.map((m) =>
    budgetStore.transactions
      .filter((t) => t.type === 'income' && t.date.startsWith(m))
      .reduce((s, t) => s + t.amount, 0),
  ),
)
const monthlyExpenses = computed(() =>
  months.value.map((m) =>
    budgetStore.transactions
      .filter((t) => t.type === 'expense' && t.date.startsWith(m))
      .reduce((s, t) => s + t.amount, 0),
  ),
)

const projectData = computed(() => {
  const map: Record<string, number> = {}
  filteredSessions.value.forEach((s) => {
    map[s.project] = (map[s.project] ?? 0) + s.duration / 3600
  })
  const entries = Object.entries(map).sort(([, a], [, b]) => b - a)
  return {
    labels: entries.map(([k]) => k),
    values: entries.map(([, v]) => v),
  }
})

const rangeIncome = computed(() =>
  filteredTransactions.value.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
)
const rangeExpenses = computed(() =>
  filteredTransactions.value.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
)
const rangeHours = computed(() =>
  filteredSessions.value.reduce((s, sess) => s + sess.duration, 0) / 3600,
)

function exportBudgetCSV() {
  const rows = filteredTransactions.value.map((t) => ({
    Date: t.date,
    Type: t.type,
    Category: t.category,
    Description: t.description,
    Amount: t.amount.toFixed(2),
  }))
  exportToCSV(rows as unknown as Record<string, unknown>[], 'budget-export')
}

function exportTimeCSV() {
  const rows = filteredSessions.value.map((s) => ({
    Date: s.date,
    Project: s.project,
    Description: s.description,
    'Duration (seconds)': s.duration,
    'Duration (formatted)': formatDuration(s.duration),
    Started: s.startedAt,
    Ended: s.endedAt,
  }))
  exportToCSV(rows as unknown as Record<string, unknown>[], 'time-export')
}
</script>

<template>
  <div class="reports-view">
    <div class="page-header">
      <div>
        <h1>Reports</h1>
        <p class="page-subtitle">Analyze your data</p>
      </div>
      <div class="export-buttons no-print">
        <BaseButton variant="secondary" @click="exportBudgetCSV">📥 Export Budget CSV</BaseButton>
        <BaseButton variant="secondary" @click="exportTimeCSV">📥 Export Time CSV</BaseButton>
        <BaseButton variant="ghost" @click="triggerPrint">🖨️ Print PDF</BaseButton>
      </div>
    </div>

    <!-- Date range picker -->
    <BaseCard title="Date Range" class="no-print">
      <div class="range-controls">
        <BaseSelect v-model="selectedRange" :options="rangeOptions" />
        <template v-if="selectedRange === 'custom'">
          <BaseInput v-model="customStart" type="date" label="From" />
          <BaseInput v-model="customEnd" type="date" label="To" />
        </template>
      </div>
    </BaseCard>

    <!-- Period summary -->
    <div class="period-summary">
      <div class="period-stat">
        <span class="period-label">Income</span>
        <span class="period-value period-value--income">{{ formatCurrency(rangeIncome) }}</span>
      </div>
      <div class="period-stat">
        <span class="period-label">Expenses</span>
        <span class="period-value period-value--expense">{{ formatCurrency(rangeExpenses) }}</span>
      </div>
      <div class="period-stat">
        <span class="period-label">Net</span>
        <span :class="['period-value', rangeIncome - rangeExpenses >= 0 ? 'period-value--income' : 'period-value--expense']">
          {{ formatCurrency(rangeIncome - rangeExpenses) }}
        </span>
      </div>
      <div class="period-stat">
        <span class="period-label">Time Logged</span>
        <span class="period-value period-value--accent">{{ rangeHours.toFixed(1) }}h</span>
      </div>
    </div>

    <!-- Charts grid -->
    <div class="charts-grid">
      <BaseCard title="Expenses by Category">
        <div v-if="expenseByCategory.values.length">
          <ChartDoughnut
            :labels="expenseByCategory.labels"
            :values="expenseByCategory.values"
            :colors="expenseByCategory.colors"
          />
        </div>
        <div v-else class="empty-state">No expense data for this period.</div>
      </BaseCard>

      <BaseCard title="Income vs Expenses (Last 6 Months)">
        <ChartBar
          :labels="monthlyLabels"
          :datasets="[
            { label: 'Income', data: monthlyIncome, color: '#22c55e' },
            { label: 'Expenses', data: monthlyExpenses, color: '#ef4444' },
          ]"
          y-prefix="$"
        />
      </BaseCard>

      <BaseCard title="Time by Project" class="span-2">
        <div v-if="projectData.labels.length">
          <ChartBar
            :labels="projectData.labels"
            :datasets="[{ label: 'Hours', data: projectData.values, color: '#6c63ff' }]"
            :height="200"
          />
        </div>
        <div v-else class="empty-state">No time data for this period.</div>
      </BaseCard>
    </div>
  </div>
</template>

<style scoped>
.reports-view {
  padding: 2rem 2.5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.page-header h1 { margin-bottom: 0.25rem; }
.page-subtitle { color: var(--text-muted); font-size: 0.9375rem; }

.export-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.range-controls {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
  flex-wrap: wrap;
}

.period-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.period-stat {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 1rem 1.25rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.period-label {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.period-value {
  font-size: 1.375rem;
  font-weight: 700;
  font-family: var(--font-mono);
}
.period-value--income { color: var(--success); }
.period-value--expense { color: var(--danger); }
.period-value--accent { color: var(--accent); }

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 1.25rem;
}

.span-2 {
  grid-column: 1 / -1;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--text-muted);
}

@media (max-width: 1024px) {
  .period-summary { grid-template-columns: repeat(2, 1fr); }
  .charts-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .reports-view { padding: 1.25rem; }
  .period-summary { grid-template-columns: 1fr 1fr; }
  .page-header { flex-direction: column; }
}

@media print {
  .reports-view { padding: 0; }
  .charts-grid { grid-template-columns: 1fr 1fr; }
}
</style>
