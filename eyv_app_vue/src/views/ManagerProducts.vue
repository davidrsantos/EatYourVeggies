<template>
    <v-data-table
            :headers="headers"
            :items="products"
            sort-by="name"
            class="elevation-1"
    >
        <template  v-slot:body="{ items }">
            <tbody>
            <tr v-for="item in items" :key="item.recordId">
                <td>{{ item.recordId }}</td>
                <td>{{ getPropertyValue(item, 'name') }}</td>
                <td>{{ getPropertyValue(item, 'classification') }}</td>
                <td>{{ getPropertyValue(item, 'origin') }}</td>
                <td> <v-btn

                            small
                            class="mr-2"
                            :to="'/editProduct/'+item.recordId"
                    ><v-icon>
                        mdi-pencil
                </v-icon>
                    </v-btn></td>
            </tr>
            </tbody>
        </template>
        <template v-slot:top>
            <v-toolbar flat color="white">
                <v-toolbar-title>My Products</v-toolbar-title>
                <v-divider
                        class="mx-4"
                        inset
                        vertical
                ></v-divider>
                <v-spacer></v-spacer>

                <router-link :to="{name: 'addProduct'}" v-if="$store.state.user.role!=='customer'" >
                    <button color="green" id="myButton" class="mb-2">Add Product</button>
                </router-link>

            </v-toolbar>
        </template>
    </v-data-table>
</template>

<script>
    import {getPropertyValue} from "../utils/records";

    export default {
        data: () => ({
            headers: [
                { text: 'Batch', value: 'recordId' },
                { text: 'Name', value: 'name' },
                { text: 'Classification', value: 'classification' },
                { text: 'Origin', value: 'origin' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            products: []
        }),
        methods: {
            getPropertyValue(item, prop){

                return getPropertyValue(item,prop)
    },
            getProducts() {
              if(this.$store.state.user.role == "admin"){
                axios.get('/records').then(response => {
                  this.products = response.data;
                  console.log(this.products);
                }).catch(error=>{this.$emit('errorEvent', error.response.data.error)})
              }
                axios.get('/records?owner='+ this.$store.state.user.publicKey).then(response => {
                    this.products = response.data;
                    console.log(this.products);
                }).catch(error=>{this.$emit('errorEvent', error.response.data.error)})
            },

        },
        mounted: function() {
            this.getProducts();
        }
    }
</script>