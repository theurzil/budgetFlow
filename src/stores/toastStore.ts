import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Toast, ToastVariant } from '@/types'
import { generateId } from '@/utils/formatters'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  function show(message: string, variant: ToastVariant = 'success') {
    const id = generateId()
    toasts.value.push({ id, message, variant })
    setTimeout(() => remove(id), 3000)
  }

  function remove(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, show, remove }
})
