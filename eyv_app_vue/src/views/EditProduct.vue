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
                                class="px-2"
                        >
                            <v-list-item-icon>
                                <v-icon></v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>
                                    <v-btn @click="showDialogTransfer=true">Transfer Ownership</v-btn>
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="showDialogTransfer" max-width="600">
            <v-card fluid>
                <v-select
                        :items="users"
                        item-text="name"
                        label="Select User"
                        item-value="key"
                        v-model="publicKey"
                        outlined
                ></v-select>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            @click="cancel"
                            color="grey darken-1"
                    >
                        Cancel
                    </v-btn>
                    <v-btn @click="submit" color="green darken-1" class="mr-4 ml-4">Submit</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>

</template>

<script>
    import {getPropertyValue} from "../utils/records";
    const payloads = require('../services/payloads');
    const transactions = require('../services/transactions');

    export default {
        data: () => ({
          showDialogTransfer: false,
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
                packingDate: '',
            },
            users: [],
            role:'owner',
            publicKey: ''
        }),
        created: function () {
            if (this.$route.params.recordId != null) {
                this.recordId = this.$route.params.recordId;

            }
        },
        methods: {
          getUsers() {
            //todo @luana falta validar o tipo dos users, tem de ser apenas abaixo do tipo do user atual
              axios.get('/agents').then(response => {
                this.users = response.data;

                console.log(this.users);
              })
                .catch(function (error) {
                  console.log(error);
                });
            },
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
          cancel() {
            this.showDialogTransfer = false;
          },
          submitProposal(recordId, role, publicKey){


            let transferPayload = payloads.createProposal({
                recordId: recordId,
                receivingAgent: publicKey,
                role: this.roleToEnum(role)
              })
            console.log(publicKey);
            return transactions.submit([transferPayload], true).then(() => {
              console.log('Successfully submitted proposal')
            })
          },
          roleToEnum(role){
            if(role='owner'){
              return payloads.createProposal.enum.OWNER;
            }else if(role='custodian'){
              return payloads.createProposal.enum.CUSTODIAN;
            }else if(role='reporter'){
              return payloads.createProposal.enum.REPORTER;
            }
          },
          submit() {
            this.submitProposal(this.recordId, this.role,this.publicKey);
            this.showDialogTransfer=false;
          },
        },
        beforeMount: function () {
            this.getProduct();
            this.getUsers();
        },
    }

</script>

<style scoped>

</style>