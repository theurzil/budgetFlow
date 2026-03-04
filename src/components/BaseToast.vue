<script setup lang="ts">
import { useToastStore } from '@/stores/toastStore'

const toastStore = useToastStore()
</script>

<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          :class="['toast', `toast--${toast.variant}`]"
          role="alert"
        >
          <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <template v-if="toast.variant === 'success'">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-linecap="round" />
              <polyline points="22 4 12 14.01 9 11.01" stroke-linecap="round" stroke-linejoin="round" />
            </template>
            <template v-else-if="toast.variant === 'error'">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" stroke-linecap="round" />
              <line x1="12" y1="16" x2="12.01" y2="16" stroke-linecap="round" />
            </template>
            <template v-else>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" stroke-linecap="round" />
              <line x1="12" y1="17" x2="12.01" y2="17" stroke-linecap="round" />
            </template>
          </svg>
          <span>{{ toast.message }}</span>
          <button class="toast-close" @click="toastStore.remove(toast.id)">×</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
  width: max-content;
  max-width: min(420px, 90vw);
  pointer-events: none;
}

.toast {
  pointer-events: all;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  font-size: 0.875rem;
  box-shadow: var(--shadow);
}

.toast--success {
  background: var(--success-soft);
  border-color: var(--success);
  color: var(--success);
}
.toast--error {
  background: var(--danger-soft);
  border-color: var(--danger);
  color: var(--danger);
}
.toast--warning {
  background: var(--warning-soft);
  border-color: var(--warning);
  color: var(--warning);
}

.toast-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.toast span {
  flex: 1;
  color: var(--text-primary);
}

.toast-close {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.25rem;
  line-height: 1;
  padding: 0 0.25rem;
  flex-shrink: 0;
}
.toast-close:hover {
  color: var(--text-primary);
}

/* TransitionGroup */
.toast-enter-active,
.toast-leave-active {
  transition: all 250ms ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
