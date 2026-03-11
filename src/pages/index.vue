<template>
  <v-container>
    <h1 class="text-h4 my-4">Pokémons</h1>

    <!-- Chargement (skeleton) -->
    <v-row v-if="loading">
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="image, heading, text" />
      </v-col>
    </v-row>

    <!-- Erreur -->
    <v-alert v-else-if="error" type="error" class="my-4">
      {{ error }}
    </v-alert>

    <!-- TODO : Liste des personnages -->
    <v-row v-else>
      <v-col
          v-for="pokemon in pokemons"
          :key="pokemon.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
      >
        <v-card :to="`/character/${pokemon.id}`" class="h-100" hover>
          <v-card-title>#{{ pokemon.id }} - {{ pokemon.name }}</v-card-title>
          <v-chip
              v-for="typeObj in pokemon.pokemon_v2_pokemontypes"
              :key="typeObj.pokemon_v2_type.name"
              :color="typesColor(typeObj.pokemon_v2_type.name).bg"
              size="small"
              class="mr-2"
          >
            {{ typeObj.pokemon_v2_type.name }}
          </v-chip>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

function typesColor(status) {
  const TYPE_COLORS = {
    fire: { bg: "#FF6B35", light: "#FFF0EB" },
    water: { bg: "#4A9EE0", light: "#EBF4FF" },
    grass: { bg: "#5DBE62", light: "#EDFAEE" },
    electric: { bg: "#F7C948", light: "#FFFBEB" },
    psychic: { bg: "#E05C8A", light: "#FFEEF5" },
    ice: { bg: "#74CCE0", light: "#EDFAFD" },
    dragon: { bg: "#5B6FC0", light: "#EEEFFE" },
    dark: { bg: "#4A4A6A", light: "#EBEBF5" },
    fairy: { bg: "#E8A0C0", light: "#FFF0F7" },
    fighting: { bg: "#C54C3A", light: "#FCECEA" },
    poison: { bg: "#9B5DB5", light: "#F5EEFA" },
    ground: { bg: "#C8A456", light: "#FBF6EB" },
    rock: { bg: "#A8925A", light: "#F5F0E8" },
    bug: { bg: "#8BBE3A", light: "#F2F9E9" },
    ghost: { bg: "#6056A0", light: "#EDECF8" },
    steel: { bg: "#8A9EAE", light: "#EFF2F5" },
    flying: { bg: "#8BAED0", light: "#EEF4FA" },
    normal: { bg: "#A0A0A0", light: "#F5F5F5" },
  };
  return TYPE_COLORS[status] || 'grey'
}

// État réactif
const pokemons = ref([])
const loading = ref(true)
const error = ref(null)

// TODO : Charger les personnages depuis l'API Rick and Morty
// URL : https://rickandmortyapi.com/api/character
// La réponse contient { info: {...}, results: [...] }
onMounted(async () => {
  try {
    const query = `
      query GetPokemons {
        pokemon_v2_pokemon(limit: 1025, order_by: {id: asc}) {
          id
          name
          pokemon_v2_pokemontypes {
            pokemon_v2_type { name }
          }
        }
      }
    `
    const response = await fetch('https://beta.pokeapi.co/graphql/v1beta', {
      method: 'POST',                                    // ← toujours POST en GraphQL
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })                    // ← la query dans le body
    })

    if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`)

    const { data } = await response.json()             // ← les résultats sont dans data.*
    pokemons.value = data.pokemon_v2_pokemon

  } catch (err) {
    error.value = `Impossible de charger les Pokémon : ${err.message}`
  } finally {
    loading.value = false
  }
})
</script>
