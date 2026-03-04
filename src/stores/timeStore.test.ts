import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTimeStore } from './timeStore'
import { getISODate } from '@/utils/dateHelpers'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

const sample = {
  project: 'BudgetFlow',
  description: 'Writing tests',
  duration: 3600,
  date: getISODate(),
  startedAt: new Date().toISOString(),
  endedAt: new Date().toISOString(),
}

describe('timeStore', () => {
  describe('addSession', () => {
    it('adds a session', () => {
      const store = useTimeStore()
      store.addSession(sample)
      expect(store.sessions).toHaveLength(1)
      expect(store.sessions[0].project).toBe('BudgetFlow')
    })

    it('assigns a unique id', () => {
      const store = useTimeStore()
      store.addSession(sample)
      store.addSession(sample)
      const ids = store.sessions.map((s) => s.id)
      expect(new Set(ids).size).toBe(2)
    })
  })

  describe('deleteSession', () => {
    it('removes the correct session', () => {
      const store = useTimeStore()
      store.addSession(sample)
      const id = store.sessions[0].id
      store.deleteSession(id)
      expect(store.sessions).toHaveLength(0)
    })
  })

  describe('editSession', () => {
    it('updates description', () => {
      const store = useTimeStore()
      store.addSession(sample)
      const id = store.sessions[0].id
      store.editSession(id, { description: 'Updated desc' })
      expect(store.sessions[0].description).toBe('Updated desc')
    })
  })

  describe('getters', () => {
    it('calculates totalHours', () => {
      const store = useTimeStore()
      store.addSession({ ...sample, duration: 3600 })
      store.addSession({ ...sample, duration: 1800 })
      expect(store.totalHours).toBeCloseTo(1.5)
    })

    it('calculates todayHours only for today', () => {
      const store = useTimeStore()
      store.addSession({ ...sample, date: getISODate(), duration: 3600 })
      store.addSession({ ...sample, date: '2020-01-01', duration: 9999 })
      expect(store.todayHours).toBeCloseTo(1)
    })

    it('byProject sums hours per project', () => {
      const store = useTimeStore()
      store.addSession({ ...sample, project: 'Alpha', duration: 3600 })
      store.addSession({ ...sample, project: 'Alpha', duration: 3600 })
      store.addSession({ ...sample, project: 'Beta', duration: 1800 })
      expect(store.byProject['Alpha']).toBeCloseTo(2)
      expect(store.byProject['Beta']).toBeCloseTo(0.5)
    })

    it('byDay returns 7 entries', () => {
      const store = useTimeStore()
      expect(store.byDay).toHaveLength(7)
    })
  })

  describe('timer', () => {
    it('timerStart sets project and isRunning', () => {
      const store = useTimeStore()
      store.timerStart('MyProject')
      expect(store.timerIsRunning).toBe(true)
      expect(store.timerProject).toBe('MyProject')
    })

    it('timerPause stops running', () => {
      const store = useTimeStore()
      store.timerStart('MyProject')
      store.timerPause()
      expect(store.timerIsRunning).toBe(false)
    })

    it('timerStop returns a session and resets state', () => {
      const store = useTimeStore()
      store.timerStart('MyProject')
      // Manually bump accumulated so stop has something to work with
      store.timerPause()
      store.timerAccumulated = 120

      const session = store.timerStop()
      expect(session).not.toBeNull()
      expect(session?.project).toBe('MyProject')
      expect(session?.duration).toBe(120)
      expect(store.timerIsRunning).toBe(false)
      expect(store.timerProject).toBe('')
    })

    it('timerStop returns null when no time elapsed', () => {
      const store = useTimeStore()
      // Don't start — nothing accumulated
      const session = store.timerStop()
      expect(session).toBeNull()
    })
  })
})
