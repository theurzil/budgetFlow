import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { TimeSession } from '@/types'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { generateId } from '@/utils/formatters'
import { getISODate, getLast7Days, getDayLabel } from '@/utils/dateHelpers'

export const useTimeStore = defineStore('time', () => {
  const sessions = useLocalStorage<TimeSession[]>('time-sessions', [])

  // ─── Active timer state (persisted so navigation doesn't kill it) ───────────
  // timerRunStart: wall-clock ISO when the current run segment began
  // timerAccumulated: seconds from all completed paused segments
  // timerSessionStart: wall-clock ISO when the whole session originally began
  const timerProject = useLocalStorage<string>('timer-project', '')
  const timerSessionStart = useLocalStorage<string>('timer-session-start', '')
  const timerRunStart = useLocalStorage<string>('timer-run-start', '')
  const timerAccumulated = useLocalStorage<number>('timer-accumulated', 0)
  const timerIsRunning = useLocalStorage<boolean>('timer-is-running', false)

  const timerActive = computed(
    () => timerProject.value !== '' || timerAccumulated.value > 0,
  )

  function getElapsed(): number {
    const base = timerAccumulated.value
    if (timerIsRunning.value && timerRunStart.value) {
      return base + Math.floor((Date.now() - new Date(timerRunStart.value).getTime()) / 1000)
    }
    return base
  }

  function timerStart(projectName: string) {
    if (timerIsRunning.value) return
    if (!timerSessionStart.value) {
      timerSessionStart.value = new Date().toISOString()
      timerProject.value = projectName
    }
    timerRunStart.value = new Date().toISOString()
    timerIsRunning.value = true
  }

  function timerPause() {
    if (!timerIsRunning.value || !timerRunStart.value) return
    timerAccumulated.value += Math.floor(
      (Date.now() - new Date(timerRunStart.value).getTime()) / 1000,
    )
    timerRunStart.value = ''
    timerIsRunning.value = false
  }

  function timerStop(): TimeSession | null {
    const runSeconds = timerRunStart.value
      ? Math.floor((Date.now() - new Date(timerRunStart.value).getTime()) / 1000)
      : 0
    const total = timerAccumulated.value + runSeconds

    if (total === 0) return null

    const sessionStart = timerSessionStart.value || new Date().toISOString()
    const session: TimeSession = {
      id: generateId(),
      project: timerProject.value,
      description: '',
      duration: total,
      date: sessionStart.split('T')[0],
      startedAt: sessionStart,
      endedAt: new Date().toISOString(),
    }

    timerProject.value = ''
    timerSessionStart.value = ''
    timerRunStart.value = ''
    timerAccumulated.value = 0
    timerIsRunning.value = false

    return session
  }

  // ─── Sessions CRUD ───────────────────────────────────────────────────────────
  function addSession(data: Omit<TimeSession, 'id'>) {
    sessions.value.unshift({ ...data, id: generateId() })
  }

  function deleteSession(id: string) {
    sessions.value = sessions.value.filter((s) => s.id !== id)
  }

  function editSession(id: string, data: Partial<Omit<TimeSession, 'id'>>) {
    const idx = sessions.value.findIndex((s) => s.id === id)
    if (idx !== -1) {
      sessions.value[idx] = { ...sessions.value[idx], ...data }
    }
  }

  // ─── Getters ─────────────────────────────────────────────────────────────────
  const totalHours = computed(() =>
    sessions.value.reduce((sum, s) => sum + s.duration, 0) / 3600,
  )

  const todayHours = computed(() => {
    const today = getISODate()
    return (
      sessions.value
        .filter((s) => s.date === today)
        .reduce((sum, s) => sum + s.duration, 0) / 3600
    )
  })

  const byProject = computed(() => {
    const map: Record<string, number> = {}
    sessions.value.forEach((s) => {
      map[s.project] = (map[s.project] ?? 0) + s.duration / 3600
    })
    return map
  })

  const byDay = computed(() => {
    const days = getLast7Days()
    return days.map((date) => ({
      date,
      label: getDayLabel(date),
      hours:
        sessions.value
          .filter((s) => s.date === date)
          .reduce((sum, s) => sum + s.duration, 0) / 3600,
    }))
  })

  const recentSessions = computed(() => sessions.value.slice(0, 5))

  return {
    sessions,
    addSession,
    deleteSession,
    editSession,
    totalHours,
    todayHours,
    byProject,
    byDay,
    recentSessions,
    // Timer
    timerProject,
    timerIsRunning,
    timerAccumulated,
    timerActive,
    getElapsed,
    timerStart,
    timerPause,
    timerStop,
  }
})
