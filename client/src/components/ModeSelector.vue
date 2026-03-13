<script setup>
const emit = defineEmits(['kies'])
</script>

<template>
  <div class="mode-selector">
    <h2>Kies een spelmodus</h2>
    <div class="keuzes">
      <button class="modus-knop" @click="emit('kies', 'vs-ai-makkelijk')">
        🤖 Computer<br><small>Makkelijk</small>
      </button>
      <button class="modus-knop" @click="emit('kies', 'vs-ai-moeilijk')">
        🧠 Computer<br><small>Moeilijk</small>
      </button>
      <button class="modus-knop" @click="emit('kies', 'vs-speler')">
        👥 Twee spelers
      </button>
    </div>
  </div>
</template>
