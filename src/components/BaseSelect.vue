<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  options: { value: string; label: string }[]
  error?: string
  disabled?: boolean
  required?: boolean
  placeholder?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="select-group">
    <label v-if="label" class="select-label">
      {{ label }}
      <span v-if="required" class="select-required">*</span>
    </label>
    <div class="select-wrapper">
      <select
        :value="modelValue"
        :disabled="disabled"
        :class="['select', { 'select--error': error }]"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="opt in options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <svg class="select-arrow" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </div>
    <p v-if="error" class="select-error">{{ error }}</p>
  </div>
</template>

<style scoped>
.select-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.select-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.select-required {
  color: var(--danger);
  margin-left: 2px;
}

.select-wrapper {
  position: relative;
}

.select {
  width: 100%;
  padding: 0.5rem 2.25rem 0.5rem 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 0.875rem;
  appearance: none;
  cursor: pointer;
  transition: border-color var(--transition);
}

.select:focus {
  outline: none;
  border-color: var(--accent);
}

.select--error {
  border-color: var(--danger);
}

.select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.select-arrow {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  pointer-events: none;
}

.select-error {
  font-size: 0.8125rem;
  color: var(--danger);
}
</style>
