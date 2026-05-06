<template>
  <v-card :to="`/pokemon/${pokemon.id}`" class="h-100" hover>

    <v-card-actions>
      <v-spacer />
      <v-btn :class="{ 'favorite-active': pokemonStore.isFavorite(pokemon) }"
          :icon="pokemonStore.isFavorite(pokemon) ? 'mdi-heart' : 'mdi-heart-outline'"
          :color="pokemonStore.isFavorite(pokemon) ? 'red' : ''"
          variant="text"
          @click.stop.prevent="handleToggleFavorite()"
      />
    </v-card-actions>

    <v-img
        :src="pokemon.pokemon_v2_pokemonsprites[0].sprites.other['official-artwork'].front_default"
        :alt="pokemon.name"
        cover
    />
    <v-card-title>#{{ pokemon.id }} - {{ pokemon.name }}</v-card-title>
    <v-card-text>
      <v-chip
          v-for="typeObj in pokemon.pokemon_v2_pokemontypes"
          :key="typeObj.pokemon_v2_type.name"
          :color="typesColor(typeObj.pokemon_v2_type.name).bg"
          size="small"
          class="mr-2"
      >
        {{ typeObj.pokemon_v2_type.name }}
      </v-chip>
    </v-card-text>

    <v-snackbar
        v-model="showSnackbar"
        :timeout="2000"
        color="primary"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </v-card>
</template>

<style scoped>
.favorite-active {
  animation: heartbeat 0.6s ease-in-out;
}
</style>

<script setup>

import {usePokemonStore} from "@/stores/pokemonStore.js";
import {ref} from "vue";

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

const { pokemon } = defineProps({
  pokemon: {
    type: Object,
    required: true,
  },
})

const showSnackbar = ref(false)
const snackbarMessage = ref('')
const pokemonStore = usePokemonStore()

function handleToggleFavorite() {
  const wasFavorite = pokemonStore.isFavorite(pokemon)
  pokemonStore.toggleFavorite(pokemon)
  snackbarMessage.value = wasFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris'
  showSnackbar.value = true
}
</script>


<style scoped>
.favorite-active {
  animation: heartbeat 0.6s ease-in-out;
}
</style>