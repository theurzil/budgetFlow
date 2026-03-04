<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
}>()
</script>

<template>
  <button
    :class="['btn', `btn--${variant ?? 'primary'}`, `btn--${size ?? 'md'}`]"
    :disabled="disabled || loading"
    :type="type ?? 'button'"
  >
    <span v-if="loading" class="btn__spinner" />
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 500;
  transition: background var(--transition), color var(--transition), opacity var(--transition);
  white-space: nowrap;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* Sizes */
.btn--sm { padding: 0.375rem 0.75rem; font-size: 0.8125rem; }
.btn--md { padding: 0.5rem 1rem; font-size: 0.875rem; }
.btn--lg { padding: 0.625rem 1.25rem; font-size: 1rem; }

/* Variants */
.btn--primary {
  background: var(--accent);
  color: #fff;
}
.btn--primary:hover:not(:disabled) { background: var(--accent-hover); }

.btn--secondary {
  background: var(--bg-hover);
  color: var(--text-primary);
  border: 1px solid var(--border);
}
.btn--secondary:hover:not(:disabled) { background: var(--bg-card); }

.btn--ghost {
  background: transparent;
  color: var(--text-secondary);
}
.btn--ghost:hover:not(:disabled) {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.btn--danger {
  background: var(--danger);
  color: #fff;
}
.btn--danger:hover:not(:disabled) { background: #dc2626; }

/* Spinner */
.btn__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
