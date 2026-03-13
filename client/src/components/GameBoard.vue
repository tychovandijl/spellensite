<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/game'

const props = defineProps({ modus: String })
const game = useGameStore()

const isVsAi = computed(() => props.modus === 'vs-ai-makkelijk' || props.modus === 'vs-ai-gemiddeld' || props.modus === 'vs-ai-moeilijk')

const bord = ref(Array(9).fill(null))
const huidigeTurn = ref('X') // X = menselijke speler altijd
const winnaar = ref(null)
const gelijkspel = ref(false)
const startTijd = ref(Date.now())

const winCombinaties = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
]

function controleerWinnaar(b) {
  for (const [a, c, d] of winCombinaties) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a]
  }
  return null
}

function minimax(b, isMaximizerAanZet) {
  const w = controleerWinnaar(b)
  if (w === 'O') return 10
  if (w === 'X') return -10
  if (b.every(Boolean)) return 0

  const scores = []
  b.forEach((cel, i) => {
    if (!cel) {
      const kopie = [...b]
      kopie[i] = isMaximizerAanZet ? 'O' : 'X'
      scores.push(minimax(kopie, !isMaximizerAanZet))
    }
  })
  return isMaximizerAanZet ? Math.max(...scores) : Math.min(...scores)
}

function aiWilleukeurigeZet(b) {
  const leeg = b.map((cel, i) => cel ? null : i).filter(i => i !== null)
  return leeg[Math.floor(Math.random() * leeg.length)]
}

function aiBestZet(b) {
  let bestScore = -Infinity
  let bestIndex = -1
  b.forEach((cel, i) => {
    if (!cel) {
      const kopie = [...b]
      kopie[i] = 'O'
      const score = minimax(kopie, false)
      if (score > bestScore) { bestScore = score; bestIndex = i }
    }
  })
  return bestIndex
}

function aiZet(b) {
  if (props.modus === 'vs-ai-makkelijk') return aiWilleukeurigeZet(b)
  if (props.modus === 'vs-ai-gemiddeld') return Math.random() < 0.5 ? aiBestZet(b) : aiWilleukeurigeZet(b)
  return aiBestZet(b)
}

function klik(index) {
  if (bord.value[index] || winnaar.value || gelijkspel.value) return
  if (isVsAi.value && huidigeTurn.value !== 'X') return

  bord.value[index] = huidigeTurn.value

  const w = controleerWinnaar(bord.value)
  if (w) { winnaar.value = w; opslaanResultaat(w); return }
  if (bord.value.every(Boolean)) { gelijkspel.value = true; opslaanResultaat(null); return }

  huidigeTurn.value = huidigeTurn.value === 'X' ? 'O' : 'X'

  if (isVsAi.value && huidigeTurn.value === 'O') {
    setTimeout(() => {
      const ai = aiZet(bord.value)
      if (ai !== undefined && ai !== -1) {
        bord.value[ai] = 'O'
        const w2 = controleerWinnaar(bord.value)
        if (w2) { winnaar.value = w2; opslaanResultaat(w2); return }
        if (bord.value.every(Boolean)) { gelijkspel.value = true; opslaanResultaat(null); return }
        huidigeTurn.value = 'X'
      }
    }, 300)
  }
}

function opslaanResultaat(w) {
  const duur = Math.round((Date.now() - startTijd.value) / 1000)
  const uitkomst = !w ? 'gelijkspel' : w === 'X' ? 'gewonnen' : 'verloren'
  game.saveResult(props.modus, uitkomst, duur).catch(() => {})
}

function opnieuw() {
  bord.value = Array(9).fill(null)
  huidigeTurn.value = 'X'
  winnaar.value = null
  gelijkspel.value = false
  startTijd.value = Date.now()
}

const statusTekst = computed(() => {
  if (winnaar.value === 'X') return isVsAi.value ? 'Jij wint! 🎉' : 'X wint! 🎉'
  if (winnaar.value === 'O') return isVsAi.value ? 'Computer wint! 🤖' : 'O wint! 🎉'
  if (gelijkspel.value) return 'Gelijkspel! 🤝'
  if (isVsAi.value && huidigeTurn.value === 'O') return 'Computer denkt...'
  return isVsAi.value ? 'Jouw beurt (X)' : `Beurt van ${huidigeTurn.value}`
})
</script>

<template>
  <div class="gameboard">
    <p class="status">{{ statusTekst }}</p>
    <div class="grid">
      <button
        v-for="(cel, i) in bord"
        :key="i"
        class="cel"
        :class="{ x: cel === 'X', o: cel === 'O' }"
        @click="klik(i)"
      >
        {{ cel }}
      </button>
    </div>
    <button v-if="winnaar || gelijkspel" class="btn-primary" @click="opnieuw">
      Opnieuw spelen
    </button>
  </div>
</template>
