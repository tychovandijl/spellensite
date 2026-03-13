<script setup>
import { useAuthStore } from '../stores/auth'
const auth = useAuthStore()
</script>

<template>
  <div class="home">
    <h1>Welkom bij Spellensite! 🎮</h1>
    <div v-if="auth.isLoggedIn" class="spel-keuze">
      <RouterLink to="/spel" class="spel-kaart">
        <span class="spel-icon">❌⭕</span>
        <strong>Boter Kaas en Eieren</strong>
        <small>Speel tegen de computer of een vriend</small>
      </RouterLink>
      <RouterLink to="/spaans" class="spel-kaart">
        <span class="spel-icon">🇪🇸</span>
        <strong>Spaans leren</strong>
        <small>Oefen woorden met flitskaarten</small>
      </RouterLink>
    </div>
    <RouterLink v-else to="/register" class="btn-primary">Maak een account aan</RouterLink>
  </div>
</template>

<style scoped>
.spel-keuze {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}
.spel-kaart {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 1.5rem 2rem;
  border: 2px solid #e0e7ff;
  border-radius: 16px;
  background: white;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s, background 0.15s;
  min-width: 180px;
}
.spel-kaart:hover { border-color: #6366f1; background: #eef2ff; }
.spel-icon { font-size: 2rem; }
.spel-kaart strong { font-size: 1rem; }
.spel-kaart small { color: #6b7280; font-size: 0.8rem; text-align: center; }
</style>
