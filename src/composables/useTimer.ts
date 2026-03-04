import { ref, computed, onUnmounted, type Ref } from 'vue'
import type { TimeSession } from '@/types'
import { generateId } from '@/utils/formatters'

export function useTimer() {
  const elapsed: Ref<number> = ref(0) // seconds
  const isRunning: Ref<boolean> = ref(false)
  const project: Ref<string> = ref('')
  const startedAt: Ref<string> = ref('')

  let intervalId: ReturnType<typeof setInterval> | null = null
  let startTimestamp = 0
  let accumulatedSeconds = 0

  const formatted = computed(() => {
    const h = Math.floor(elapsed.value / 3600)
    const m = Math.floor((elapsed.value % 3600) / 60)
    const s = elapsed.value % 60
    return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':')
  })

  function start(projectName: string) {
    if (isRunning.value) return
    project.value = projectName
    if (!startedAt.value) {
      startedAt.value = new Date().toISOString()
    }
    startTimestamp = Date.now()
    isRunning.value = true
    intervalId = setInterval(() => {
      elapsed.value = accumulatedSeconds + Math.floor((Date.now() - startTimestamp) / 1000)
    }, 1000)
  }

  function pause() {
    if (!isRunning.value) return
    accumulatedSeconds = elapsed.value
    isRunning.value = false
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function stop(): TimeSession | null {
    if (elapsed.value === 0) return null

    const session: TimeSession = {
      id: generateId(),
      project: project.value,
      description: '',
      duration: elapsed.value,
      date: startedAt.value.split('T')[0],
      startedAt: startedAt.value,
      endedAt: new Date().toISOString(),
    }

    // Reset state
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    elapsed.value = 0
    isRunning.value = false
    project.value = ''
    startedAt.value = ''
    accumulatedSeconds = 0
    startTimestamp = 0

    return session
  }

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
  })

  return { elapsed, isRunning, project, formatted, start, pause, stop }
}
