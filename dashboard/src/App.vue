<template>
  <CenterLayout v-if="currentLayout === 'CenterLayout'">
    <RouterView />
  </CenterLayout>
  <DefaultLayout v-else>
    <RouterView />
  </DefaultLayout>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue';
import { computed } from 'vue';
import CenterLayout from './layouts/CenterLayout.vue';

const route = useRoute();

const layoutsByViewName: Record<string, string[]> = {
  "CenterLayout": ['sign-up', 'sign-in', 'home'],
}

const currentLayout = computed<string>(() => {
  for(const layout of Object.keys(layoutsByViewName)) {
    if(layoutsByViewName[layout].includes(route.name as string)) {
      return layout;
    }
  }
  return "DefaultLayout";
});
</script>

<style scoped>
</style>