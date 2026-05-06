<template>
  <v-container>
    <h1 class="text-h3 text-center my-6">
      Mes favoris
    </h1>

    <v-alert
        v-if="pokemonStore.totalFavorites === 0"
        type="info"
        variant="tonal"
        class="mb-6"
    >
      Vous n'avez pas encore de Pokémon favoris.
      Cliquez sur le coeur d'un Pokémon pour l'ajouter !
    </v-alert>

    <v-row v-else>
      <v-col
          v-for="pokemon in pokemonStore.getFavorites"
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
import { usePokemonStore } from '@/stores/pokemonStore'
import PokemonCard from '@/components/PokemonCard.vue'

const pokemonStore = usePokemonStore()
</script>