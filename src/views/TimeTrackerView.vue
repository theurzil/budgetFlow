<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useTimeStore } from '@/stores/timeStore'
import { useToastStore } from '@/stores/toastStore'
import { formatDurationFull } from '@/utils/formatters'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseBadge from '@/components/BaseBadge.vue'
import SessionItem from '@/components/SessionItem.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import ChartBar from '@/components/ChartBar.vue'

const timeStore = useTimeStore()
const toastStore = useToastStore()

const projectInput = ref('')
const projectError = ref('')
const confirmDeleteId = ref<string | null>(null)

// elapsed is a local ref updated by a setInterval — it reads from the store's
// persisted timestamps, so navigating away and back gives the correct value.
const elapsed = ref(timeStore.getElapsed())

let intervalId: ReturnType<typeof setInterval> | null = null

function startInterval() {
  if (intervalId) return
  intervalId = setInterval(() => {
    elapsed.value = timeStore.getElapsed()
  }, 1000)
}

function stopInterval() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(() => {
  elapsed.value = timeStore.getElapsed()
  if (timeStore.timerIsRunning) startInterval()
})

onUnmounted(() => {
  // Only clear the local interval — store state stays alive in Pinia
  stopInterval()
})

// If another tab or component changes timerIsRunning, sync the interval
watch(() => timeStore.timerIsRunning, (running) => {
  if (running) {
    startInterval()
  } else {
    stopInterval()
    elapsed.value = timeStore.getElapsed()
  }
})

const formatted = computed(() => formatDurationFull(elapsed.value))

function startTimer() {
  if (!projectInput.value.trim()) {
    projectError.value = 'Enter a project name to start'
    return
  }
  projectError.value = ''
  timeStore.timerStart(projectInput.value.trim())
  startInterval()
}

function pauseTimer() {
  timeStore.timerPause()
  stopInterval()
  elapsed.value = timeStore.getElapsed()
}

function resumeTimer() {
  timeStore.timerStart(timeStore.timerProject.value)
  startInterval()
}

function stopTimer() {
  const session = timeStore.timerStop()
  stopInterval()
  elapsed.value = 0
  if (session) {
    timeStore.addSession(session)
    toastStore.show(`Session saved: ${session.project}`)
  }
  projectInput.value = ''
}

function updateDescription(id: string, description: string) {
  timeStore.editSession(id, { description })
}

function requestDelete(id: string) {
  confirmDeleteId.value = id
}

function confirmDelete() {
  if (confirmDeleteId.value) {
    timeStore.deleteSession(confirmDeleteId.value)
    toastStore.show('Session deleted', 'error')
    confirmDeleteId.value = null
  }
}

const weeklyLabels = computed(() => timeStore.byDay.map((d) => d.label))
const weeklyData = computed(() => timeStore.byDay.map((d) => d.hours))
const todayHoursFormatted = computed(() => timeStore.todayHours.toFixed(1) + 'h')
</script>

<template>
  <div class="view">
    <div class="page-header">
      <div>
        <h1>Time Tracker</h1>
        <p class="page-subtitle">Today: {{ todayHoursFormatted }} logged</p>
      </div>
    </div>

    <!-- Stopwatch card -->
    <BaseCard title="Active Timer">
      <div class="stopwatch">
        <div class="stopwatch-display">
          <span class="stopwatch-time">{{ formatted }}</span>
          <BaseBadge v-if="timeStore.timerIsRunning" variant="success">Running</BaseBadge>
          <BaseBadge v-else-if="timeStore.timerActive" variant="warning">Paused</BaseBadge>
        </div>

        <!-- Not started yet -->
        <div v-if="!timeStore.timerActive" class="stopwatch-start">
          <BaseInput
            v-model="projectInput"
            placeholder="Project name..."
            :error="projectError"
            @keydown.enter="startTimer"
          />
          <BaseButton @click="startTimer">▶ Start</BaseButton>
        </div>

        <!-- Running or paused -->
        <div v-else class="stopwatch-controls">
          <div class="project-name">
            <span class="project-label">Project:</span>
            <span class="project-value">{{ timeStore.timerProject }}</span>
          </div>
          <div class="control-buttons">
            <BaseButton v-if="timeStore.timerIsRunning" variant="secondary" @click="pauseTimer">
              ⏸ Pause
            </BaseButton>
            <BaseButton v-else variant="secondary" @click="resumeTimer">
              ▶ Resume
            </BaseButton>
            <BaseButton variant="danger" @click="stopTimer">
              ⏹ Stop & Save
            </BaseButton>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Weekly chart -->
    <BaseCard title="This Week">
      <ChartBar
        :labels="weeklyLabels"
        :datasets="[{ label: 'Hours', data: weeklyData, color: '#6c63ff' }]"
        :height="200"
      />
    </BaseCard>

    <!-- Sessions list -->
    <BaseCard :no-padding="true">
      <template #header>
        <h3 class="card-title-with-badge">
          Completed Sessions
          <BaseBadge size="sm" variant="accent">{{ timeStore.sessions.length }}</BaseBadge>
        </h3>
      </template>

      <div v-if="timeStore.sessions.length">
        <SessionItem
          v-for="session in timeStore.sessions"
          :key="session.id"
          :session="session"
          @delete="requestDelete"
          @update:description="updateDescription"
        />
      </div>
      <div v-else class="empty-state">
        <p>No sessions logged yet. Start your first timer above!</p>
      </div>
    </BaseCard>

    <ConfirmModal
      :open="!!confirmDeleteId"
      message="Delete this time session? This cannot be undone."
      @confirm="confirmDelete"
      @cancel="confirmDeleteId = null"
    />
  </div>
</template>

<style scoped>
.page-header h1 { margin-bottom: 0.25rem; }
.page-subtitle { color: var(--text-muted); font-size: 0.9375rem; }

.stopwatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.stopwatch-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.stopwatch-time {
  font-family: var(--font-mono);
  font-size: 4rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.05em;
}

.stopwatch-start {
  display: flex;
  gap: 0.75rem;
  width: 100%;
  max-width: 400px;
  align-items: flex-start;
}

.stopwatch-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.project-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.project-label { color: var(--text-muted); font-size: 0.875rem; }
.project-value { font-weight: 600; color: var(--accent); }

.control-buttons {
  display: flex;
  gap: 0.75rem;
}

.card-title-with-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: var(--text-muted);
}

@media (max-width: 640px) {
  .stopwatch-time { font-size: 3rem; }
  .stopwatch-start { flex-direction: column; }
  .control-buttons { flex-direction: column; align-items: stretch; }
}
</style>
