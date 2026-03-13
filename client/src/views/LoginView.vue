<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const fout = ref('')
const laden = ref(false)

async function submit() {
  fout.value = ''
  laden.value = true
  try {
    await auth.login(email.value, password.value)
    router.push('/spel')
  } catch (err) {
    fout.value = err.response?.data?.message || 'Inloggen mislukt'
  } finally {
    laden.value = false
  }
}
</script>

<template>
  <div class="form-pagina">
    <h2>Inloggen</h2>
    <form @submit.prevent="submit">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Wachtwoord" required />
      <p v-if="fout" class="fout">{{ fout }}</p>
      <button type="submit" :disabled="laden">{{ laden ? 'Bezig...' : 'Inloggen' }}</button>
    </form>
    <p>Nog geen account? <RouterLink to="/register">Registreren</RouterLink></p>
  </div>
</template>
