<template>
  <div class="min-h-screen flex items-stretch">
    <nav
      class="fixed bg-surface-50 w-64 border-solid border-r-2 border-surface-100 h-screen flex flex-col"
    >
      <div class="p-4" @click="$router.push({ name: 'dashboard' })">
        <h1 class="text-2xl font-bold mb-2 text-primary-700">Phawareness</h1>
      </div>
      <div class="flex-1">
        <Menu :model="items">
          <template #item="{ item, props }">
            <router-link v-slot="{ href, navigate }" :to="{ name: item.route }" custom>
              <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
              </a>
            </router-link>
          </template>
        </Menu>
      </div>
      <div class="p-4">
        <div
          class="bg-white px-2 py-2 flex items-center gap-2 border-solid border-2 border-surface-100 rounded"
        >
          <Avatar label="MK" class="mr-2" size="large" />

          <p class="flex-1">{{ userStore.user?.name ?? '' }}</p>

          <i class="pi pi-ellipsis-v"> </i>
        </div>
      </div>
    </nav>

    <div class="bg-surface-50 w-64 border-solid border-r-2 border-surface-100"></div>
    <div class="bg-white flex-1">
      <header class="border-solid border-b-2 border-surface-100 p-4">
        <h1 class="text-2xl font-bold mb-2">{{ pageTitle }}</h1>
      </header>

      <main class="p-4">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Menu from 'primevue/menu'
import Avatar from 'primevue/avatar'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()

const items = ref([
  {
    label: 'Dashboard',
    icon: 'pi pi-th-large',
    route: 'dashboard'
  },
  {
    label: 'Mail Lists',
    icon: 'pi pi-envelope',
    route: 'maillists'
  },
  {
    label: 'Campaigns',
    icon: 'pi pi-chart-bar',
    route: 'campaigns'
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    route: 'settings'
  }
])

const pageTitle = computed<string>(() => {
  const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    maillists: 'Mail Lists',
    campaigns: 'Campaigns',
    settings: 'Settings'
  }

  return pageTitles[route.name as string] ?? ''
})

onMounted(() => {
  userStore.getUser()
})
</script>

<style scoped></style>
