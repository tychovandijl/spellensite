<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || '/api'
const gebruikers = ref([])
const fout = ref('')
const wachtwoordVeld = ref({})
const wachtwoordFout = ref({})
const wachtwoordSucces = ref({})

async function laadGebruikers() {
  fout.value = ''
  try {
    const { data } = await axios.get(`${API}/users`)
    gebruikers.value = data.users
    wachtwoordVeld.value = {}
  } catch (err) {
    fout.value = err.response?.data?.message || 'Laden mislukt. Probeer opnieuw in te loggen.'
  }
}

async function wijzigRol(id, rol) {
  await axios.put(`${API}/users/${id}/role`, { role: rol })
  await laadGebruikers()
}

async function blokkeer(id) {
  await axios.post(`${API}/users/${id}/block`)
  await laadGebruikers()
}

async function resetScore(id) {
  if (!confirm('Score resetten?')) return
  await axios.delete(`${API}/users/${id}/score`)
  await laadGebruikers()
}

async function verwijder(id) {
  if (!confirm('Gebruiker verwijderen?')) return
  await axios.delete(`${API}/users/${id}`)
  await laadGebruikers()
}

async function wijzigWachtwoord(id) {
  wachtwoordFout.value[id] = ''
  wachtwoordSucces.value[id] = ''
  const pw = wachtwoordVeld.value[id]
  if (!pw || pw.length < 6) {
    wachtwoordFout.value[id] = 'Minimaal 6 tekens'
    return
  }
  try {
    await axios.put(`${API}/users/${id}/password`, { password: pw })
    wachtwoordSucces.value[id] = 'Gewijzigd!'
    wachtwoordVeld.value[id] = ''
  } catch (err) {
    wachtwoordFout.value[id] = err.response?.data?.message || 'Mislukt'
  }
}

onMounted(laadGebruikers)
</script>

<template>
  <div class="admin-pagina">
    <h2>Admin — Gebruikersbeheer</h2>
    <p v-if="fout" class="fout">{{ fout }}</p>
    <table v-if="gebruikers.length">
      <thead>
        <tr>
          <th>Email</th><th>Rol</th><th>Status</th><th>W/V/G</th><th>Wachtwoord</th><th>Acties</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in gebruikers" :key="u._id">
          <td>{{ u.email }}</td>
          <td>
            <select :value="u.role" @change="wijzigRol(u._id, $event.target.value)">
              <option value="gebruiker">Gebruiker</option>
              <option value="admin">Admin</option>
            </select>
          </td>
          <td>{{ u.geblokkeerd ? '🔒 Geblokkeerd' : '✅ Actief' }}</td>
          <td>{{ u.stats?.gewonnen ?? 0 }}/{{ u.stats?.verloren ?? 0 }}/{{ u.stats?.gelijkspel ?? 0 }}</td>
          <td>
            <div style="display:flex;gap:0.3rem;align-items:center;">
              <input
                v-model="wachtwoordVeld[u._id]"
                type="password"
                placeholder="Nieuw wachtwoord"
                style="padding:0.2rem 0.4rem;border:1px solid #c7d2fe;border-radius:6px;font-size:0.8rem;width:130px;"
              />
              <button @click="wijzigWachtwoord(u._id)">Sla op</button>
            </div>
            <small v-if="wachtwoordFout[u._id]" style="color:#991b1b;display:block;">{{ wachtwoordFout[u._id] }}</small>
            <small v-if="wachtwoordSucces[u._id]" style="color:#065f46;display:block;">{{ wachtwoordSucces[u._id] }}</small>
          </td>
          <td class="acties">
            <button @click="blokkeer(u._id)">{{ u.geblokkeerd ? 'Deblokkeren' : 'Blokkeren' }}</button>
            <button @click="resetScore(u._id)">Score reset</button>
            <button class="verwijder" @click="verwijder(u._id)">Verwijderen</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else-if="!fout">Geen gebruikers gevonden.</p>
  </div>
</template>
