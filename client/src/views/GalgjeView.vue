<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')
const MAX_FOUTEN = 6

const categorieën = {
  'Dieren': ['olifant', 'giraffe', 'vlinder', 'schildpad', 'krokodil', 'dolfijn', 'kangoeroe', 'neushoorn', 'flamingo', 'kameleon', 'pinguin', 'luipaard'],
  'Eten & Drinken': ['aardappel', 'broccoli', 'ananas', 'watermeloen', 'sinaasappel', 'chocolade', 'spaghetti', 'stroopwafel', 'pannenkoek', 'appelsap', 'tomatensoep', 'havermout'],
  'Landen': ['nederland', 'duitsland', 'frankrijk', 'australie', 'argentinie', 'portugal', 'zweden', 'noorwegen', 'ierland', 'hongarije', 'griekenland', 'marokko'],
  'Sporten': ['voetbal', 'basketbal', 'volleybal', 'badminton', 'zwemmen', 'wielrennen', 'schaatsen', 'atletiek', 'turnen', 'roeien', 'tennis', 'judo'],
  'Natuur': ['regenboog', 'waterval', 'vulkaan', 'orkaan', 'ijsberg', 'woestijn', 'savanne', 'gletsjer', 'tsunami', 'aardbeving', 'onweer', 'tornado'],
}

const fase = ref('menu')
const huidigeCat = ref('')
const huidigWoord = ref('')
const geradeLetters = ref(new Set())
const fouten = ref(0)
const gewonnen = ref(false)
const aantalGewonnen = ref(0)
const aantalGespeeld = ref(0)

function kiesCat(cat) {
  huidigeCat.value = cat
  aantalGewonnen.value = 0
  aantalGespeeld.value = 0
  nieuwWoord()
}

function nieuwWoord() {
  const woorden = categorieën[huidigeCat.value]
  huidigWoord.value = woorden[Math.floor(Math.random() * woorden.length)]
  geradeLetters.value = new Set()
  fouten.value = 0
  gewonnen.value = false
  fase.value = 'spel'
}

function raad(letter) {
  if (geradeLetters.value.has(letter) || fase.value === 'einde') return
  geradeLetters.value = new Set([...geradeLetters.value, letter])
  if (!huidigWoord.value.includes(letter)) {
    fouten.value++
    if (fouten.value >= MAX_FOUTEN) {
      gewonnen.value = false
      aantalGespeeld.value++
      fase.value = 'einde'
    }
  } else if (huidigWoord.value.split('').every(l => geradeLetters.value.has(l))) {
    gewonnen.value = true
    aantalGewonnen.value++
    aantalGespeeld.value++
    fase.value = 'einde'
  }
}

const woordWeergave = computed(() =>
  huidigWoord.value.split('').map(l => geradeLetters.value.has(l) ? l : '_')
)

function terugNaarMenu() {
  fase.value = 'menu'
  huidigeCat.value = ''
}
</script>

