<template>
  <v-container>
    <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        class="mb-4"
        @click="$router.back()"
    >
      Retour
    </v-btn>

    <v-alert
        v-if="!pokemon"
        type="error"
        variant="tonal"
    >
      Pokémon non trouvé.
    </v-alert>

    <v-card
        v-else
        max-width="800"
        class="mx-auto"
    >


      <v-card-title class="text-h4">
        {{ pokemon.name }}
      </v-card-title>

      <v-card-subtitle>
        Niveau {{ pokemon.level }}
      </v-card-subtitle>

      <v-card-text>
        <p
            v-if="pokemon.description"
            class="text-body-1 mb-4"
        >
          {{ pokemon.description }}
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const pokemon = ref([])
const query = 'https://pokeapi.co/api/v2/pokemon/' + route.params.id

onMounted(async () => {
  const response = await fetch(query)
  pokemon.value = await response.json()
})

</script>