<script setup lang="ts">
import { ref } from 'vue'
import type { TimeSession } from '@/types'
import { formatDate } from '@/utils/dateHelpers'
import { formatDuration, formatDurationFull } from '@/utils/formatters'
import BaseButton from './BaseButton.vue'

const props = defineProps<{
  session: TimeSession
}>()

const emit = defineEmits<{
  delete: [id: string]
  'update:description': [id: string, description: string]
}>()

const editing = ref(false)
const editDesc = ref(props.session.description)

function saveDesc() {
  emit('update:description', props.session.id, editDesc.value)
  editing.value = false
}
</script>

<template>
  <div class="session-item">
    <div class="session-main">
      <div class="session-info">
        <div class="session-top">
          <span class="session-project">{{ session.project }}</span>
          <span class="session-date">{{ formatDate(session.date) }}</span>
        </div>
        <div v-if="!editing" class="session-desc" @click="editing = true">
          <span v-if="session.description" class="session-desc-text">{{ session.description }}</span>
          <span v-else class="session-desc-placeholder">Add description...</span>
        </div>
        <div v-else class="session-edit">
          <input
            v-model="editDesc"
            class="session-input"
            placeholder="Add description..."
            autofocus
            @keydown.enter="saveDesc"
            @keydown.escape="editing = false"
          />
          <BaseButton size="sm" @click="saveDesc">Save</BaseButton>
          <BaseButton size="sm" variant="ghost" @click="editing = false">Cancel</BaseButton>
        </div>
      </div>
      <div class="session-right">
        <span class="session-duration" :title="formatDurationFull(session.duration)">
          {{ formatDuration(session.duration) }}
        </span>
        <button class="session-delete" aria-label="Delete" @click="emit('delete', session.id)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.session-item {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--border);
  transition: background var(--transition);
}
.session-item:last-child { border-bottom: none; }
.session-item:hover { background: var(--bg-hover); }

.session-main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.session-info {
  flex: 1;
  min-width: 0;
}

.session-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.session-project {
  font-weight: 600;
  font-size: 0.9375rem;
  color: var(--text-primary);
}

.session-date {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.session-desc {
  cursor: text;
}

.session-desc-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.session-desc-placeholder {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-style: italic;
}

.session-edit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.session-input {
  flex: 1;
  padding: 0.25rem 0.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--accent);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 0.875rem;
  outline: none;
}

.session-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.session-duration {
  font-family: var(--font-mono);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--accent);
}

.session-delete {
  background: none;
  border: none;
  color: var(--text-muted);
  padding: 0.25rem;
  border-radius: var(--radius-sm);
  opacity: 0;
  transition: opacity var(--transition), color var(--transition);
}
.session-item:hover .session-delete { opacity: 1; }
.session-delete:hover { color: var(--danger); }
.session-delete svg { width: 16px; height: 16px; }
</style>
