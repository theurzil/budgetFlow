<script setup lang="ts">
defineProps<{
  title?: string
  noPadding?: boolean
}>()
</script>

<template>
  <div class="card">
    <div v-if="title || $slots.header" class="card-header">
      <slot name="header">
        <h3 class="card-title">{{ title }}</h3>
      </slot>
      <slot name="actions" />
    </div>
    <div :class="['card-body', { 'card-body--no-padding': noPadding }]">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border);
}

.card-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
}

.card-body {
  padding: 1.25rem;
}

.card-body--no-padding {
  padding: 0;
}
</style>
