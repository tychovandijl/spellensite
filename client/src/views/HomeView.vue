<script setup>
import { useAuthStore } from '../stores/auth'
const auth = useAuthStore()
</script>

<template>
  <div class="home">
    <h1>Welkom bij Spellensite! 🎮</h1>
    <p>Speel Boter Kaas en Eieren tegen de computer of een vriend.</p>
    <RouterLink v-if="auth.isLoggedIn" to="/spel" class="btn-primary">Spelen</RouterLink>
    <RouterLink v-else to="/register" class="btn-primary">Maak een account aan</RouterLink>
  </div>
</template>
