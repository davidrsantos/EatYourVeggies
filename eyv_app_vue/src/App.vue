<template>
  <v-app id="inspire">
    <v-app-bar color="indigo" dark>
      <v-toolbar-title>Eat your Veggies</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer expand-on-hover floating>
      <drawer />
    </v-navigation-drawer>
    <v-content>
      <v-container class="fill-height" fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; Eat your vaggies - Instituto Politécnico de Leiria</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String
  },
  data: () => ({})
};
</script>

