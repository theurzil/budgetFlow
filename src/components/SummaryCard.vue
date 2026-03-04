<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  label: string
  value: number
  prefix?: string
  suffix?: string
  variant?: 'default' | 'success' | 'danger' | 'accent'
  icon: string
  decimals?: number
}>()

const displayValue = ref(0)

function animateTo(target: number) {
  const start = displayValue.value
  const diff = target - start
  const duration = 600
  const startTime = performance.now()

  function step(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 3) // cubic ease-out
    displayValue.value = start + diff * ease
    if (progress < 1) requestAnimationFrame(step)
    else displayValue.value = target
  }

  requestAnimationFrame(step)
}

onMounted(() => animateTo(props.value))
watch(() => props.value, (newVal) => animateTo(newVal))

function fmt(val: number) {
  const decimals = props.decimals ?? 0
  return val.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
</script>

<template>
  <div :class="['summary-card', `summary-card--${variant ?? 'default'}`]">
    <div class="summary-icon">{{ icon }}</div>
    <div class="summary-content">
      <p class="summary-label">{{ label }}</p>
      <p class="summary-value">
        <span v-if="prefix" class="summary-prefix">{{ prefix }}</span>
        {{ fmt(displayValue) }}
        <span v-if="suffix" class="summary-suffix">{{ suffix }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.summary-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition: border-color var(--transition);
}

.summary-card--success { border-color: rgba(34, 197, 94, 0.3); }
.summary-card--danger { border-color: rgba(239, 68, 68, 0.3); }
.summary-card--accent { border-color: rgba(108, 99, 255, 0.3); }

.summary-icon {
  font-size: 1.75rem;
  line-height: 1;
  flex-shrink: 0;
}

.summary-content {
  min-width: 0;
}

.summary-label {
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}

.summary-value {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.summary-prefix,
.summary-suffix {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.summary-card--success .summary-value { color: var(--success); }
.summary-card--danger .summary-value { color: var(--danger); }
.summary-card--accent .summary-value { color: var(--accent); }
</style>
