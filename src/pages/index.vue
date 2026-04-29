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
import PokemonCard from "@/components/PokemonCard.vue";

import { usePokemonStore } from '@/stores/pokemonStore'
import { storeToRefs } from 'pinia'

const pokemonStore = usePokemonStore()
const { pokemons } = storeToRefs(pokemonStore)
</script>
