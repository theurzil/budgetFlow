<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'

defineProps<{
  open: boolean
  title?: string
  message: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <BaseModal :open="open" :title="title ?? 'Confirm'" size="sm" @close="emit('cancel')">
    <p class="confirm-message">{{ message }}</p>
    <template #footer>
      <BaseButton variant="ghost" @click="emit('cancel')">Cancel</BaseButton>
      <BaseButton variant="danger" @click="emit('confirm')">Delete</BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped>
.confirm-message {
  color: var(--text-secondary);
  line-height: 1.6;
}
</style>
