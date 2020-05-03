<template>
    <v-card class="mx-auto" max-width="800">
        <v-toolbar color="indigo" dark extended flat>
            <v-toolbar-title>Register Product</v-toolbar-title>
        </v-toolbar>
        <v-container>
            <form>
                <v-text-field
                        :counter="10"
                        :error-messages="batchErrors"
                        @blur="$v.batch.$touch()"
                        @input="$v.batch.$touch()"
                        label="Batch"
                        required
                        v-model="batch"
                />
                <v-text-field
                        :counter="10"
                        :error-messages="nameErrors"
                        @blur="$v.name.$touch()"
                        @input="$v.name.$touch()"
                        label="Name"
                        required
                        v-model="name"
                />
                <v-text-field
                        :counter="10"
                        :error-messages="classificationErrors"
                        @blur="$v.classification.$touch()"
                        @input="$v.classification.$touch()"
                        label="Classification"
                        required
                        v-model="classification"
                />
                <v-text-field
                        :counter="10"
                        :error-messages="originErrors"
                        @blur="$v.origin.$touch()"
                        @input="$v.origin.$touch()"
                        label="Origin"
                        required
                        v-model="origin"
                />
                <v-text-field
                        :counter="10"
                        :error-messages="sizeErrors"
                        @blur="$v.size.$touch()"
                        @input="$v.size.$touch()"
                        label="Size"
                        required
                        v-model="size"
                />
                <v-text-field
                        :counter="10"
                        :error-messages="weightErrors"
                        @blur="$v.weight.$touch()"
                        @input="$v.weight.$touch()"
                        label="Weight"
                        required
                        v-model="weight"
                />

                <v-menu
                        :close-on-content-click="false"
                        :nudge-right="40"
                        min-width="290px"
                        offset-y
                        transition="scale-transition"
                        v-model="menuHarvestDate"
                >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                                :error-messages="harvestDateErrors"
                                @blur="$v.harvestDate.$touch()"
                                @input="$v.harvestDate.$touch()"
                                label="Harvest Date"
                                readonly
                                required
                                v-model="harvestDate"
                                v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker @input="menuHarvestDate= false" v-model="harvestDate"></v-date-picker>
                </v-menu>
                <v-toolbar color="indigo" dark>
                    <v-toolbar-title>Add Properties</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-row align="center">
                        <v-checkbox
                                class="shrink mr-2 mt-0"
                                hide-details
                                v-model="expirationDateCheck"
                        ></v-checkbox>
                        <v-menu
                                :close-on-content-click="false"
                                :nudge-right="40"
                                min-width="290px"
                                offset-y
                                transition="scale-transition"
                                v-model="menuExpirationDate"
                        >
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                        :counter="10"
                                        :disabled="!expirationDateCheck"
                                        :error-messages="expirationDateErrors"
                                        @blur="$v.expirationDate.$touch()"
                                        @input="$v.expirationDate.$touch()"
                                        label="Expiration Date"
                                        readonly
                                        v-model="expirationDate"
                                        v-on="on"
                                ></v-text-field>
                            </template>
                            <v-date-picker @input="menuExpirationDate = false" v-model="expirationDate"></v-date-picker>
                        </v-menu>
                    </v-row>
                    <v-row align="center">
                        <v-checkbox
                                class="shrink mr-2 mt-0"
                                hide-details
                                v-model="packingDateCheck"
                        ></v-checkbox>
                        <v-menu
                                :close-on-content-click="false"
                                :nudge-right="40"
                                min-width="290px"
                                offset-y
                                transition="scale-transition"
                                v-model="menuPackingDate"
                        >
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                        :counter="10"
                                        :disabled="!packingDateCheck"
                                        :error-messages="packingDateErrors"
                                        @blur="$v.packingDate.$touch()"
                                        @input="$v.packingDate.$touch()"
                                        label="Packing Date"
                                        readonly
                                        v-model="packingDate"
                                        v-on="on"
                                ></v-text-field>
                            </template>
                            <v-date-picker @input="menuPackingDate = false" v-model="packingDate"></v-date-picker>
                        </v-menu>
                    </v-row>
                </v-card-text>
                <v-toolbar color="indigo" dark>
                    <v-toolbar-title>Localization</v-toolbar-title>
                </v-toolbar>
                <v-text-field
                        :counter="10"
                        :error-messages="latitudeErrors"
                        @blur="$v.latitude.$touch()"
                        @input="$v.latitude.$touch()"
                        label="Latitude"
                        required
                        v-model="latitude"
                />
                <v-text-field
                        :counter="10"
                        :error-messages="longitudeErrors"
                        @blur="$v.longitude.$touch()"
                        @input="$v.longitude.$touch()"
                        label="Longitude"
                        required
                        v-model="longitude"
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
        email,
    } from "vuelidate/lib/validators";
    import * as transactions from "../services/transactions";
    import * as api from "../services/api";
    import * as payloads from "../services/payloads";
    import * as parsing from "../services/parsing";

    export default {
        mixins: [validationMixin],

        validations: {
            batch: {required, maxLength: maxLength(50), minLength: minLength(1)},
            name: {required, maxLength: maxLength(50), minLength: minLength(2)},
            classification: {
                required,
                maxLength: maxLength(50),
                minLength: minLength(2),
            },
            origin: {required, maxLength: maxLength(50), minLength: minLength(2)},
            weight: {required, maxLength: maxLength(10), minLength: minLength(1)},
            size: {required, maxLength: maxLength(10), minLength: minLength(1)},
            harvestDate: {
                required,
                maxLength: maxLength(11),
                minLength: minLength(1),
            },
            expirationDate: {
                maxLength: maxLength(11),
            },
            packingDate: {
                maxLength: maxLength(11),
            },
            latitude: {required, maxLength: maxLength(20), minLength: minLength(1)},
            longitude: {required, maxLength: maxLength(20), minLength: minLength(1)},
        },

        data: () => ({
            batch: "1fs23",
            name: "tomate",
            classification: "legume",
            origin: "biológica",
            weight: 23,
            size: 26,
            harvestDate: new Date().toISOString().substr(0, 10),
            latitude: 10,
            longitude: 20,
            expirationDate: new Date().toISOString().substr(0, 10),
            packingDate: new Date().toISOString().substr(0, 10),
            expirationDateCheck: false,
            packingDateCheck: false,
            menu: false,
            menuHarvestDate: false,
            menuExpirationDate: false,
            menuPackingDate: false
        }),

        computed: {
            batchErrors() {
                const errors = [];
                if (!this.$v.batch.$dirty) return errors;
                !this.$v.batch.maxLength &&
                errors.push("The batch must be 1 to 50 characters long");
                !this.$v.batch.required && errors.push("Batch is required.");
                return errors;
            },
            nameErrors() {
                const errors = [];
                if (!this.$v.name.$dirty) return errors;
                !this.$v.name.maxLength &&
                errors.push("The name must be 1 to 50 characters long");
                !this.$v.name.required && errors.push("Batch is required.");
                return errors;
            },
            classificationErrors() {
                const errors = [];
                if (!this.$v.classification.$dirty) return errors;
                !this.$v.classification.maxLength &&
                errors.push("The classification must be 1 to 50 characters long");
                !this.$v.classification.required && errors.push("Batch is required.");
                return errors;
            },
            originErrors() {
                const errors = [];
                if (!this.$v.origin.$dirty) return errors;
                !this.$v.origin.maxLength &&
                errors.push("The origin must be 1 to 50 characters long");
                !this.$v.origin.required && errors.push("Origin is required.");
                return errors;
            },
            weightErrors() {
                const errors = [];
                if (!this.$v.weight.$dirty) return errors;
                !this.$v.weight.maxLength &&
                errors.push("The weigth must be 1 to 10 characters long");
                !this.$v.weight.required && errors.push("Weight is required.");
                return errors;
            },
            sizeErrors() {
                const errors = [];
                if (!this.$v.size.$dirty) return errors;
                !this.$v.size.maxLength &&
                errors.push("The size must be 1 to 10 characters long");
                !this.$v.size.required && errors.push("Size is required.");
                return errors;
            },
            harvestDateErrors() {
                const errors = [];
                if (!this.$v.harvestDate.$dirty) return errors;
                !this.$v.harvestDate.maxLength &&
                errors.push("The harvest data must be 1 to 11 characters long");
                !this.$v.harvestDate.required && errors.push("Harvest Date is required.");
                return errors;
            },
            latitudeErrors() {
                const errors = [];
                if (!this.$v.latitude.$dirty) return errors;
                !this.$v.latitude.maxLength &&
                errors.push("The latitude must be 1 to 20 characters long");
                !this.$v.latitude.required && errors.push("Latitude is required.");
                return errors;
            },
            longitudeErrors() {
                const errors = [];
                if (!this.$v.longitude.$dirty) return errors;
                !this.$v.longitude.maxLength &&
                errors.push("The longitude must be 1 to 20 characters long");
                !this.$v.longitude.required && errors.push("Longitude is required.");
                return errors;
            },
            expirationDateErrors() {
                const errors = [];
                if (!this.$v.expirationDate.$dirty) return errors;
                !this.$v.expirationDate.maxLength &&
                errors.push("The Expiration Date must be 1 to 11 characters long");
                return errors;
            },
            packingDateErrors() {
                const errors = [];
                if (!this.$v.packingDate.$dirty) return errors;
                !this.$v.packingDate.maxLength &&
                errors.push("The Packing Date must be 1 to 11 characters long");
                return errors;
            },
        },

        methods: {
            addProduct() {
                let recordPayload = payloads.createRecord({
                    recordId: this.batch,
                    recordType: "vegetable",
                    properties: [
                        {
                            name: "name",
                            stringValue: this.name,
                            dataType: payloads.createRecord.enum.STRING,
                        },
                        {
                            name: "classification",
                            stringValue: this.classification,
                            dataType: payloads.createRecord.enum.STRING,
                        },
                        {
                            name: "origin",
                            stringValue: this.origin,
                            dataType: payloads.createRecord.enum.STRING,
                        },
                        {
                            name: "weight",
                            numberValue: parsing.toInt(this.weightInKg),
                            dataType: payloads.createRecord.enum.NUMBER,
                        },
                        {
                            name: "size",
                            numberValue: parsing.toInt(this.size),
                            dataType: payloads.createRecord.enum.NUMBER,
                        },
                        {
                            name: "harvestDate",
                            timestampValue: this.harvestDate,
                            dataType: payloads.createRecord.enum.TIMESTAMP,
                        },
                        {
                            name: "expirationDate",
                            timestampValue: this.expirationDate,
                            dataType: payloads.createRecord.enum.TIMESTAMP,
                        },
                        {
                            name: "packingDate",
                            timestampValue: this.packingDate,
                            dataType: payloads.createRecord.enum.TIMESTAMP,
                        },
                        {
                            name: "location",
                            locationValue: {
                                latitude: parsing.toInt(this.latitude),
                                longitude: parsing.toInt(this.longitude),
                            },
                            dataType: payloads.createRecord.enum.LOCATION,
                        },
                    ],
                });

                transactions.submit([recordPayload], true)
                    .then(() => (this.$router.push({path: `/editProduct/${this.batch}`})));


                /* transactions.submit([recordPayload].concat(reporterPayloads), true) //todo versão em que manda reporters não está a ser usado porque no formlulário ainda não dá para adici0ona reporters
                    .then(() => m.route.set(`/fish/${state.serialNumber}`))
*/ //Necessário se quisermos atribuir já reporters!

                /*   const reporterPayloads = state.reporters
                              .filter((reporter) => !!reporter.reporterKey)
                              .map((reporter) => payloads.createProposal({
                                  recordId: state.serialNumber,
                                  receivingAgent: reporter.reporterKey,
                                  role: payloads.createProposal.enum.REPORTER,
                                  properties: reporter.properties
                              })) */
            },

            submit() {
                this.addProduct();
            },
            clear() {
                this.$v.$reset();
                this.batch = null;
                this.name = null;
                this.classification = null;
                this.origin = null;
                this.weight = null;
                this.size = null;
                this.harvestDate = null;
                this.latitude = null;
                this.longitude = null;
                this.expirationDate = null;
                this.packingDate = null;
            },
        },
    };
</script>
