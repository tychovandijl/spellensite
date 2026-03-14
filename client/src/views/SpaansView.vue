<script setup>
import { ref, computed, watch } from 'vue'

const categorieën = {
  'Getallen': [
    { es: 'uno', nl: 'één' }, { es: 'dos', nl: 'twee' }, { es: 'tres', nl: 'drie' },
    { es: 'cuatro', nl: 'vier' }, { es: 'cinco', nl: 'vijf' }, { es: 'seis', nl: 'zes' },
    { es: 'siete', nl: 'zeven' }, { es: 'ocho', nl: 'acht' }, { es: 'nueve', nl: 'negen' },
    { es: 'diez', nl: 'tien' }, { es: 'veinte', nl: 'twintig' }, { es: 'cien', nl: 'honderd' },
  ],
  'Kleuren': [
    { es: 'rojo', nl: 'rood' }, { es: 'azul', nl: 'blauw' }, { es: 'verde', nl: 'groen' },
    { es: 'amarillo', nl: 'geel' }, { es: 'negro', nl: 'zwart' }, { es: 'blanco', nl: 'wit' },
    { es: 'naranja', nl: 'oranje' }, { es: 'morado', nl: 'paars' }, { es: 'rosa', nl: 'roze' },
    { es: 'gris', nl: 'grijs' }, { es: 'marrón', nl: 'bruin' }, { es: 'dorado', nl: 'goud' },
  ],
  'Eten & Drinken': [
    { es: 'pan', nl: 'brood' }, { es: 'agua', nl: 'water' }, { es: 'leche', nl: 'melk' },
    { es: 'carne', nl: 'vlees' }, { es: 'pollo', nl: 'kip' }, { es: 'pescado', nl: 'vis' },
    { es: 'arroz', nl: 'rijst' }, { es: 'queso', nl: 'kaas' }, { es: 'huevo', nl: 'ei' },
    { es: 'manzana', nl: 'appel' }, { es: 'naranja', nl: 'sinaasappel' }, { es: 'café', nl: 'koffie' },
  ],
  'Dieren': [
    { es: 'perro', nl: 'hond' }, { es: 'gato', nl: 'kat' }, { es: 'caballo', nl: 'paard' },
    { es: 'vaca', nl: 'koe' }, { es: 'pájaro', nl: 'vogel' }, { es: 'pez', nl: 'vis' },
    { es: 'conejo', nl: 'konijn' }, { es: 'ratón', nl: 'muis' }, { es: 'oso', nl: 'beer' },
    { es: 'tigre', nl: 'tijger' }, { es: 'elefante', nl: 'olifant' }, { es: 'serpiente', nl: 'slang' },
  ],
  'Zinnen': [
    { es: 'hola', nl: 'hallo' }, { es: 'adiós', nl: 'dag/doei' }, { es: 'gracias', nl: 'bedankt' },
    { es: 'por favor', nl: 'alsjeblieft' }, { es: 'perdón', nl: 'sorry/pardon' }, { es: 'sí', nl: 'ja' },
    { es: 'no', nl: 'nee' }, { es: 'buenos días', nl: 'goedemorgen' }, { es: 'buenas noches', nl: 'goedenacht' },
    { es: '¿cómo estás?', nl: 'hoe gaat het?' }, { es: 'me llamo', nl: 'ik heet' }, { es: 'no entiendo', nl: 'ik begrijp het niet' },
  ],
  'Sporten & Spelen': [
    { es: 'nadar', nl: 'zwemmen' }, { es: 'correr', nl: 'rennen' }, { es: 'jugar', nl: 'spelen' },
    { es: 'saltar', nl: 'springen' }, { es: 'lanzar', nl: 'gooien' }, { es: 'patinar', nl: 'schaatsen' },
    { es: 'montar en bici', nl: 'fietsen' }, { es: 'escalar', nl: 'klimmen' }, { es: 'ganar', nl: 'winnen' },
    { es: 'perder', nl: 'verliezen' }, { es: 'la pelota', nl: 'de bal' }, { es: 'el equipo', nl: 'het team' },
  ],
}

const geselecteerdeCat = ref(null)
const kaarten = ref([])
const huidigIndex = ref(0)
const opties = ref([])
const gekozenAntwoord = ref(null)
const score = ref(0)
const streak = ref(0)
const besteStreak = ref(0)
const klaar = ref(false)

