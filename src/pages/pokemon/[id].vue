<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const pokemon = ref({})
const speciesData = ref({})
const flavorTexts = ref([])

const typeColors = {
  grass: '#78C850', flying: '#98D8D8', fire: '#F08030',
  water: '#6890F0', normal: '#A8A878', poison: '#A040A0',
  electric: '#F8D030', ice: '#98D8D8', fighting: '#C03028',
  ground: '#E0C068', psychic: '#F85888', rock: '#B8A038',
  bug: '#A8B820', ghost: '#705898', dragon: '#7038F8',
  dark: '#705848', steel: '#B8B8D0', fairy: '#EE99AC',
}

const statLabels = {
  hp: 'PV', attack: 'Attaque', defense: 'Défense',
  'special-attack': 'Sp. Atk', 'special-defense': 'Sp. Def', speed: 'Vitesse',
}

const statColors = {
  hp: '#FF5959', attack: '#F5AC78', defense: '#FAE078',
  'special-attack': '#9DB7F5', 'special-defense': '#A7DB8D', speed: '#FA92B2',
}

onMounted(async () => {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon/' + route.params.id)
  pokemon.value = await res.json()

  // Second appel pour l'espèce et les descriptions
  const speciesRes = await fetch(pokemon.value.species.url)
  speciesData.value = await speciesRes.json()

  // Textes uniques en français (fallback anglais)
  const lang = 'fr'
  const entries = speciesData.value.flavor_text_entries?.filter(e => e.language.name === lang) ?? []
  const seen = new Set()
  flavorTexts.value = entries
      .filter(e => {
        const clean = e.flavor_text.replace(/\s+/g, ' ')
        if (seen.has(clean)) return false
        seen.add(clean)
        return true
      })
      .slice(0, 6)
})
</script>

<template>
  <v-container>
    <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mb-4" @click="$router.back()">
      Retour
    </v-btn>

    <v-alert v-if="!pokemon.id" type="error" variant="tonal">
      Pokémon non trouvé.
    </v-alert>

    <v-card v-else max-width="860" class="mx-auto pa-4">

      <!-- ① Nom + numéro -->
      <v-card-title class="text-h4 text-center text-capitalize justify-center d-flex mb-2">
        #{{ pokemon.id }} — {{ pokemon.name }}
      </v-card-title>

      <!-- ② Image + infos côte à côte -->
      <v-row align="center" class="mb-4">
        <v-col cols="12" sm="5" class="d-flex justify-center">
          <v-img
              :src="pokemon.sprites?.other?.['official-artwork']?.front_default"
              :alt="pokemon.name"
              max-width="220"
              contain
          />
        </v-col>

        <v-col cols="12" sm="7">
          <v-list density="compact">

            <v-list-item>
              <template #prepend><v-icon>mdi-pound</v-icon></template>
              <v-list-item-title>N° Pokédex</v-list-item-title>
              <template #append>#{{ pokemon.id }}</template>
            </v-list-item>

            <v-list-item>
              <template #prepend><v-icon>mdi-shape</v-icon></template>
              <v-list-item-title>Types</v-list-item-title>
              <template #append>
                <v-chip
                    v-for="t in pokemon.types"
                    :key="t.type.name"
                    size="small"
                    class="ml-1 text-capitalize"
                    :color="typeColors[t.type.name] || 'grey'"
                    text-color="white"
                >
                  {{ t.type.name }}
                </v-chip>
              </template>
            </v-list-item>

            <v-list-item>
              <template #prepend><v-icon>mdi-tag-outline</v-icon></template>
              <v-list-item-title>Espèce</v-list-item-title>
              <template #append>
                {{ speciesData.genera?.find(g => g.language.name === 'fr')?.genus ?? '—' }}
              </template>
            </v-list-item>

            <v-list-item>
              <template #prepend><v-icon>mdi-ruler</v-icon></template>
              <v-list-item-title>Taille</v-list-item-title>
              <template #append>{{ (pokemon.height * 0.1).toFixed(1) }} m</template>
            </v-list-item>

            <v-list-item>
              <template #prepend><v-icon>mdi-weight</v-icon></template>
              <v-list-item-title>Poids</v-list-item-title>
              <template #append>{{ (pokemon.weight * 0.1).toFixed(1) }} kg</template>
            </v-list-item>

            <v-list-item v-for="a in pokemon.abilities" :key="a.ability.name">
              <template #prepend><v-icon>mdi-star-outline</v-icon></template>
              <v-list-item-title class="text-capitalize">
                {{ a.ability.name.replaceAll('-', ' ') }}
              </v-list-item-title>
              <template #append>
                <v-chip v-if="a.is_hidden" size="x-small" color="deep-purple">Caché</v-chip>
                <span v-else class="text-caption text-grey">Talent</span>
              </template>
            </v-list-item>

          </v-list>
        </v-col>
      </v-row>

      <v-divider class="mb-4" />

      <!-- ③ Stats de base -->
      <div class="text-h6 mb-3">Statistiques de base</div>
      <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="mb-3">
        <div class="d-flex justify-space-between mb-1">
          <span class="text-caption text-uppercase font-weight-bold">
            {{ statLabels[stat.stat.name] }}
          </span>
          <span class="text-caption font-weight-bold">{{ stat.base_stat }}</span>
        </div>
        <v-progress-linear
            :model-value="stat.base_stat"
            :max="255"
            :color="statColors[stat.stat.name]"
            rounded
            height="10"
        />
      </div>

      <v-divider class="my-4" />

      <!-- ④ Descriptions Pokédex -->
      <div class="text-h6 mb-3">Entrées Pokédex</div>
      <v-card
          v-for="(entry, i) in flavorTexts"
          :key="i"
          variant="tonal"
          class="mb-2 pa-3"
      >
        <div class="text-caption text-uppercase text-grey mb-1">
          {{ entry.version.name.replaceAll('-', ' ') }}
        </div>
        <div>{{ entry.flavor_text.replace(/\f/g, ' ') }}</div>
      </v-card>

    </v-card>
  </v-container>
</template>