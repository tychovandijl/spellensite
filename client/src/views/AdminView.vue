<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const gebruikers = ref([])
const fout = ref('')

async function laadGebruikers() {
  const { data } = await axios.get(`${API}/users`)
  gebruikers.value = data.users
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

onMounted(laadGebruikers)
</script>

<template>
  <div class="admin-pagina">
    <h2>Admin — Gebruikersbeheer</h2>
    <p v-if="fout" class="fout">{{ fout }}</p>
    <table>
      <thead>
        <tr>
          <th>Email</th><th>Rol</th><th>Status</th><th>W/V/G</th><th>Acties</th>
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
          <td>{{ u.stats.gewonnen }}/{{ u.stats.verloren }}/{{ u.stats.gelijkspel }}</td>
          <td class="acties">
            <button @click="blokkeer(u._id)">{{ u.geblokkeerd ? 'Deblokkeren' : 'Blokkeren' }}</button>
            <button @click="resetScore(u._id)">Score reset</button>
            <button class="verwijder" @click="verwijder(u._id)">Verwijderen</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
