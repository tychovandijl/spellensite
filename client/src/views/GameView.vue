<script setup>
import { ref } from 'vue'
import GameBoard from '../components/GameBoard.vue'
import ModeSelector from '../components/ModeSelector.vue'

const modus = ref(null) // 'vs-ai' | 'vs-speler'
</script>

<template>
  <div class="spel-pagina">
    <ModeSelector v-if="!modus" @kies="(m) => (modus = m)" />
    <div v-else>
      <button class="terug" @click="modus = null">← Andere modus</button>
      <GameBoard :modus="modus" />
    </div>
  </div>
</template>
