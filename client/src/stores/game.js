import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const useGameStore = defineStore('game', () => {
  const history = ref([])
  const stats = ref({ gewonnen: 0, verloren: 0, gelijkspel: 0 })

  async function saveResult(modus, uitkomst, duur) {
    await axios.post(`${API}/game/result`, { modus, uitkomst, duur })
    stats.value[uitkomst]++
  }

  async function fetchHistory() {
    const { data } = await axios.get(`${API}/game/history`)
    history.value = data.history
  }

  async function fetchStats() {
    const { data } = await axios.get(`${API}/game/stats`)
    stats.value = data.stats
  }

  return { history, stats, saveResult, fetchHistory, fetchStats }
})
