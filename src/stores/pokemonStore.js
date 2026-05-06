import { defineStore } from 'pinia'
import api from "@/plugins/axiosAPI.js";
import apiGraphQL from "@/plugins/axiosGraphQL.js";

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    // données ici
    pokemons: [],
    pokemonTypes: [],
    favorites: [],
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

    totalFavorites: state => {
      return state.favorites.length
    },

    isFavorite: state => {
      return pokemon => {
        return state.favorites.includes(pokemon.id)
      }
    },

    getFavorites: state => {
      const favoritePokemons = state.favorites.map(favoriteId => {
        return state.pokemons.find(pokemon => pokemon.id === favoriteId)
      })
      return favoritePokemons.filter(pokemon => pokemon !== undefined)
    },
  },
  actions: {
    loadFavorites() {
      try {
        const savedFavorites = localStorage.getItem('pokemon_favorites')
        if (savedFavorites) {
          this.favorites = JSON.parse(savedFavorites)
          console.log('Favoris chargés :', this.favorites.length, 'éléments')
        } else {
          this.favorites = []
        }
      } catch (error) {
        console.error('Erreur lors du chargement des favoris :', error)
        this.favorites = []
      }
    },

    saveFavorites() {
      try {
        localStorage.setItem('pokemon_favorites', JSON.stringify(this.favorites))
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des favoris :', error)
      }
    },

    toggleFavorite(pokemon) {
      const favoriteIndex = this.favorites.findIndex(
          favoriteId => favoriteId === pokemon.id,
      )

      if (favoriteIndex === -1) {
        // Pas encore favori → on l'ajoute
        this.favorites.push(pokemon.id)
      } else {
        // Déjà favori → on le retire
        this.favorites.splice(favoriteIndex, 1)
      }

      // Sauvegarder après chaque changement
      this.saveFavorites()
    },

    cleanupFavorites() {
      const initialCount = this.favorites.length

      this.favorites = this.favorites.filter(favoriteId => {
        return this.pokemons.some(pokemon => pokemon.id === favoriteId)
      })

      const removedCount = initialCount - this.favorites.length
      if (removedCount > 0) {
        console.log('Nettoyage :', removedCount, 'favoris obsolètes supprimés')
        this.saveFavorites()
      }
    },


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
        this.cleanupFavorites()
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
        this.loadFavorites()
      } catch (error) {
        this.error = 'Erreur lors du chargement des données'
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
  },
})
