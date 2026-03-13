<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar">
    <RouterLink class="logo" to="/">🎮 Spellensite</RouterLink>
    <div class="links">
      <RouterLink to="/spel">Boter Kaas Eieren</RouterLink>
      <RouterLink v-if="auth.isLoggedIn" to="/spaans">Spaans</RouterLink>
      <RouterLink v-if="auth.isLoggedIn" to="/statistieken">Statistieken</RouterLink>
      <RouterLink v-if="auth.isAdmin" to="/admin">Admin</RouterLink>
      <template v-if="auth.isLoggedIn">
        <span class="email">{{ auth.user?.email }}</span>
        <RouterLink to="/wachtwoord">Wachtwoord</RouterLink>
        <button @click="logout">Uitloggen</button>
      </template>
      <template v-else>
        <RouterLink to="/login">Inloggen</RouterLink>
        <RouterLink to="/register">Registreren</RouterLink>
      </template>
    </div>
  </nav>
</template>
