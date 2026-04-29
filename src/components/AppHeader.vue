<template>
  <v-app-bar flat>
    <v-container class="d-flex align-center">
      <v-toolbar-title>Pokédex</v-toolbar-title>

      <v-btn
        v-for="link in menuItems"
        :key="link.title"
        :icon="link.icon"
        :to="link.path"
      />
    </v-container>
  </v-app-bar>
</template>

<script setup>
const menuItems = [
  { title: 'Accueil', path: '/', icon: 'mdi-pokeball' },
  { title: 'Favoris', path: '/favoris', icon: 'mdi-heart' },
  { title: 'À propos', path: '/a-propos', icon: 'mdi-information' },
]
</script>
