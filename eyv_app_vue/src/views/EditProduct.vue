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

                <v-card>
                <form>
                    <v-toolbar color="indigo" dark>
                        <v-toolbar-title>Localization</v-toolbar-title>
                    </v-toolbar>
                    <v-text-field
                            @click:append="openDialog(product.latitude,'latitude','Latitude')"
                            append-icon="mdi-pencil"
                            label="Latitude"
                            outlined
                            readonly
                            v-model="product.latitude"
                    />

                    <v-text-field
                            @click:append="openDialog(product.longitude,'longitude','Longitude')"
                            append-icon="mdi-pencil"
                            label="Longitude"
                            outlined
                            readonly
                            v-model="product.longitude"

                    />
                    <v-text-field
                            @click:append="openDialog(product.temperature,'temperature','Temperature ºC')"
                            append-icon="mdi-pencil"
                            label="Temperature ºC"
                            outlined
                            readonly
                            v-model="product.temperature"

                    />

                    <v-text-field
                            @click:append="openDialog(product.humidade,'humidade','Humidity kg/m³')"
                            append-icon="mdi-pencil"
                            label="Humidity kg/m³"
                            outlined
                            readonly

                            v-model="product.humidade"
                    />

                    <v-text-field
                            @click:append="openDialog(product.co2,'co2','CO2')"
                            append-icon="mdi-pencil"
                            label="CO2"
                            outlined
                            readonly
                            v-model="product.co2"

                    />

                    <v-toolbar color="indigo" dark>
                        <v-toolbar-title>Shock</v-toolbar-title>
                    </v-toolbar>
                    <v-text-field
                            @click:append="openDialog(product.shockAcceleration,'shockAcceleration','Acceleration')"
                            append-icon="mdi-pencil"
                            label="Acceleration"
                            outlined
                            readonly

                            v-model="product.shockAcceleration"

                    />

                    <v-text-field
                            @click:append="openDialog(product.shockDuration,'shockDuration','Duration')"
                            append-icon="mdi-pencil"
                            label="Duration"
                            outlined
                            readonly

                            v-model="product.shockDuration"

                    />
                    <v-toolbar color="indigo" dark>
                        <v-toolbar-title>Tilt</v-toolbar-title>
                    </v-toolbar>
                    <v-text-field
                            @click:append="openDialog(product.tiltX,'tiltX','X')"
                            append-icon="mdi-pencil"
                            label="X"
                            outlined
                            readonly

                            v-model="product.tiltX"

                    />
                    <v-text-field
                            @click:append="openDialog(product.tiltY,'tiltY','Y')"
                            append-icon="mdi-pencil"
                            label="Y"
                            outlined
                            readonly

                            v-model="product.tiltY"

                    />

                </form>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="showDialogTransfer" max-width="600">
            <v-card fluid>
                <v-select
                        :items="agents"
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

        <v-dialog
                max-width="600"
                v-model="dialogProperties"
        >
            <v-card>
                <v-container>
                    <v-card-title class="headline">Insert {{dialogLabel}}?</v-card-title>

                    <v-text-field
                                  class="ml-4 mr-4"
                                  v-model="valueUpdate"

                    />
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                                @click="cancelInsert"
                                color="grey darken-1"
                        >
                            Cancel
                        </v-btn>
                        <v-btn @click="submitPropertie" class="ml-4" color="green darken-1">Insert</v-btn>

                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>

    </v-container>

</template>

<script>
    import {getPropertyValue} from "../utils/records";
    import * as api from '../services/api'
    import * as parsing from '../services/parsing'
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
                latitude: '',
                longitude: '',
                temperature: '',
                humidade: '',
                co2: '',
               acceleration:'',//shock
               duration:'',//shock
               tiltX: '',
               tiltY:'',
                },
          productValueUpdate: {
            latitude: '',
            longitude: '',
            temperature: '',
            humidade: '',
            co2: '',
            acceleration:'',//shock
            duration:'',//shock
            tiltX: '',
            tiltY:'',
          },
            agents: [],
            users:[],
            role:'owner',
            publicKey: '',
            dialogLabel: '',
            dialogProperties: '',
            valueUpdate: null,
          key: ''
        }),
        created: function () {
            if (this.$route.params.recordId != null) {
                this.recordId = this.$route.params.recordId;

            }
        },
        methods: {
          getAgents() {
              axios.get('/agents').then(response => {
                this.agents = response.data;

                console.log(this.agents);
              })
                .catch(function (error) {
                  console.log(error);
                });
            },
          getUsers() {
            axios.get('/users').then(response => {
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
          updateProperty(record, value){
            let updatePayload = payloads.updateProperties({
              recordId: record,
              properties: [value]
            })
            return transactions.submit([updatePayload], true).then(() => {
              console.log('Successfully submitted property update')
            })
          },
          cancel() {
            this.showDialogTransfer = false;
          },
          cancelInsert() {
            this.dialogProperties = false;
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

          reportShock(){//@luana todo - falta testar esse método e criar para as outras propriedades
               this.updateProperty(this.recordId, {
                        name: 'shock',
                        stringValue: JSON.stringify({
                          accel: parsing.toInt(this.productValueUpdate.acceleration),
                          duration: parsing.toInt(this.productValueUpdate.duration)
                        }),
                        dataType: payloads.updateProperties.enum.STRING
                      })
                        .then(() => {
                          this.productValueUpdate.acceleration = null
                          this.productValueUpdate.duration = null
                        })
                    },

          reportTemperature(){
            //@luana todo - falta testar esse método e criar para as outras propriedades
            this.updateProperty(this.recordId, {
              name: 'temperature',
              numberValue: parsing.toInt(this.productValueUpdate.temperature),//todo ver se vai ser preciso colocar a key e fazer um método só para todas as props.
              dataType: payloads.updateProperties.enum.NUMBER
            })
          },
          openDialog(model, key, label) {
            this.dialogProperties = true;
            this.key = key;
            this.dialogLabel = label;
            this.valueUpdate = model;
          },
          roleToEnum(role){//todo perguntar as proffs se querem manter o custodiam e o reporter
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
          submitPropertie() {
            _.set(this.productValueUpdate, this.key, this.valueUpdate)
            this.reportTemperature();
            this.key = '';
            this.dialogProperties = false;
          },

        },
        beforeMount: function () {
            this.getProduct();
            this.getAgents();
            this.getUsers();
        },
    }

</script>

<style scoped>

</style>