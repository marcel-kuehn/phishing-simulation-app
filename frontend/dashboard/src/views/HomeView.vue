
<template>
  <div style="width: 400px;">
      <Panel toggleable>
          <template #header>
              <div class="flex items-center gap-2">
                  <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" size="large" shape="circle" />
                  <span class="font-bold">Amy Elsner</span>
              </div>
          </template>
          <template #footer>
              <div class="flex flex-wrap items-center justify-between gap-3">
                  <div class="flex items-center gap-2">
                      <Button icon="pi pi-user" rounded text></Button>
                      <Button icon="pi pi-bookmark" severity="secondary" rounded text></Button>
                  </div>
                  <span class="text-surface-600 dark:text-surface-200">Updated 2 hours ago</span>
              </div>
          </template>
          <template #icons>
              <button class="p-panel-header-icon p-link mr-2">
                  <span class="pi pi-cog"></span>
              </button>
              <Menu ref="menu" id="config_menu" popup />
          </template>
          <p class="m-0">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
      </Panel>

      <Steps :model="items" />
  </div>
</template>

<script setup lang="ts">
import Panel from 'primevue/panel';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import Steps from 'primevue/steps';

import { ref } from "vue";

const items = ref([
    {
        label: 'Personal Info'
    },
    {
        label: 'Reservation'
    },
    {
        label: 'Review'
    }
]);
</script>
