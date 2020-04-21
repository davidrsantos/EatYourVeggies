<template>
  <v-card class="mx-auto" max-width="800">
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
        /><v-text-field
          :counter="10"
          :error-messages="weightErrors"
          @blur="$v.weight.$touch()"
          @input="$v.weight.$touch()"
          label="Weight"
          required
          v-model="weight"
        /><v-text-field
          :counter="10"
          :error-messages="sizeErrors"
          @blur="$v.size.$touch()"
          @input="$v.size.$touch()"
          label="Size"
          required
          v-model="size"
        /><v-text-field
          :counter="10"
          :error-messages="harvestDateErrors"
          @blur="$v.harvestDate.$touch()"
          @input="$v.harvestDate.$touch()"
          label="Harvest Date"
          required
          v-model="harvestDate"
        />
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
import { validationMixin } from "vuelidate";
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
    batch: { required, maxLength: maxLength(50), minLength: minLength(1)},
    name: { required, maxLength: maxLength(50), minLength: minLength(2)},
    classification: { required, maxLength: maxLength(50), minLength: minLength(2)},
    origin: { required, maxLength: maxLength(50), minLength: minLength(2)},
    weight: { required, maxLength: maxLength(10), minLength: minLength(1)},
    size: { required, maxLength: maxLength(10), minLength: minLength(1)}
  },

  data: () => ({
    batch: "1fs23",
    name: "tomate",
    classification: "legume",
    origin: "biológica",
    weight: 23,
    size: 26,
    harvestDate: "17-04-2020",
    latitude: 10,
    longitude: 20,
  }),

  computed: {
    batchErrors() {
      const errors = [];
      if (!this.$v.batch.$dirty) return errors;
      !this.$v.batch.maxLength &&
        errors.push("Batch must be at most 50 characters long"); //TODO alterar mensagem de erro
      !this.$v.batch.required && errors.push("Batch is required.");
      return errors;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.batch.$dirty) return errors;
      !this.$v.batch.maxLength &&
        errors.push("Batch must be at most 50 characters long"); //TODO alterar mensagem de erro
      !this.$v.batch.required && errors.push("Batch is required.");
      return errors;
    },
    classificationErrors() {
      const errors = [];
      if (!this.$v.batch.$dirty) return errors;
      !this.$v.batch.maxLength &&
        errors.push("Batch must be at most 50 characters long"); //TODO alterar mensagem de erro
      !this.$v.batch.required && errors.push("Batch is required.");
      return errors;
    },
    originErrors() {
      const errors = [];
      if (!this.$v.batch.$dirty) return errors;
      !this.$v.batch.maxLength &&
        errors.push("Batch must be at most 50 characters long"); //TODO alterar mensagem de erro
      !this.$v.batch.required && errors.push("Batch is required.");
      return errors;
    },
    weightErrors() {
      const errors = [];
      if (!this.$v.batch.$dirty) return errors;
      !this.$v.batch.maxLength &&
        errors.push("Batch must be at most 50 characters long"); //TODO alterar mensagem de erro
      !this.$v.batch.required && errors.push("Batch is required.");
      return errors;
    },
    sizeErrors() {
      const errors = [];
      if (!this.$v.batch.$dirty) return errors;
      !this.$v.batch.maxLength &&
        errors.push("Batch must be at most 50 characters long"); //TODO alterar mensagem de erro
      !this.$v.batch.required && errors.push("Batch is required.");
      return errors;
    },
    harvestDateErrors() {
      const errors = [];
      if (!this.$v.batch.$dirty) return errors;
      !this.$v.batch.maxLength &&
        errors.push("Batch must be at most 50 characters long"); //TODO alterar mensagem de erro
      !this.$v.batch.required && errors.push("Batch is required.");
      return errors;
    },
    latitudeErrors() {
      const errors = [];
      if (!this.$v.batch.$dirty) return errors;
      !this.$v.batch.maxLength &&
        errors.push("Batch must be at most 50 characters long"); //TODO alterar mensagem de erro
      !this.$v.batch.required && errors.push("Batch is required.");
      return errors;
    },
    longitudeErrors() {
      const errors = [];
      if (!this.$v.batch.$dirty) return errors;
      !this.$v.batch.maxLength &&
        errors.push("Batch must be at most 50 characters long"); //TODO alterar mensagem de erro
      !this.$v.batch.required && errors.push("Batch is required.");
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
            stringValue: this.harvestDate,
            dataType: payloads.createRecord.enum.STRING,
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
      }); /* transactions.submit([recordPayload].concat(reporterPayloads), true) //todo versão em que manda reporters não está a ser usado porque no formlulário ainda não dá para adici0ona reporters
                     .then(() => m.route.set(`/fish/${state.serialNumber}`))
 */ //Necessário se quisermos atribuir já reporters!

      /*   const reporterPayloads = state.reporters
                    .filter((reporter) => !!reporter.reporterKey)
                    .map((reporter) => payloads.createProposal({
                        recordId: state.serialNumber,
                        receivingAgent: reporter.reporterKey,
                        role: payloads.createProposal.enum.REPORTER,
                        properties: reporter.properties
                    })) */ transactions
        .submit([recordPayload], true) //versão sem reporters!!!!!
        .then(() => m.route.set(`/vegetable/${this.batch}`));
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
      this.weigth = null;
      this.size = null;
      this.harvestDate = null;
      this.latitude = null;
      this.longitude = null;
    },
  },
};
</script>
