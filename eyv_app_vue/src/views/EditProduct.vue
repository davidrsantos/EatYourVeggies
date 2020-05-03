<template>
    <v-container fluid>
        <v-row no-gutters>
            <v-col class="col-8">
                <v-card class="mx-auto" max-width="700">


                    <v-container>

                        <form>

                            <v-text-field
                                    label="Batch"
                                    outlined
                                    readonly
                                    v-model=product.recordId

                            />

                            <v-text-field
                                    label="Name"
                                    outlined
                                    readonly
                                    :value="getPropertyValue(product,'name')"

                            />

                            <v-text-field
                                    label="Classification"
                                    outlined
                                    readonly
                                    :value="getPropertyValue(product,'classification')"

                            />

                            <v-text-field
                                    label="Origin"
                                    outlined
                                    readonly
                                    :value="getPropertyValue(product,'origin')"

                            />
                            <v-text-field
                                    label="Size"
                                    outlined
                                    readonly
                                    :value="getPropertyValue(product,'size')"

                            />
                            <v-text-field
                                    label="Weight"
                                    outlined
                                    readonly
                                    :value="getPropertyValue(product,'weight')"

                            />
                            <v-text-field
                                    label="Harvest Date"
                                    outlined
                                    readonly
                                    :value="getPropertyValue(product,'harvestDate')"

                            />
                            <v-text-field
                                    label="Expiration Date"
                                    outlined
                                    readonly
                                    :value="getPropertyValue(product,'expirationDate')"

                            />
                            <v-text-field
                                    label="Packing Date"
                                    outlined
                                    readonly
                                    :value="getPropertyValue(product,'packingDate')"

                            />

                        </form>

                    </v-container>

                </v-card>
            </v-col>
            <v-col class="col-4">
                <v-card>
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
                </v-card>
            </v-col>
        </v-row>
    </v-container>

</template>

<script>
    import {getPropertyValue} from "../utils/records";

    export default {
        data: () => ({
            recordId: '',
            product: {
                batch: '',
                name: '',
                classification: '',
                origin: '',
                size: '',
                weight: '',
                harvestDate: '',
                expirationDate: '',
                packingDate: ''
            },
            items: [
                {title: 'Create Proposal', icon: 'mdi-account-group-outline', link: '/dashboard'},
                {title: 'My Profile', icon: 'mdi-account', link: '/myProfile'},
                {title: 'Add Product', icon: 'mdi-account-group-outline', link: '/addProduct'},
                {title: 'My Products', icon: 'mdi-corn', link: '/managerProducts'},
            ],
        }),
        created: function () {
            if (this.$route.params.recordId != null) {
                this.recordId = this.$route.params.recordId;

            }
        },
        methods: {
            getPropertyValue(item, prop) {

                return getPropertyValue(item, prop)
            },

            getProduct() {
                axios.get(`/records/${this.recordId}`).then(response => {
                    this.product = response.data;

                    console.log(this.product);
                })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
        },
        beforeMount: function () {
            this.getProduct();
        },
    }

</script>

<style scoped>

</style>