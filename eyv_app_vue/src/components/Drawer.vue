<template>
  <v-list dense nav class="py-0">
    <v-list-item class="px-0">
      <v-list-item-avatar>
        <img src="https://randomuser.me/api/portraits/men/81.jpg" />
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>Application</v-list-item-title>
        <v-list-item-subtitle>Subtext</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    
    <v-divider></v-divider>

    <v-list-item v-for="item in items" :key="item.title" link :to="item.link">
      <
      <v-list-item-icon>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { title: "Dashboard", icon: "mdi-view-dashboard", link: "/" },
        { title: "Photos", icon: "mdi-image" },
        { title: "About", icon: "mdi-help-box", link: "/about" }
      ],
      color: "primary",
      colors: ["primary", "blue", "success", "red", "teal"]
    };
  }
};
</script>