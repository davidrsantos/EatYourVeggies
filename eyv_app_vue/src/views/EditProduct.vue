<template>
    <v-container>
        <v-card class="mx-auto" max-width="800">
            <v-container>
                <form >
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
                            :value= "getPropertyValue(product,'name')"

                    />

                    <v-text-field
                            label="Classification"
                            outlined
                            readonly
                            :value= "getPropertyValue(product,'classification')"

                    />

                    <v-text-field
                            label="Origin"
                            outlined
                            readonly
                            :value= "getPropertyValue(product,'origin')"

                    />

                </form>
            </v-container>
        </v-card>
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
            }
        }),
        created: function () {
            if (this.$route.params.recordId != null) {
                this.recordId = this.$route.params.recordId;

            }
        },
        methods: {
            getPropertyValue(item, prop){

                return getPropertyValue(item,prop)
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
        mounted: function() {
            this.getProduct();
        },
        computed: {

            },

    }

</script>

<style scoped>

</style>