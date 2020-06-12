<template>
    <div>
        <!-- <v-data-table
                 :headers="headers"
                 :items="products"
                 :loading="loading"
                 class="elevation-1"
                 loading-text="Loading... Please wait"
                 sort-by="name"
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

                     <router-link :to="{name: 'addProduct'}" v-if="$store.state.user.role!=='customer'">
                         <button class="mb-2" color="green" id="myButton">Add Product</button>
                     </router-link>

                 </v-toolbar>
             </template>
         </v-data-table>-->
        <v-sheet class="px-3 pt-3 pb-3"
                 color="white"
                 v-if="loading"
        >
            <v-row fluid>
                <v-skeleton-loader
                        class="mx-auto my-12"
                        type="card"
                        width="374"
                ></v-skeleton-loader>

                <v-skeleton-loader
                        class="mx-auto my-12"
                        type="card"
                        width="374"
                ></v-skeleton-loader>
                <v-skeleton-loader
                        class="mx-auto my-12"
                        type="card"
                        width="374"
                ></v-skeleton-loader>
            </v-row>
            <v-row fluid>
                <v-skeleton-loader
                        class="mx-auto my-12"
                        type="card"
                        width="374"
                ></v-skeleton-loader>

                <v-skeleton-loader
                        class="mx-auto my-12"
                        type="card"
                        width="374"
                ></v-skeleton-loader>
                <v-skeleton-loader
                        class="mx-auto my-12"
                        type="card"
                        width="374"
                ></v-skeleton-loader>
            </v-row>
            <v-row fluid>
                <v-skeleton-loader
                        class="mx-auto my-12"
                        type="card"
                        width="374"
                ></v-skeleton-loader>

                <v-skeleton-loader
                        class="mx-auto my-12"
                        type="card"
                        width="374"
                ></v-skeleton-loader>
                <v-skeleton-loader
                        class="mx-auto my-12"
                        type="card"
                        width="374"
                ></v-skeleton-loader>
            </v-row>
        </v-sheet>

        <v-data-iterator :items="products"
                         :items-per-page.sync="itemsPerPage"
                         :loading="loading"
                         :page="page"
                         hide-default-footer
                         loading-text="Loading... Please wait"
                         v-else
        >
            <template v-slot:header>
                <v-toolbar color="white" flat>
                    <v-toolbar-title>My Products</v-toolbar-title>
                    <v-divider
                            class="mx-4"
                            inset
                            vertical
                    ></v-divider>
                    <v-spacer></v-spacer>

                    <router-link :to="{name: 'addProduct'}" v-if="$store.state.user.role!=='customer'">
                        <button class="mb-2" color="green" id="myButton">Add Product</button>
                    </router-link>

                </v-toolbar>
            </template>


            <template v-slot:default="props">
                <v-row>
                    <v-col
                            :key="item.name"
                            cols="12"
                            lg="3"
                            md="4"
                            sm="6"
                            v-for="item in props.items"
                    >
                        <v-card :loading="loading"
                                :to="'/editProduct/'+item.recordId" class="mx-auto my-12" max-width="374">

                            <v-card-title class="subheading font-weight-bold">{{ item.name }}</v-card-title>
                            <v-img
                                    height="250"
                                    src="icon.png"
                            ></v-img>

                            <v-card-text>Batch : {{ item.recordId }}</v-card-text>
                            <v-divider></v-divider>


                        </v-card>
                    </v-col>
                </v-row>
            </template>
            <template v-slot:footer>
                <v-row align="center" class="mt-2" justify="center">
                    <span class="grey--text">Items per page</span>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                    class="ml-2"
                                    color="primary"
                                    dark
                                    text
                                    v-bind="attrs"
                                    v-on="on"
                            >
                                {{ itemsPerPage }}
                                <v-icon>mdi-chevron-down</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item
                                    :key="index"
                                    @click="updateItemsPerPage(number)"
                                    v-for="(number, index) in itemsPerPageArray"
                            >
                                <v-list-item-title>{{ number }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>

                    <v-spacer></v-spacer>

                    <span
                            class="mr-4
            grey--text"
                    >
            Page {{ page }} of {{ numberOfPages }}
          </span>
                    <v-btn
                            @click="formerPage"
                            class="mr-1"
                            color="blue darken-3"
                            dark
                            fab
                    >
                        <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn
                            @click="nextPage"
                            class="ml-1"
                            color="blue darken-3"
                            dark
                            fab
                    >
                        <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                </v-row>
            </template>
        </v-data-iterator>
    </div>
</template>

<script>
  import { getPropertyValue } from '../utils/records'

  export default {
    name: 'ManagerProducts',
    data: () => ({
      itemsPerPageArray: [4, 8, 12],
      page: 1,
      itemsPerPage: 4,
      loading: true,
      headers: [
        { text: 'Batch', value: 'recordId' },
        { text: 'Name', value: 'name' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      products: []
    }),
    computed: {
      numberOfPages () {
        return Math.ceil(this.products.length / this.itemsPerPage)
      },
    },
    methods: {
      nextPage () {
        if (this.page + 1 <= this.numberOfPages) this.page += 1
      },
      formerPage () {
        if (this.page - 1 >= 1) this.page -= 1
      },
      updateItemsPerPage (number) {
        this.itemsPerPage = number
      },

      getPropertyValue (item, prop) {
        return getPropertyValue(item, prop)
      },
      getProducts () {
        this.loading = true
        if (this.$store.state.user.role == 'admin') {
          axios.get('/records').then(response => {
            this.products = response.data
            this.loading = false
            console.log(this.products)
          }).catch(error => {
              this.$emit('errorEvent', error.response.data.error)
              this.loading = false
            }
          )
        } else {
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