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

    <v-row v-else>
      <v-col
          v-for="pokemon in pokemons"
          :key="pokemon.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
      >
        <pokemon-card :pokemon="pokemon" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PokemonCard from "@/components/PokemonCard.vue";

// État réactif
const pokemons = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const query = `
      query GetPokemons {
        pokemon_v2_pokemon(
          where: { is_default: { _eq: true }, id: { _lte: 21 } }
          order_by: { id: asc }
        ) {
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
