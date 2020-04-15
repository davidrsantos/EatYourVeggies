<template>
  <div>
    
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-title>John Leider</v-list-item-title>


      </v-list-item>

      <v-divider></v-divider>

      <v-list
               rounded>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="item.link" 
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
  
  </div>
</template>

<script>
  export default {
    data () {
      return {
        drawer: true,
        items: [
          { title: 'Dashboard', icon: 'mdi-home-city' , link: '/dashboard'},
          { title: 'My Account', icon: 'mdi-account' },
          { title: 'Singup', icon: 'mdi-account-group-outline', link:'/singup'},
        ],
        mini: true,
      }
    },
  }
</script>