<script setup>
const emit = defineEmits(['kies'])
</script>

<template>
  <div class="mode-selector">
    <h2>Kies een spelmodus</h2>
    <div class="keuzes">
      <button class="modus-knop" @click="emit('kies', 'vs-ai')">
        🤖 Tegen de computer
      </button>
      <button class="modus-knop" @click="emit('kies', 'vs-speler')">
        👥 Twee spelers
      </button>
    </div>
  </div>
</template>
