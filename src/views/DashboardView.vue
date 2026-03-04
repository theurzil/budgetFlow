<script setup lang="ts">
import { computed } from 'vue'
import { useBudgetStore } from '@/stores/budgetStore'
import { useTimeStore } from '@/stores/timeStore'
import { useCurrency } from '@/composables/useCurrency'
import SummaryCard from '@/components/SummaryCard.vue'
import BaseCard from '@/components/BaseCard.vue'
import ChartDoughnut from '@/components/ChartDoughnut.vue'
import ChartBar from '@/components/ChartBar.vue'
import TransactionItem from '@/components/TransactionItem.vue'
import SessionItem from '@/components/SessionItem.vue'
import { formatDate } from '@/utils/dateHelpers'
import { formatDuration } from '@/utils/formatters'
import { getMonthLabel } from '@/utils/dateHelpers'

const budgetStore = useBudgetStore()
const timeStore = useTimeStore()
const { formatCurrency } = useCurrency()

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
  food: 'Food',
  transport: 'Transport',
  housing: 'Housing',
  entertainment: 'Entertainment',
  health: 'Health',
  work: 'Work',
  other: 'Other',
}

const doughnutData = computed(() => {
  const entries = Object.entries(budgetStore.byCategory).filter(([, v]) => v > 0)
  return {
    labels: entries.map(([k]) => categoryLabels[k]),
    values: entries.map(([, v]) => v),
    colors: entries.map(([k]) => categoryColors[k]),
  }
})

const hasExpenses = computed(() => doughnutData.value.values.length > 0)

const monthlyLabels = computed(() =>
  budgetStore.byMonth.map((m) => getMonthLabel(m.month + '-01')),
)
const monthlyIncome = computed(() => budgetStore.byMonth.map((m) => m.income))
const monthlyExpenses = computed(() => budgetStore.byMonth.map((m) => m.expenses))
</script>

<template>
  <div class="view">
    <div class="page-header">
      <h1>Dashboard</h1>
      <p class="page-subtitle">Your financial & time overview</p>
    </div>

    <!-- Summary cards -->
    <div class="summary-grid">
      <SummaryCard
        label="Total Income"
        :value="budgetStore.totalIncome"
        prefix="$"
        :decimals="2"
        icon="📈"
        variant="success"
      />
      <SummaryCard
        label="Total Expenses"
        :value="budgetStore.totalExpenses"
        prefix="$"
        :decimals="2"
        icon="📉"
        variant="danger"
      />
      <SummaryCard
        label="Net Balance"
        :value="budgetStore.balance"
        prefix="$"
        :decimals="2"
        icon="💰"
        :variant="budgetStore.balance >= 0 ? 'success' : 'danger'"
      />
      <SummaryCard
        label="Hours Logged"
        :value="timeStore.totalHours"
        :decimals="1"
        suffix="h"
        icon="⏱️"
        variant="accent"
      />
    </div>

    <!-- Charts -->
    <div class="charts-grid">
      <BaseCard title="Expense Breakdown">
        <div v-if="hasExpenses">
          <ChartDoughnut
            :labels="doughnutData.labels"
            :values="doughnutData.values"
            :colors="doughnutData.colors"
          />
        </div>
        <div v-else class="empty-state">
          <p>No expense data yet.</p>
        </div>
      </BaseCard>

      <BaseCard title="Income vs Expenses">
        <ChartBar
          :labels="monthlyLabels"
          :datasets="[
            { label: 'Income', data: monthlyIncome, color: '#22c55e' },
            { label: 'Expenses', data: monthlyExpenses, color: '#ef4444' },
          ]"
          y-prefix="$"
        />
      </BaseCard>
    </div>

    <!-- Recent lists -->
    <div class="recent-grid">
      <BaseCard title="Recent Transactions" :no-padding="true">
        <template #actions>
          <RouterLink to="/budget" class="card-link">View all</RouterLink>
        </template>
        <div v-if="budgetStore.recentTransactions.length">
          <TransactionItem
            v-for="tx in budgetStore.recentTransactions"
            :key="tx.id"
            :transaction="tx"
            @edit="() => {}"
            @delete="() => {}"
          />
        </div>
        <div v-else class="empty-state">
          <p>No transactions yet. <RouterLink to="/budget">Add one →</RouterLink></p>
        </div>
      </BaseCard>

      <BaseCard title="Recent Time Entries" :no-padding="true">
        <template #actions>
          <RouterLink to="/time" class="card-link">View all</RouterLink>
        </template>
        <div v-if="timeStore.recentSessions.length">
          <div v-for="session in timeStore.recentSessions" :key="session.id" class="recent-session">
            <div>
              <p class="recent-session-project">{{ session.project }}</p>
              <p class="recent-session-date">{{ formatDate(session.date) }}</p>
            </div>
            <span class="recent-session-duration">{{ formatDuration(session.duration) }}</span>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>No sessions yet. <RouterLink to="/time">Start tracking →</RouterLink></p>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<style scoped>
.page-header h1 { margin-bottom: 0.25rem; }
.page-subtitle { color: var(--text-muted); font-size: 0.9375rem; }

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 1.25rem;
}

.recent-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.card-link {
  font-size: 0.8125rem;
  color: var(--accent);
  font-weight: 500;
}
.card-link:hover { text-decoration: underline; }

.empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9375rem;
}
.empty-state a { color: var(--accent); }

.recent-session {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
}
.recent-session:last-child { border-bottom: none; }
.recent-session-project { font-weight: 500; font-size: 0.9375rem; color: var(--text-primary); }
.recent-session-date { font-size: 0.75rem; color: var(--text-muted); }
.recent-session-duration {
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--accent);
  font-size: 0.9375rem;
}

@media (max-width: 1024px) {
  .summary-grid { grid-template-columns: repeat(2, 1fr); }
  .charts-grid { grid-template-columns: 1fr; }
  .recent-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .summary-grid { grid-template-columns: 1fr 1fr; }
}
</style>
