import { defineStore } from 'pinia'
import api from "@/plugins/axiosAPI.js";
import apiGraphQL from "@/plugins/axiosGraphQL.js";

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    // données ici
    pokemons: [],
    pokemonTypes: [],
    isLoading: false,
    error: null,
  }),
  getters: {
    /**
     * Retourne le nombre de pokémons
     * @param state
     */
    totalPokemon: state => state.pokemons.length,
    /**
     * Retourne le pokémon correspondant à l'ID en paramètre
     * @param state
     * @returns {function(*): *}
     */
    getPokemonById: (state) => {
      return (pokemonId) => {
        return state.pokemons.find(p => p.id === pokemonId)
      }
    },
  },
  actions: {
    // Récupérer les pokémons
    async fetchPokemons() {
      try {
        const query = `
          query GetPokemons {
            pokemon_v2_pokemon(
              where: {
                is_default: { _eq: true },
                pokemon_v2_pokemonspecy: {
                  pokemon_v2_generation: { name: { _eq: "generation-vii" } }
                }
              }
              order_by: { id: asc }
            ) {
              id
              name
              pokemon_v2_pokemonsprites {
                sprites
              }
              pokemon_v2_pokemontypes {
                pokemon_v2_type { name }
              }
            }
          }
        `
        const { data } = await apiGraphQL.post('', { query })  // ← '' car baseURL pointe déjà sur l'endpoint GraphQL
        this.pokemons = data.data.pokemon_v2_pokemon     // ← axios wrappe dans data, GraphQL aussi → data.data.*

      } catch (err) {
        throw new Error(`Impossible de charger les Pokémon : ${err.message}`)
      }
    },


    async fetchTypes () {
      try {
        const response = await api.get('/type')
        this.pokemonTypes = response.data.results.map(type => type.name)
      } catch (error) {
        console.error('Erreur:', error.message)
        this.pokemonTypes = []
      }
    },

    async init() {
      this.isLoading = true
      try {
        await Promise.all([
          this.fetchPokemons(),
            this.fetchTypes(),
        ])
      } catch (error) {
        this.error = 'Erreur lors du chargement des données'
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
  },
})
