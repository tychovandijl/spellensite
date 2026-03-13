<script setup>
import { onMounted } from 'vue'
import { useGameStore } from '../stores/game'

const game = useGameStore()
onMounted(() => {
  game.fetchStats()
  game.fetchHistory()
})
</script>

<template>
  <div class="stats-pagina">
    <h2>Mijn statistieken</h2>
    <div class="stats-grid">
      <div class="stat gewonnen">🏆 {{ game.stats.gewonnen }} gewonnen</div>
      <div class="stat verloren">💀 {{ game.stats.verloren }} verloren</div>
      <div class="stat gelijkspel">🤝 {{ game.stats.gelijkspel }} gelijkspel</div>
    </div>

    <h3>Spelgeschiedenis</h3>
    <table v-if="game.history.length">
      <thead>
        <tr><th>Datum</th><th>Modus</th><th>Uitkomst</th></tr>
      </thead>
      <tbody>
        <tr v-for="r in game.history" :key="r._id">
          <td>{{ new Date(r.createdAt).toLocaleDateString('nl-NL') }}</td>
          <td>{{ r.modus }}</td>
          <td>{{ r.uitkomst }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>Nog geen gespeelde potjes.</p>
  </div>
</template>