const huidigeKaart = computed(() => kaarten.value[huidigIndex.value])
const aantalKaarten = computed(() => kaarten.value.length)

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function kiesCat(cat) {
  geselecteerdeCat.value = cat
  kaarten.value = shuffle(categorieën[cat])
  huidigIndex.value = 0
  score.value = 0
  streak.value = 0
  besteStreak.value = 0
  klaar.value = false
  gekozenAntwoord.value = null
  maakOpties()
}

function maakOpties() {
  const juist = huidigeKaart.value.nl
  const catWoorden = categorieën[geselecteerdeCat.value].map(k => k.nl)
  const andereCatWoorden = Object.entries(categorieën)
    .filter(([cat]) => cat !== geselecteerdeCat.value)
    .flatMap(([, woorden]) => woorden.map(k => k.nl))
  const foutPool = shuffle([
    ...catWoorden.filter(t => t !== juist),
    ...andereCatWoorden.filter(t => t !== juist),
  ])
  opties.value = shuffle([juist, ...foutPool.slice(0, 3)])
}

function kiesAntwoord(optie) {
  if (gekozenAntwoord.value !== null) return
  gekozenAntwoord.value = optie
  if (optie === huidigeKaart.value.nl) {
    score.value++
    streak.value++
    if (streak.value > besteStreak.value) besteStreak.value = streak.value
  } else {
    streak.value = 0
  }
}

function volgende() {
  if (huidigIndex.value + 1 >= aantalKaarten.value) {
    klaar.value = true
  } else {
    huidigIndex.value++
    gekozenAntwoord.value = null
    maakOpties()
  }
}

function opnieuw() {
  kiesCat(geselecteerdeCat.value)
}

function terugNaarMenu() {
  geselecteerdeCat.value = null
}

const scoreKleur = computed(() => {
  const pct = score.value / aantalKaarten.value
  if (pct >= 0.8) return 'geweldig'
  if (pct >= 0.5) return 'prima'
  return 'oefenen'
})
</script>

<template>
  <div class="spaans-pagina">

    <!-- Categorie kiezen -->
    <div v-if="!geselecteerdeCat" class="cat-kiezer">
      <h2>🇪🇸 Spaans leren</h2>
      <p class="subtitel">Kies een categorie en raad de vertaling!</p>
      <div class="cat-grid">
        <button
          v-for="(woorden, cat) in categorieën"
          :key="cat"
          class="cat-knop"
          @click="kiesCat(cat)"
        >
          <span class="cat-naam">{{ cat }}</span>
          <small>{{ woorden.length }} woorden</small>
        </button>
      </div>
    </div>

    <!-- Eindscherm -->
    <div v-else-if="klaar" class="eindscherm">
      <h2>Klaar! 🎉</h2>
      <div class="eind-score" :class="scoreKleur">
        {{ score }} / {{ aantalKaarten }} goed
      </div>
      <p v-if="scoreKleur === 'geweldig'">Uitstekend! Je beheerst deze categorie goed.</p>
      <p v-else-if="scoreKleur === 'prima'">Prima gedaan! Blijf oefenen.</p>
      <p v-else>Nog wat oefenen nodig — maar je komt er!</p>
      <p class="streak-info">Beste reeks: {{ besteStreak }} op rij</p>
      <div class="eind-knoppen">
        <button class="btn-primary" @click="opnieuw">Opnieuw</button>
        <button class="btn-secondary" @click="terugNaarMenu">Andere categorie</button>
      </div>
    </div>

    <!-- Quiz -->
    <div v-else class="quiz">
      <div class="quiz-header">
        <button class="terug-knop" @click="terugNaarMenu">← Terug</button>
        <span class="voortgang">{{ huidigIndex + 1 }} / {{ aantalKaarten }}</span>
        <span class="score-badge">✅ {{ score }}</span>
        <span v-if="streak >= 2" class="streak-badge">🔥 {{ streak }}</span>
      </div>

      <div class="voortgang-balk">
        <div class="voortgang-vulling" :style="{ width: ((huidigIndex) / aantalKaarten * 100) + '%' }"></div>
      </div>

      <div class="kaart">
        <p class="taal-label">Spaans</p>
        <p class="spaans-woord">{{ huidigeKaart.es }}</p>
        <p class="taal-label">Wat betekent dit in het Nederlands?</p>
      </div>

      <div class="opties">
        <button
          v-for="optie in opties"
          :key="optie"
          class="optie-knop"
          :class="{
            correct: gekozenAntwoord !== null && optie === huidigeKaart.nl,
            fout: gekozenAntwoord === optie && optie !== huidigeKaart.nl,
            gekozen: gekozenAntwoord !== null,
          }"
          @click="kiesAntwoord(optie)"
        >
          {{ optie }}
        </button>
      </div>

      <div v-if="gekozenAntwoord !== null" class="feedback">
        <p v-if="gekozenAntwoord === huidigeKaart.nl" class="feedback-goed">Goed! 🎉</p>
        <p v-else class="feedback-fout">Fout — het was: <strong>{{ huidigeKaart.nl }}</strong></p>
        <button class="btn-primary" @click="volgende">
          {{ huidigIndex + 1 >= aantalKaarten ? 'Resultaten bekijken' : 'Volgende →' }}
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.spaans-pagina {
  max-width: 560px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  background: rgba(255, 255, 255, 0.93);
  border-radius: 20px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.25);
  position: relative;
  z-index: 1;
}

