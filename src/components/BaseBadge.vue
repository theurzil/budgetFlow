<script setup lang="ts">
defineProps<{
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'accent'
  size?: 'sm' | 'md'
}>()
</script>

<template>
  <span :class="['badge', `badge--${variant ?? 'default'}`, `badge--${size ?? 'md'}`]">
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  border-radius: 999px;
  white-space: nowrap;
}

.badge--sm { padding: 0.125rem 0.5rem; font-size: 0.75rem; }
.badge--md { padding: 0.25rem 0.625rem; font-size: 0.8125rem; }

.badge--default {
  background: var(--bg-hover);
  color: var(--text-secondary);
}
.badge--success {
  background: var(--success-soft);
  color: var(--success);
}
.badge--danger {
  background: var(--danger-soft);
  color: var(--danger);
}
.badge--warning {
  background: var(--warning-soft);
  color: var(--warning);
}
.badge--accent {
  background: var(--accent-soft);
  color: var(--accent);
}
</style>
