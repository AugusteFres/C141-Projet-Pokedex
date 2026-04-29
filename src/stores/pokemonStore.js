import { defineStore } from 'pinia'

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    // données ici
    pokemons: [],
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
                  pokemon_v2_generation: { name: { _eq: "generation-iii" } }
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
        const response = await fetch('https://beta.pokeapi.co/graphql/v1beta', {
          method: 'POST',                                    // ← toujours POST en GraphQL
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })                    // ← la query dans le body
        })

        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`)

        const { data } = await response.json()             // ← les résultats sont dans data.*
        this.pokemons = data.pokemon_v2_pokemon

      } catch (err) {
        throw new Error (`Impossible de charger les Pokémon : ${err.message}`)
      }
    },

    async init() {
      this.isLoading = true
      try {
        await Promise.all([
          this.fetchPokemons(),
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
