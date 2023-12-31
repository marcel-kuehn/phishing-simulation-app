<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-50">
    <Card class="w-full max-w-xl">
      <template #title>
        <div class="text-center">Sign Up</div>
      </template>
      <template #subtitle>
        <div class="text-center">
          Let's get started with making your company more resiliant against phishing attacks.
        </div>
      </template>
      <template #content>
        <div class="flex flex-col gap-2">
          <div class="flex flex-col gap-2">
            <label for="name">Name</label>
            <InputText id="name" type="text" v-model="name" />
          </div>
          <div class="flex flex-col gap-2">
            <label for="email">Email</label>
            <InputText id="email" type="text" v-model="email" />
          </div>
          <div class="flex flex-col gap-2">
            <label for="password">Password</label>
            <InputText v-model="password" type="password" class="w-full block"/>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex flex-col gap-2 text-center">
          <Button label="Sign Up" @click="signUp" />
          <p>Already have an account? <RouterLink :to="{ name: 'sign-in' }">Sign In</RouterLink></p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const name = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')

const signUp = async (): Promise<void> => {
  await authStore.signUp(name.value, email.value, password.value)
}

</script>

<style scoped></style>
