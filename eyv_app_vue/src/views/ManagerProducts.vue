<template>
    <v-data-table
            :headers="headers"
            :items="products"
            class="elevation-1"
            sort-by="name"
            :loading="loading"
            loading-text="Loading... Please wait"
    >
        <template v-slot:item.actions="{ item }">
                    <v-btn :to="'/editProduct/'+item.recordId" class="mr-2" small>
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
        </template>
        <template v-slot:top>
            <v-toolbar color="white" flat>
                <v-toolbar-title>My Products</v-toolbar-title>
                <v-divider
                        class="mx-4"
                        inset
                        vertical
                ></v-divider>
                <v-spacer></v-spacer>

                <router-link :to="{name: 'addProduct'}" v-if="$store.state.user.role!=='customer' && $store.state.user.role !== 'viewer'">
                    <button class="mb-2" color="green" id="myButton">Add Product</button>
                </router-link>

            </v-toolbar>
        </template>
    </v-data-table>
</template>

<script>
  import { getPropertyValue } from '../utils/records'

  export default {
    name:'ManagerProducts',
    data: () => ({
      loading:true,
      headers: [
        { text: 'Batch', value: 'recordId' },
        { text: 'Name', value: 'name' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      products: []
    }),
    methods: {
      getPropertyValue (item, prop) {
        return getPropertyValue(item, prop)
      },
      getProducts () {
        this.loading = true
        if (this.$store.state.user.role == 'admin' || this.$store.state.user.role == 'viewer') {
          axios.get('/records').then(response => {
            this.products = response.data
            this.loading = false
            console.log(this.products)
          }).catch(error => {
              this.$emit('errorEvent', error.response.data.error)
              this.loading = false
            }
          )
        }else {
          axios.get('/records?owner=' + this.$store.state.user.publicKey).then(response => {
            this.products = response.data
            this.loading = false
            console.log(this.products)
          }).catch(error => {
            this.$emit('errorEvent', error.response.data.error)
            this.loading = false
          })
        }
      },

    },
    mounted: function () {
      this.getProducts()
    }
  }
</script>