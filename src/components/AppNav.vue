<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'grid' },
  { to: '/budget', label: 'Budget', icon: 'dollar' },
  { to: '/time', label: 'Time', icon: 'clock' },
  { to: '/reports', label: 'Reports', icon: 'chart' },
]
</script>

<template>
  <nav class="app-nav">
    <div class="nav-brand">
      <span class="nav-logo">💰</span>
      <span class="nav-name">BudgetFlow</span>
    </div>

    <ul class="nav-links">
      <li v-for="item in navItems" :key="item.to">
        <RouterLink
          :to="item.to"
          :class="['nav-link', { 'nav-link--active': route.path === item.to }]"
          :aria-current="route.path === item.to ? 'page' : undefined"
        >
          <!-- Icons -->
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <template v-if="item.icon === 'grid'">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </template>
            <template v-else-if="item.icon === 'dollar'">
              <line x1="12" y1="1" x2="12" y2="23" stroke-linecap="round" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" stroke-linejoin="round" />
            </template>
            <template v-else-if="item.icon === 'clock'">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" stroke-linecap="round" stroke-linejoin="round" />
            </template>
            <template v-else-if="item.icon === 'chart'">
              <line x1="18" y1="20" x2="18" y2="10" stroke-linecap="round" />
              <line x1="12" y1="20" x2="12" y2="4" stroke-linecap="round" />
              <line x1="6" y1="20" x2="6" y2="14" stroke-linecap="round" />
            </template>
          </svg>
          <span class="nav-label">{{ item.label }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>

  <!-- Mobile bottom nav -->
  <nav class="app-nav-mobile">
    <RouterLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      :class="['nav-mobile-link', { 'nav-mobile-link--active': route.path === item.to }]"
    >
      <svg class="nav-mobile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <template v-if="item.icon === 'grid'">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </template>
        <template v-else-if="item.icon === 'dollar'">
          <line x1="12" y1="1" x2="12" y2="23" stroke-linecap="round" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke-linecap="round" stroke-linejoin="round" />
        </template>
        <template v-else-if="item.icon === 'clock'">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" stroke-linecap="round" stroke-linejoin="round" />
        </template>
        <template v-else-if="item.icon === 'chart'">
          <line x1="18" y1="20" x2="18" y2="10" stroke-linecap="round" />
          <line x1="12" y1="20" x2="12" y2="4" stroke-linecap="round" />
          <line x1="6" y1="20" x2="6" y2="14" stroke-linecap="round" />
        </template>
      </svg>
      <span class="nav-mobile-label">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
/* Desktop sidebar */
.app-nav {
  width: var(--nav-width);
  height: 100vh;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 1rem;
}

.nav-logo { font-size: 1.5rem; }
.nav-name { font-size: 1.125rem; font-weight: 700; color: var(--text-primary); }

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0 0.75rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.9375rem;
  font-weight: 500;
  transition: all var(--transition);
}

.nav-link:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.nav-link--active {
  background: var(--accent-soft);
  color: var(--accent);
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-label { flex: 1; }

/* Mobile bottom nav */
.app-nav-mobile {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--nav-mobile-height);
  background: var(--bg-secondary);
  border-top: 1px solid var(--border);
  z-index: 50;
  padding: 0 0.5rem;
}

.nav-mobile-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  flex: 1;
  padding: 0.5rem;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  transition: color var(--transition);
}

.nav-mobile-link--active { color: var(--accent); }
.nav-mobile-link:hover { color: var(--text-primary); }

.nav-mobile-icon { width: 22px; height: 22px; }
.nav-mobile-label { font-size: 0.6875rem; font-weight: 500; }

@media (max-width: 768px) {
  .app-nav { display: none; }
  .app-nav-mobile { display: flex; }
}
</style>