<template>
  <div class="galgje-container">

    <!-- MENU -->
    <div v-if="fase === 'menu'" class="menu">
      <h1>🪢 Galgje</h1>
      <p class="subtitel">Kies een categorie om te beginnen</p>
      <div class="categorie-grid">
        <button v-for="(_, cat) in categorieën" :key="cat" class="cat-knop" @click="kiesCat(cat)">
          {{ cat }}
        </button>
      </div>
      <button class="terug-knop" @click="router.push('/')">← Terug naar home</button>
    </div>

    <!-- SPEL / EINDE -->
    <div v-else class="spel">
      <div class="spel-header">
        <span class="categorie-badge">{{ huidigeCat }}</span>
        <span class="score-badge">✅ {{ aantalGewonnen }}/{{ aantalGespeeld }}</span>
        <span class="fouten-badge">❌ {{ fouten }}/{{ MAX_FOUTEN }}</span>
      </div>

      <!-- SVG Galgje -->
      <svg viewBox="0 0 200 220" class="hangman-svg">
        <!-- Galg -->
        <line x1="20" y1="210" x2="180" y2="210" stroke="#4b5563" stroke-width="4" stroke-linecap="round"/>
        <line x1="60" y1="210" x2="60" y2="15" stroke="#4b5563" stroke-width="4" stroke-linecap="round"/>
        <line x1="60" y1="15" x2="140" y2="15" stroke="#4b5563" stroke-width="4" stroke-linecap="round"/>
        <line x1="140" y1="15" x2="140" y2="45" stroke="#4b5563" stroke-width="4" stroke-linecap="round"/>
        <!-- Hoofd -->
        <circle v-if="fouten >= 1" cx="140" cy="62" r="17" stroke="#6366f1" stroke-width="3" fill="none"/>
        <!-- Lijf -->
        <line v-if="fouten >= 2" x1="140" y1="79" x2="140" y2="140" stroke="#6366f1" stroke-width="3" stroke-linecap="round"/>
        <!-- Linkerarm -->
        <line v-if="fouten >= 3" x1="140" y1="95" x2="108" y2="125" stroke="#6366f1" stroke-width="3" stroke-linecap="round"/>
        <!-- Rechterarm -->
        <line v-if="fouten >= 4" x1="140" y1="95" x2="172" y2="125" stroke="#6366f1" stroke-width="3" stroke-linecap="round"/>
        <!-- Linkerbeen -->
        <line v-if="fouten >= 5" x1="140" y1="140" x2="108" y2="178" stroke="#6366f1" stroke-width="3" stroke-linecap="round"/>
        <!-- Rechterbeen -->
        <line v-if="fouten >= 6" x1="140" y1="140" x2="172" y2="178" stroke="#6366f1" stroke-width="3" stroke-linecap="round"/>
      </svg>

      <!-- Woord -->
      <div class="woord-weergave">
        <span v-for="(letter, i) in woordWeergave" :key="i" class="letter-vak">{{ letter }}</span>
      </div>

      <!-- Eindscherm -->
      <div v-if="fase === 'einde'" class="einde-bericht" :class="gewonnen ? 'gewonnen' : 'verloren'">
        <div class="einde-tekst">
          <span v-if="gewonnen">🎉 Geweldig! Geraden!</span>
          <span v-else>😢 Het woord was: <strong>{{ huidigWoord }}</strong></span>
        </div>
        <div class="einde-knoppen">
          <button class="actie-knop" @click="nieuwWoord">Nieuw woord</button>
          <button class="actie-knop secundair" @click="terugNaarMenu">Menu</button>
        </div>
      </div>

      <!-- Toetsenbord -->
      <div v-if="fase === 'spel'" class="toetsenbord">
        <button
          v-for="letter in ALPHABET"
          :key="letter"
          class="toets"
          :class="{
            correct: geradeLetters.has(letter) && huidigWoord.includes(letter),
            fout: geradeLetters.has(letter) && !huidigWoord.includes(letter),
          }"
          :disabled="geradeLetters.has(letter)"
          @click="raad(letter)"
        >{{ letter.toUpperCase() }}</button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.galgje-container {
  max-width: 540px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: inherit;
}

/* MENU */
.menu { text-align: center; }
.menu h1 { font-size: 2rem; margin-bottom: 0.25rem; }
.subtitel { color: #6b7280; margin-bottom: 1.5rem; }
.categorie-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}
.cat-knop {
  padding: 0.9rem 1rem;
  border: 2px solid #e0e7ff;
  border-radius: 12px;
  background: white;
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.cat-knop:hover { border-color: #6366f1; background: #eef2ff; }
.terug-knop {
  background: none;
  border: none;
  color: #6366f1;
  cursor: pointer;
  font-size: 0.9rem;
}

/* SPEL */
.spel { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.spel-header {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}
.categorie-badge, .score-badge, .fouten-badge {
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}
.categorie-badge { background: #eef2ff; color: #4f46e5; }
.score-badge { background: #dcfce7; color: #16a34a; }
.fouten-badge { background: #fee2e2; color: #dc2626; }

.hangman-svg {
  width: 200px;
  height: 220px;
}

/* Woord */
.woord-weergave {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  justify-content: center;
}
.letter-vak {
  display: inline-flex;
  align-items: flex-end;
  justify-content: center;
  width: 2rem;
  height: 2.4rem;
  border-bottom: 2px solid #4b5563;
  font-size: 1.3rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #1f2937;
}

/* Eindscherm */
.einde-bericht {
  padding: 1rem 1.5rem;
  border-radius: 12px;
  text-align: center;
}
.einde-bericht.gewonnen { background: #dcfce7; color: #15803d; }
.einde-bericht.verloren { background: #fee2e2; color: #b91c1c; }
.einde-tekst { font-size: 1.1rem; margin-bottom: 0.75rem; }
.einde-knoppen { display: flex; gap: 0.5rem; justify-content: center; }
.actie-knop {
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 8px;
  background: #6366f1;
  color: white;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.15s;
}
.actie-knop:hover { background: #4f46e5; }
.actie-knop.secundair { background: #e5e7eb; color: #374151; }
.actie-knop.secundair:hover { background: #d1d5db; }

/* Toetsenbord */
.toetsenbord {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  justify-content: center;
  max-width: 420px;
}
.toets {
  width: 2.4rem;
  height: 2.4rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.1s, border-color 0.1s;
}
.toets:hover:not(:disabled) { border-color: #6366f1; background: #eef2ff; }
.toets:disabled { cursor: default; }
.toets.correct { background: #dcfce7; border-color: #16a34a; color: #15803d; }
.toets.fout { background: #fee2e2; border-color: #dc2626; color: #b91c1c; }
</style>
