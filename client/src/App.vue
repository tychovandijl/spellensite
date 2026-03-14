<script setup>
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div class="bg-decor" aria-hidden="true">
    <svg class="eiffeltoren" viewBox="0 0 100 180" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <!-- Linkerpoot -->
      <polygon points="0,180 25,180 44,110 36,110"/>
      <!-- Rechterpoot -->
      <polygon points="100,180 75,180 56,110 64,110"/>
      <!-- Platform 1 -->
      <rect x="3" y="104" width="94" height="10" rx="2"/>
      <!-- Bovenste toren -->
      <polygon points="36,114 64,114 60,74 55,20 50,4 45,20 40,74"/>
      <!-- Platform 2 -->
      <rect x="28" y="69" width="44" height="7" rx="2"/>
      <!-- Antenne -->
      <rect x="48" y="0" width="4" height="18" rx="1"/>
    </svg>
  </div>
  <NavBar />
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
.bg-decor {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 0;
  color: rgba(15, 8, 40, 0.45);
}
.eiffeltoren {
  width: 320px;
  height: auto;
  display: block;
}
</style>
