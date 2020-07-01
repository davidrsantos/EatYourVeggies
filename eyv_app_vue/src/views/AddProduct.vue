<template>
    <v-card class="mx-auto" max-width="800">
        <v-toolbar color="green" dark extended flat>
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
                        label="Size (cm)"
                        required
                        v-model="size"
                />
                <v-text-field
                        :counter="10"
                        :error-messages="weightErrors"
                        @blur="$v.weight.$touch()"
                        @input="$v.weight.$touch()"
                        label="Weight (grams)"
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
                <v-toolbar color="green" dark>
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
                <v-toolbar color="green" dark>
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
                <v-btn :disabled="submitStatus==='ERROR'" @click="submit" class="mr-4">submit</v-btn>
                <v-btn @click="clear">clear</v-btn>
            </form>
        </v-container>
    </v-card>
</template>
<script>
  import { validationMixin } from 'vuelidate'
  import {
    required, maxLength, minLength, between, sameAs, email, numeric, alpha, decimal, minValue
  } from 'vuelidate/lib/validators'
  import * as transactions from '../services/transactions'
  import * as api from '../services/api'
  import * as payloads from '../services/payloads'
  import * as parsing from '../services/parsing'

  export default {
    mixins: [validationMixin],

    validations: {
      batch: {
        required,
        maxLength: maxLength(50),
        minLength: minLength(1)
      },
      name: {
        required,
        maxLength: maxLength(50),
        minLength: minLength(2),
        alpha
      },
      classification: {
        required,
        maxLength: maxLength(50),
        minLength: minLength(2),
      },
      origin: {
        required,
        maxLength: maxLength(50),
        minLength: minLength(2)
      },
      weight: {
        required,
        decimal,
        maxLength: maxLength(10),
        minLength: minLength(1),
        minValue: minValue(0.01)
      },
      size: {
        required,
        decimal,
        maxLength: maxLength(10),
        minLength: minLength(1),
        minValue: minValue(0.01)
      },
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
      latitude: {
        minLength: minLength(1),
        maxLength: maxLength(9),
        decimal,
        between: between(-90, 90)
      },
      longitude:
        {
          minLength: minLength(1),
          maxLength: maxLength(9),
          decimal,
          between: between(-180, 180)
        }
    },

    data: () => ({
      submitStatus: 'ERROR',
      batch: '',
      name: '',
      classification: '',
      origin: '',
      weight: '',
      size: '',
      harvestDate: '',
      latitude: '',
      longitude: '',
      expirationDate: null,
      packingDate: null,
      expirationDateCheck: false,
      packingDateCheck: false,
      menu: false,
      menuHarvestDate: false,
      menuExpirationDate: false,
      menuPackingDate: false,

    }),

    computed: {
      batchErrors () {
        const errors = []
        if (!this.$v.batch.$dirty) return errors
        !this.$v.batch.maxLength && errors.push('The batch should not be more that 50 characters long')
        !this.$v.batch.minLength && errors.push('The batch must be at most 1 characters long')
        !this.$v.batch.required && errors.push('Batch is required.')

        if (errors.length !== 0) this.submitStatus = 'ERROR'
        else this.submitStatus = 'OK'
        return errors
      },
      nameErrors () {
        const errors = []
        if (!this.$v.name.$dirty) return errors
        !this.$v.name.maxLength && errors.push('The name should not be more that 50 characters long')
        !this.$v.name.minLength && errors.push('The name must be at most 1 characters long')
        !this.$v.name.required && errors.push('Name is required.')

        if (errors.length !== 0) this.submitStatus = 'ERROR'
        else this.submitStatus = 'OK'
        return errors
      },
      classificationErrors () {
        const errors = []
        if (!this.$v.classification.$dirty) return errors
        !this.$v.classification.required && errors.push('Classification is required.')
        !this.$v.classification.maxLength && errors.push('The classification should not be more that 50 characters long')
        !this.$v.classification.minLength && errors.push('The classification must be at most 1 characters long')

        if (errors.length !== 0) this.submitStatus = 'ERROR'
        else this.submitStatus = 'OK'
        return errors
      },
      originErrors () {
        const errors = []
        if (!this.$v.origin.$dirty) return errors
        !this.$v.origin.maxLength && errors.push('The origin should not be more that 50 characters long')
        !this.$v.origin.minLength && errors.push('The origin must be at most 1 characters long')
        !this.$v.origin.required && errors.push('Origin is required.')

        if (errors.length !== 0) this.submitStatus = 'ERROR'
        else this.submitStatus = 'OK'
        return errors
      },
      weightErrors () {
        const errors = []
        if (!this.$v.weight.$dirty) return errors
        !this.$v.weight.minLength && errors.push('The weight must be at most 1 characters long')
        !this.$v.weight.maxLength && errors.push('The weight should not be more that 10 characters long')
        !this.$v.weight.required && errors.push('Weight is required.')
        !this.$v.weight.decimal && errors.push('The weight must be a decimal number.')
        !this.$v.weight.minValue && errors.push('The weight must be greater than zero')

        if (errors.length !== 0) this.submitStatus = 'ERROR'
        else this.submitStatus = 'OK'
        return errors
      },
      sizeErrors () {
        const errors = []
        if (!this.$v.size.$dirty) return errors
        !this.$v.size.minLength && errors.push('The size must be at most 1 characters long')
        !this.$v.size.maxLength && errors.push('The size should not be more that 10 characters long')
        !this.$v.size.required && errors.push('Size is required.')
        !this.$v.size.decimal && errors.push('The size must be a decimal number.')
        !this.$v.size.minValue && errors.push('The size must be greater than zero')

        if (errors.length !== 0) this.submitStatus = 'ERROR'
        else this.submitStatus = 'OK'
        return errors
      },
      harvestDateErrors () {
        const errors = []
        if (!this.$v.harvestDate.$dirty) return errors
        !this.$v.harvestDate.maxLength && errors.push('The harvest data must be 1 to 11 characters long')
        !this.$v.harvestDate.required && errors.push('Harvest Date is required.')

        if (errors.length !== 0) this.submitStatus = 'ERROR'
        else this.submitStatus = 'OK'
        return errors
      },
      latitudeErrors () {
        const errors = []
        if (!this.$v.latitude.$dirty) return errors
        !this.$v.latitude.minLength && errors.push('The latitude must be at most 1 characters long')
        !this.$v.latitude.maxLength && errors.push('The latitude should not be more that 9 characters long')
        !this.$v.latitude.decimal && errors.push('The latitude must be a decimal number.')
        !this.$v.latitude.between && errors.push('The latitude must be between -90 and 90.')

        if (errors.length !== 0) this.submitStatus = 'ERROR'
        else this.submitStatus = 'OK'
        return errors
      },
      longitudeErrors () {
        const errors = []
        !this.$v.longitude.minLength && errors.push('The longitude must be at most 1 characters long')
        !this.$v.longitude.maxLength && errors.push('The longitude should not be more that 9 characters long')
        !this.$v.longitude.decimal && errors.push('The longitude must be a decimal number.')
        !this.$v.longitude.between && errors.push('The longitude must be between -180 and 180.')

        if (errors.length !== 0) this.submitStatus = 'ERROR'
        else this.submitStatus = 'OK'
        return errors
      },
      expirationDateErrors () {
        const errors = []
        if (!this.$v.expirationDate.$dirty) return errors
        !this.$v.expirationDate.maxLength && errors.push('The expiration date should not be more that 11 characters long')

        if (errors.length !== 0) this.submitStatus = 'ERROR'
        else this.submitStatus = 'OK'
        return errors
      },
      packingDateErrors () {
        const errors = []
        if (!this.$v.packingDate.$dirty) return errors
        !this.$v.packingDate.maxLength && errors.push('The packingDate should not be more that 11 characters long')

        if (errors.length !== 0) this.submitStatus = 'ERROR'
        else this.submitStatus = 'OK'
        return errors
      },
    },

    methods: {
      addProduct () {
        let recordPayload = payloads.createRecord({
          recordId: this.batch,
          recordType: 'vegetable',
          properties: [
            {
              name: 'name',
              stringValue: this.name,
              dataType: payloads.createRecord.enum.STRING,
            },
            {
              name: 'classification',
              stringValue: this.classification,
              dataType: payloads.createRecord.enum.STRING,
            },
            {
              name: 'origin',
              stringValue: this.origin,
              dataType: payloads.createRecord.enum.STRING,
            },
            {
              name: 'weight',
              numberValue: parsing.toInt(this.weight),
              dataType: payloads.createRecord.enum.NUMBER,
            },
            {
              name: 'size',
              numberValue: parsing.toInt(this.size),
              dataType: payloads.createRecord.enum.NUMBER,
            },
            {
              name: 'harvestDate',
              timestampValue: new Date(this.harvestDate).getTime() / 1000,
              dataType: payloads.createRecord.enum.TIMESTAMP,
            },
            {
              name: 'expirationDate',
              timestampValue: this.expirationDate !== null ? new Date(this.expirationDate).getTime() / 1000 : null,
              dataType: payloads.createRecord.enum.TIMESTAMP,
            },
            {
              name: 'packingDate',
              timestampValue: this.expirationDate !== null ? new Date(this.packingDate).getTime() / 1000 : null,
              dataType: payloads.createRecord.enum.TIMESTAMP,
            },
            {
              name: 'location',
              locationValue: {
                latitude: parsing.toInt(this.latitude),
                longitude: parsing.toInt(this.longitude),
              },
              dataType: payloads.createRecord.enum.LOCATION,
            },
          ],
        })

        if (this.expirationDate !== null && new Date(this.expirationDate).getTime() < new Date(this.harvestDate).getTime()) {
          this.$emit('errorEvent', 'The expiration date cannot be less than the harvest date')
        } else if (this.packingDate !== null && this.packingDate < this.harvestDate) {
          this.$emit('errorEvent', 'The packing date cannot be less than the harvest date')
        } else if (this.expirationDate !== null && this.packingDate !== null && this.packingDate < this.expirationDate) {
          this.$emit('errorEvent', 'The packing date cannot be less than the expiration date')
        } else {

          this.$snotify.async('Adding product to the blockchain', 'Adding Product',
            () => {
              return new Promise((resolve, reject) => {
                return transactions.submit([recordPayload], true)
                  .then((response) => {
                    console.log(response)
                    if (response.status && response.type === undefined) {
                      setTimeout(() => resolve({
                          title: 'Success',
                          body: 'Successfully submitted product',
                          config: {
                            showProgressBar: true,
                            closeOnClick: true,
                            timeout: 8000
                          }
                        }
                      ), 2000)
                      this.$router.push({ path: `/editProduct/${this.batch}` })
                    }
                  }).catch(error => {
                    console.log(error.toString())
                    setTimeout(() => reject({
                      title: 'Error',
                      body: error.toString(),
                      config: {
                        showProgressBar: true,
                        closeOnClick: true,
                        timeout: 8000
                      }
                    }), 2000)
                    if (error === 'requestPassword') {
                      this.$emit('requestPasswordEvent')
                    }
                  })
              })
            })
        }
      },

      submit () {
        this.addProduct()
      },
      clear () {
        this.$v.$reset()
        this.batch = null
        this.name = null
        this.classification = null
        this.origin = null
        this.weight = null
        this.size = null
        this.harvestDate = null
        this.latitude = null
        this.longitude = null
        this.expirationDate = null
        this.packingDate = null
      },
    },
  }
</script>
