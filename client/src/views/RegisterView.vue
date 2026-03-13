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
    await auth.register(email.value, password.value)
    router.push('/spel')
  } catch (err) {
    fout.value = err.response?.data?.message || 'Registratie mislukt'
  } finally {
    laden.value = false
  }
}
</script>

<template>
  <div class="form-pagina">
    <h2>Account aanmaken</h2>
    <form @submit.prevent="submit">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Wachtwoord (min. 6 tekens)" required />
      <p v-if="fout" class="fout">{{ fout }}</p>
      <button type="submit" :disabled="laden">{{ laden ? 'Bezig...' : 'Registreren' }}</button>
    </form>
    <p>Al een account? <RouterLink to="/login">Inloggen</RouterLink></p>
  </div>
</template>
