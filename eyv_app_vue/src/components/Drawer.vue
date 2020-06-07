<template>
    <div>

        <v-list-item class="px-2" v-if="this.$store.state.user!=null">
            <v-list-item-avatar>

            </v-list-item-avatar>

            <v-list-item-title>{{this.$store.state.user.name}}</v-list-item-title>


        </v-list-item>

        <v-divider></v-divider>

        <v-list
                rounded>
            <v-list-item
                    :key="item.title"
                    :to="item.link"
                    class="px-2"
                    link
                    v-for="item in items"
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
        items: [],
        itemsForAll: [
          { title: 'Dashboard', icon: 'mdi-home-city', link: '/dashboard' },
          { title: 'My Profile', icon: 'mdi-account', link: '/myProfile' },
          { title: 'My Products', icon: 'mdi-corn', link: '/managerProducts' },
        ],
        itemsForProducerRetailer: [
          { title: 'Dashboard', icon: 'mdi-home-city', link: '/dashboard' },
          { title: 'My Profile', icon: 'mdi-account', link: '/myProfile' },
          { title: 'My Products', icon: 'mdi-corn', link: '/managerProducts' },
          { title: 'Add Product', icon: 'mdi-account-group-outline', link: '/addProduct' }
        ],

        mini: true,
      }
    },
    created: function () {
      if (this.$store.state.user) {
        if (this.$store.state.user.role === 'producer' || this.$store.state.user.role === 'retailer') {
          this.items = this.itemsForProducerRetailer
        } else {
          this.items = this.itemsForAll
        }
      }
    }
  }
</script>

