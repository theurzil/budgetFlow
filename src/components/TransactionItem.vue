<script setup lang="ts">
import type { Transaction } from '@/types'
import { useCurrency } from '@/composables/useCurrency'
import { formatDate } from '@/utils/dateHelpers'
import BaseBadge from './BaseBadge.vue'

defineProps<{
  transaction: Transaction
}>()

const emit = defineEmits<{
  edit: [id: string]
  delete: [id: string]
}>()

const { formatCurrency } = useCurrency()

const categoryLabels: Record<string, string> = {
  // expense
  food: '🍔 Food',
  transport: '🚗 Transport',
  housing: '🏠 Housing',
  entertainment: '🎮 Entertainment',
  health: '❤️ Health',
  work: '💼 Work',
  other: '📦 Other',
  // income
  salary: '💵 Salary',
  freelance: '🧑‍💻 Freelance',
  investment: '📈 Investment',
  gift: '🎁 Gift',
}
</script>

<template>
  <div class="tx-item">
    <div class="tx-main">
      <div class="tx-info">
        <p class="tx-description">{{ transaction.description }}</p>
        <div class="tx-meta">
          <BaseBadge size="sm">{{ categoryLabels[transaction.category] }}</BaseBadge>
          <span class="tx-date">{{ formatDate(transaction.date) }}</span>
        </div>
      </div>
      <div class="tx-right">
        <p :class="['tx-amount', transaction.type === 'income' ? 'tx-amount--income' : 'tx-amount--expense']">
          {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
        </p>
        <div class="tx-actions">
          <button class="tx-action" aria-label="Edit" @click="emit('edit', transaction.id)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button class="tx-action tx-action--danger" aria-label="Delete" @click="emit('delete', transaction.id)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M10 11v6M14 11v6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tx-item {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--border);
  transition: background var(--transition);
}
.tx-item:last-child { border-bottom: none; }
.tx-item:hover { background: var(--bg-hover); }

.tx-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.tx-info {
  min-width: 0;
  flex: 1;
}

.tx-description {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
}

.tx-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tx-date {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.tx-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.tx-amount {
  font-size: 1rem;
  font-weight: 600;
  font-family: var(--font-mono);
}
.tx-amount--income { color: var(--success); }
.tx-amount--expense { color: var(--danger); }

.tx-actions {
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity var(--transition);
}
.tx-item:hover .tx-actions { opacity: 1; }

.tx-action {
  background: none;
  border: none;
  color: var(--text-muted);
  padding: 0.25rem;
  border-radius: var(--radius-sm);
  transition: color var(--transition), background var(--transition);
}
.tx-action:hover { background: var(--bg-secondary); color: var(--text-primary); }
.tx-action--danger:hover { color: var(--danger); }
.tx-action svg { width: 16px; height: 16px; }
</style>
