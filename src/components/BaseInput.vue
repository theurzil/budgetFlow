<script setup lang="ts">
defineProps<{
  modelValue: string | number
  label?: string
  placeholder?: string
  type?: string
  error?: string
  disabled?: boolean
  required?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="input-group">
    <label v-if="label" class="input-label">
      {{ label }}
      <span v-if="required" class="input-required">*</span>
    </label>
    <div class="input-wrapper">
      <slot name="icon" />
      <input
        :value="modelValue"
        :type="type ?? 'text'"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="['input', { 'input--error': error, 'input--has-icon': $slots.icon }]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <p v-if="error" class="input-error">{{ error }}</p>
  </div>
</template>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.input-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.input-required {
  color: var(--danger);
  margin-left: 2px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: border-color var(--transition);
}

.input--has-icon {
  padding-left: 2.25rem;
}

.input:focus {
  outline: none;
  border-color: var(--accent);
}

.input--error {
  border-color: var(--danger);
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input::placeholder {
  color: var(--text-muted);
}

.input-error {
  font-size: 0.8125rem;
  color: var(--danger);
}
</style>
