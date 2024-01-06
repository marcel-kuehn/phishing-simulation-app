import './assets/main.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Lara from '@/presets/lara'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { startSessionRefreshLoop } from './stores/auth'

const app = createApp(App)

app.use(createPinia())
startSessionRefreshLoop().then(() => {
  app.use(router)
  app.use(PrimeVue, {
    unstyled: true,
    pt: Lara,
  })

  app.mount('#app')
});

