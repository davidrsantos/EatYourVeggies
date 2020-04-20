<template>
    <v-card class="mx-auto" max-width="800">
        <v-container>
            <form>
                <v-text-field
                        :counter="10"
                        :error-messages="serialNumberErrors"
                        @blur="$v.serialNumber.$touch()"
                        @input="$v.serialNumber.$touch()"
                        label="Name"
                        required
                        v-model="serialNumber"
                />


                <v-btn @click="submit" class="mr-4">submit</v-btn>
                <v-btn @click="clear">clear</v-btn>
            </form>
        </v-container>
    </v-card>
</template>
<script>
    import {validationMixin} from "vuelidate";
    import {
        required,
        maxLength,
        minLength,
        sameAs,
        email
    } from "vuelidate/lib/validators";
    import * as transactions from "../services/transactions";
    import * as api from "../services/api";
    import * as payloads from "../services/payloads";
    import * as parsing from "../services/parsing";


    export default {
        mixins: [validationMixin],

        validations: {
            serialNumber: {required, maxLength: maxLength(50)},

        },

        data: () => ({
            serialNumber: '1fs23',
            species: 'SDF',
            lengthInCM: 23,
            weightInKg: 23,
            latitude: 10,
            longitude: 20,

        }),

        computed: {


            serialNumberErrors() {
                const errors = [];
                if (!this.$v.serialNumber.$dirty) return errors;
                !this.$v.serialNumber.maxLength &&
                errors.push("Name must be at most 50 characters long"); //TODO alterar mensagem de erro
                !this.$v.serialNumber.required && errors.push("Name is required.");
                return errors;
            },

        },

        methods: {
            addProduct() {
                let recordPayload = payloads.createRecord({
                    recordId: this.serialNumber,
                    recordType: 'fish',
                    properties: [
                        {
                            name: 'species',
                            stringValue: this.species,
                            dataType: payloads.createRecord.enum.STRING
                        },
                        {
                            name: 'length',
                            numberValue: parsing.toInt(this.lengthInCM),
                            dataType: payloads.createRecord.enum.NUMBER
                        },
                        {
                            name: 'weight',
                            numberValue: parsing.toInt(this.weightInKg),
                            dataType: payloads.createRecord.enum.NUMBER
                        },
                        {
                            name: 'location',
                            locationValue: {
                                latitude: parsing.toInt(this.latitude),
                                longitude: parsing.toInt(this.longitude)
                            },
                            dataType: payloads.createRecord.enum.LOCATION
                        }
                    ]
                })


             /*   const reporterPayloads = state.reporters
                    .filter((reporter) => !!reporter.reporterKey)
                    .map((reporter) => payloads.createProposal({
                        recordId: state.serialNumber,
                        receivingAgent: reporter.reporterKey,
                        role: payloads.createProposal.enum.REPORTER,
                        properties: reporter.properties
                    })) *///Necessário se quisermos atribuir já reporters!

                /* transactions.submit([recordPayload].concat(reporterPayloads), true) //todo versão em que manda reporters não está a ser usado porque no formlulário ainda não dá para adici0ona reporters
                     .then(() => m.route.set(`/fish/${state.serialNumber}`))
 */
                transactions.submit([recordPayload], true) //versão sem reporters!!!!!
                  //  .then(() => m.route.set(`/fish/${this.serialNumber}`))

            },

            submit() {
                this.addProduct();
            },
            clear() {
                this.$v.$reset();
                this.serialNumber = null;
                this.email = null;
                this.username = null;
                this.password = null;
                this.repeatPassword = null;
            }
        }
    };
</script>





