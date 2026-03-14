<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const spellenOpen = ref(false)

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar">
    <RouterLink class="logo" to="/">🎮 Spellensite</RouterLink>
    <div class="links">

      <!-- Spellen dropdown -->
      <div v-if="auth.isLoggedIn" class="dropdown" @mouseenter="spellenOpen = true" @mouseleave="spellenOpen = false">
        <button class="dropdown-trigger">Spellen ▾</button>
        <div v-if="spellenOpen" class="dropdown-menu">
          <RouterLink to="/spel" @click="spellenOpen = false">❌⭕ Boter Kaas Eieren</RouterLink>
          <RouterLink to="/spaans" @click="spellenOpen = false">🇪🇸 Spaans leren</RouterLink>
          <RouterLink to="/galgje" @click="spellenOpen = false">🪢 Galgje</RouterLink>
        </div>
      </div>
      <RouterLink v-else to="/spel">Spellen</RouterLink>

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

<style scoped>
.dropdown {
  position: relative;
}
.dropdown-trigger {
  background: none;
  border: none;
  font-size: inherit;
  color: inherit;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
}
.dropdown-trigger:hover { color: #6366f1; }
.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  min-width: 200px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.dropdown-menu a {
  padding: 0.65rem 1rem;
  text-decoration: none;
  color: #374151;
  font-size: 0.9rem;
  transition: background 0.1s;
}
.dropdown-menu a:hover { background: #eef2ff; color: #6366f1; }
</style>
