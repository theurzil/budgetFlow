<script setup lang="ts">
import AppNav from '@/components/AppNav.vue'
import BaseToast from '@/components/BaseToast.vue'
</script>

<template>
  <div class="app-layout">
    <AppNav />
    <main class="app-main">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
  </div>
  <BaseToast />
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.app-main {
  flex: 1;
  margin-left: var(--nav-width);
  min-height: 100vh;
  overflow-x: hidden;
}

@media (max-width: 768px) {
  .app-main {
    margin-left: 0;
    padding-bottom: var(--nav-mobile-height);
  }
}
</style>
