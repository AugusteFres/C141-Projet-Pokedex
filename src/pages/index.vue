<template>
  <v-container>
    <h1 class="text-h4 my-4">Pokémons</h1>


    <v-row class="mb-4">
      <v-col cols="4" sm="6" md="4">
        <v-text-field
            v-model="searchQuery"
            label="Rechercher un Pokémon"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
            variant="outlined"
            density="compact"
        />
      </v-col>

      <v-col cols="4" sm="6" md="4">
        <v-select
            v-model="selectedType"
            :items="pokemonStore.pokemonTypes"
            item-title="name"
            item-value="id"
            label="Filtrer par type"
            prepend-inner-icon="mdi-filter"
            clearable
            hide-details
            variant="outlined"
            density="compact"
        />
      </v-col>

      <v-col cols="4" sm="6" md="4">
        <v-select
            v-model="sortOrder"
            :items="[
              { title: 'N° Croissant', value: 'num-asc' },
              { title: 'N° Décroissant', value: 'num-desc' },
              { title: 'A → Z', value: 'alpha-asc' },
              { title: 'Z → A', value: 'alpha-desc' },
            ]"
            item-title="title"
            item-value="value"
            label="Trier par"
            prepend-inner-icon="mdi-sort"
            variant="outlined"
            density="compact"
            hide-details
        />
      </v-col>
    </v-row>

    <!-- Chargement (skeleton) -->
    <v-row v-if="pokemonStore.isLoading">
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="image, heading, text" />
      </v-col>
    </v-row>

    <!-- Erreur -->
    <v-alert v-else-if="error" type="error" class="my-4">
      {{ error }}
    </v-alert>

    <v-alert
        v-if="sortedPokemons.length === 0"
        type="info"
        variant="tonal"
        class="mb-6"
    >
      Aucun Pokémon ne correspond à votre recherche.
    </v-alert>

    <v-row v-else>
      <v-col
          v-for="pokemon in sortedPokemons"
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
import PokemonCard from "@/components/PokemonCard.vue";

import { usePokemonStore } from '@/stores/pokemonStore'
import { storeToRefs } from 'pinia'
import {computed, ref} from "vue";

const pokemonStore = usePokemonStore()
const { pokemons } = storeToRefs(pokemonStore)

// recherche
const searchQuery = ref('')

const filteredBySearch = computed(() => {
  if (!searchQuery.value) return filteredByType.value
  const query = searchQuery.value.toLowerCase()
  return filteredByType.value.filter(pokemon =>
      pokemon.name.toLowerCase().includes(query) ||
      pokemon.id.toString().includes(query)        // ← recherche par numéro
  )
})

// tri par types
const selectedType = ref(null)

const filteredByType = computed(() => {
  if (!selectedType.value) return pokemonStore.pokemons
  return pokemonStore.pokemons.filter(pokemon =>
      pokemon.pokemon_v2_pokemontypes.some(t => t.pokemon_v2_type.name === selectedType.value)
  )
})

// Remplace sortOrder + toggleSort par :
const sortOrder = ref(null)

const sortedPokemons = computed(() => {
  const list = [...filteredBySearch.value]

  if (sortOrder.value === 'num-asc')  return list.sort((a, b) => a.id - b.id)
  if (sortOrder.value === 'num-desc') return list.sort((a, b) => b.id - a.id)
  if (sortOrder.value === 'alpha-asc')  return list.sort((a, b) => a.name.localeCompare(b.name, 'fr'))
  if (sortOrder.value === 'alpha-desc') return list.sort((a, b) => b.name.localeCompare(a.name, 'fr'))

  return list // null → aucun tri
})

</script>
