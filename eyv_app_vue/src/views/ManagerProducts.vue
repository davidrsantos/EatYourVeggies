<template>
    <v-container>
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
        </v-sheet>


        <v-data-iterator :items="products"
                         :items-per-page.sync="itemsPerPage"
                         :loading="loading"
                         :page="page"
                         :search="search"
                         hide-default-footer
                         item-key="recordId"
                         loading-text="Loading... Please wait"
                         sort-by="recordId"
                         v-else
        >
            <template v-slot:header>
                <v-toolbar v-if="$store.state.viewer">
                    <v-toolbar-title>Avalible Products</v-toolbar-title>
                </v-toolbar>
                <v-toolbar v-else>
                    <v-toolbar-title v-if="$store.state.user && $store.state.user.role==='admin'">All Products
                    </v-toolbar-title>
                    <v-toolbar-title v-else>My Products</v-toolbar-title>
                    <v-divider
                            class="mx-4"
                            inset
                            vertical
                    ></v-divider>
                    <v-text-field
                            clearable
                            flat
                            hide-details
                            label="Search"
                            prepend-inner-icon="mdi-magnify"
                            single-line
                            solo-inverted
                            v-model="search"
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-divider
                            class="mx-4"
                            inset
                            vertical
                    ></v-divider>

                    <v-btn :to="{name: 'addProduct'}"
                           color="green" dark id="myButton"
                           v-if="$store.state.user && $store.state.user.role!=='customer' && !$store.state.viewer"
                    >Add Product
                    </v-btn>


                </v-toolbar>

            </template>


            <template v-slot:default="props">

                <v-container fluid>
                    <v-row align="center" justify="center">
                        <v-col
                                :key="item.recordId"
                                cols="auto"
                                lg="3"
                                md="4"
                                sm="6"
                                v-for="item in props.items"


                        >
                            <v-card :loading="loading"
                                    :to="'/products/'+item.recordId"

                                    color="light-green  lighten-5"
                                    >

                                <v-card-title class="subheading font-weight-bold">{{ item.name }}</v-card-title>
                                <v-divider></v-divider>
                                <v-img
eager
                                        :src="'http://localhost:8021/image/' + item.recordId "
                                        max-height="150"

                                >
                                    <template v-slot:placeholder>
                                        <v-row
                                                class="fill-height ma-0"
                                                align="center"
                                                justify="center"
                                        >
                                            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                        </v-row>
                                    </template>

                                    <v-row align="end" class="lightbox white--text pa-2 fill-height" justify="end">
                                        <v-chip class="ma-2" color="red" large
                                                text-color="white"
                                                v-if="item.final"> Finalized
                                        </v-chip>
                                    </v-row>
                                </v-img>
                                <v-divider></v-divider>
                                <v-card-text>Batch : {{ item.recordId }}</v-card-text>


                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>


            </template>
            <template v-slot:footer>
                <v-row align="center" class="mt-8" justify="center">
                    <span class="grey--text">Items per page</span>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                    class="ml-2"
                                    color="green"
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
                            color="green"
                            dark
                            fab
                    >
                        <v-icon large>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn
                            @click="nextPage"
                            class="ml-1"
                            color="green"
                            dark
                            fab
                    >
                        <v-icon large>mdi-chevron-right</v-icon>
                    </v-btn>
                </v-row>
            </template>
        </v-data-iterator>
    </v-container>
</template>

<script>
  import { getPropertyValue } from '../utils/records'

  export default {
    name: 'ManagerProducts',
    data: () => ({
      search: '',
      itemsPerPageArray: [4, 8, 12, 24, 48, 96],
      page: 1,
      itemsPerPage: 8,
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
        if (this.$store.state.viewer) {
          axios.get('/records?final=false').then(response => {
            this.products = response.data
            this.loading = false
            console.log(this.products)
          }).catch(error => {
              this.$emit('errorEvent', error.response.data.error)
              this.loading = false
            }
          )
        } else if (this.$store.state.user.role === 'admin') {
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