h2 { text-align: center; margin-bottom: 0.5rem; }
.subtitel { text-align: center; color: #6b7280; margin-bottom: 1.5rem; }

/* Categorie grid */
.cat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}
.cat-knop {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1rem;
  border: 2px solid #e0e7ff;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.cat-knop:hover { border-color: #6366f1; background: #eef2ff; }
.cat-naam { font-weight: 600; font-size: 1rem; }
.cat-knop small { color: #6b7280; font-size: 0.8rem; }

/* Quiz header */
.quiz-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
.terug-knop {
  background: none;
  border: none;
  cursor: pointer;
  color: #6366f1;
  font-size: 0.9rem;
  padding: 0;
}
.voortgang { margin-left: auto; color: #6b7280; font-size: 0.9rem; }
.score-badge { background: #d1fae5; color: #065f46; padding: 0.15rem 0.5rem; border-radius: 999px; font-size: 0.85rem; }
.streak-badge { background: #fef3c7; color: #92400e; padding: 0.15rem 0.5rem; border-radius: 999px; font-size: 0.85rem; }

/* Voortgangsbalk */
.voortgang-balk {
  height: 6px;
  background: #e0e7ff;
  border-radius: 999px;
  margin-bottom: 1.5rem;
  overflow: hidden;
}
.voortgang-vulling {
  height: 100%;
  background: #6366f1;
  border-radius: 999px;
  transition: width 0.3s;
}

/* Kaart */
.kaart {
  background: white;
  border: 2px solid #e0e7ff;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
}
.taal-label { color: #9ca3af; font-size: 0.8rem; margin: 0 0 0.5rem; }
.spaans-woord { font-size: 2rem; font-weight: 700; color: #1e1b4b; margin: 0 0 0.75rem; }

/* Opties */
.opties {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
  margin-bottom: 1rem;
}
.optie-knop {
  padding: 0.75rem;
  border: 2px solid #e0e7ff;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  font-size: 0.95rem;
  transition: border-color 0.15s, background 0.15s;
}
.optie-knop:not(.gekozen):hover { border-color: #6366f1; background: #eef2ff; }
.optie-knop.correct { border-color: #10b981; background: #d1fae5; color: #065f46; font-weight: 600; }
.optie-knop.fout { border-color: #ef4444; background: #fee2e2; color: #991b1b; }

/* Feedback */
.feedback { text-align: center; }
.feedback-goed { color: #065f46; font-weight: 600; margin-bottom: 0.75rem; }
.feedback-fout { color: #991b1b; margin-bottom: 0.75rem; }

/* Eindscherm */
.eindscherm { text-align: center; padding: 2rem 0; }
.eind-score {
  font-size: 3rem;
  font-weight: 700;
  margin: 1rem 0;
}
.eind-score.geweldig { color: #065f46; }
.eind-score.prima { color: #1e40af; }
.eind-score.oefenen { color: #92400e; }
.streak-info { color: #6b7280; margin: 0.5rem 0 1.5rem; }
.eind-knoppen { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }

.btn-primary {
  background: #6366f1;
  color: white;
  border: none;
  padding: 0.6rem 1.4rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
}
.btn-primary:hover { background: #4f46e5; }
.btn-secondary {
  background: white;
  color: #6366f1;
  border: 2px solid #6366f1;
  padding: 0.6rem 1.4rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
}
.btn-secondary:hover { background: #eef2ff; }
</style>
