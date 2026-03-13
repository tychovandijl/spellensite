<script setup>
import { ref } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || '/api'

const huidig = ref('')
const nieuw = ref('')
const bevestig = ref('')
const fout = ref('')
const succes = ref('')
const bezig = ref(false)

async function wijzig() {
  fout.value = ''
  succes.value = ''
  if (nieuw.value !== bevestig.value) {
    fout.value = 'Nieuwe wachtwoorden komen niet overeen'
    return
  }
  bezig.value = true
  try {
    await axios.put(`${API}/auth/password`, { huidig: huidig.value, nieuw: nieuw.value })
    succes.value = 'Wachtwoord succesvol gewijzigd!'
    huidig.value = ''
    nieuw.value = ''
    bevestig.value = ''
  } catch (err) {
    fout.value = err.response?.data?.message || 'Wijzigen mislukt'
  } finally {
    bezig.value = false
  }
}
</script>

<template>
  <div class="form-pagina">
    <h2>Wachtwoord wijzigen</h2>
    <form @submit.prevent="wijzig">
      <input v-model="huidig" type="password" placeholder="Huidig wachtwoord" required />
      <input v-model="nieuw" type="password" placeholder="Nieuw wachtwoord" required />
      <input v-model="bevestig" type="password" placeholder="Nieuw wachtwoord bevestigen" required />
      <p v-if="fout" class="fout">{{ fout }}</p>
      <p v-if="succes" style="color:#065f46;background:#d1fae5;padding:0.5rem 0.75rem;border-radius:8px;font-size:0.9rem;">{{ succes }}</p>
      <button type="submit" :disabled="bezig">{{ bezig ? 'Bezig...' : 'Wachtwoord wijzigen' }}</button>
    </form>
  </div>
</template>
