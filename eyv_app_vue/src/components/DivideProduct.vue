<template>
    <v-card>
        <v-container>
            <v-card outlined>

                <v-container>
                    <v-card-title>Current Product</v-card-title>
                    <v-row>
                        <v-col>
                            <v-text-field
                                    label="Batch"
                                    outlined
                                    readonly
                                    v-model=product.recordId

                            />
                        </v-col>
                        <v-col>
                            <v-text-field
                                    :value="product.weight"
                                    label="Weight (grams)"
                                    outlined
                                    readonly

                            />
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
            <v-subheader>Min and max default slider</v-subheader>

            <v-card-text>
                <v-row>
                    <v-col class="pr-4">
                        <v-slider
                                :max="max"
                                :min="min"
                                class="align-center"
                                hide-details
                                v-model="slider"
                        >
                            <template v-slot:append>
                                <v-text-field
                                        class="mt-0 pt-0"
                                        hide-details
                                        single-line
                                        style="width: 60px"
                                        type="number"
                                        v-model="slider"
                                ></v-text-field>
                            </template>
                        </v-slider>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-card outlined>

                <v-container>
                    <v-card-title>New Products</v-card-title>
                    <v-container>
                        <form>
                            <v-row>
                                <v-col>

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
                                            label="Weight (grams)"
                                            outlined
                                            readonly
                                            v-model="newWeights"
                                    />
                                </v-col>
                                <v-col>
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
                                                <v-date-picker @input="menuExpirationDate = false"
                                                               v-model="expirationDate"></v-date-picker>
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
                                                <v-date-picker @input="menuPackingDate = false"
                                                               v-model="packingDate"></v-date-picker>
                                            </v-menu>
                                        </v-row>
                                    </v-card-text>

                                </v-col>
                            </v-row>
                            <!--      <v-btn :disabled="submitStatus==='ERROR'" @click="submit" class="mr-4">submit</v-btn>
                                  <v-btn @click="clear">clear</v-btn>-->

                        </form>
                    </v-container>
                </v-container>
            </v-card>

            you will get {{slider}} with {{newWeights}} grams


            <v-data-table
                    :headers="headers"
                    :items="records"
                    class="elevation-1"
                    dense
                    v-if="slider>1 && name!=null"
            >

            </v-data-table>


            <v-btn @click="submit">recors</v-btn>
        </v-container>
    </v-card>
</template>

<script>
  import * as payloads from '../services/payloads'
  import * as parsing from '../services/parsing'
  import * as transactions from '../services/transactions'
  import { validationMixin } from 'vuelidate'
  import { alpha, between, decimal, maxLength, minLength, minValue, required } from 'vuelidate/lib/validators'

  export default {
    name: 'DivideProduct',
    props: ['product'],

    mixins: [validationMixin],

    validations: {
      name: {
        required,
        maxLength: maxLength(50),
        minLength: minLength(2),
        alpha
      },

      weight: {
        required,
        decimal,
        maxLength: maxLength(10),
        minLength: minLength(1),
        minValue: minValue(0.01)
      },

      expirationDate: {
        maxLength: maxLength(11),
      },
      packingDate: {
        maxLength: maxLength(11),
      },

    },

    data () {
      return {
        min: 1,
        max: this.product.weight,
        slider: 1,
        plus: 1,

        name: null,
        weight: '',

        expirationDate: null,
        packingDate: null,
        expirationDateCheck: false,
        packingDateCheck: false,
        menu: false,
        menuExpirationDate: false,
        menuPackingDate: false,

        records: null,
        headers: [
          { text: 'Batch', value: 'batch' },
          { text: 'Name', value: 'name' },
          { text: 'Classification', value: 'classification' },
          { text: 'Origin', value: 'origin' },
          { text: 'Size', value: 'size' },
          { text: 'Weight', value: 'weight' },
          { text: 'HarvestDate', value: 'harvestDate' },
          { text: 'ExpirationDate', value: 'expirationDate' },
          { text: 'PackingDate', value: 'packingDate' },
          { text: 'Latitude', value: 'latitude' },
          { text: 'Longitude', value: 'longitude' },
        ],

      }
    },

    created: function () {

    },
    beforeMount: function () {
      // this.getProduct()
      // this.getUsers()
    },
    watch: {
      slider: function () {
        this.table()
      },
      name: function () {
        this.table()
      },
      expirationDate: function () {
        this.table()
      },
      packingDate: function () {
        this.table()
      }
    },

    computed: {

      newWeights: function () {
        return (this.product.weight / this.slider).toFixed(2)
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

      table () {
        this.records = []
        console.log(' o slider mexeu' + this.slider)
        for (let i = 1; i <= this.slider; i++) {

          console.log(i)
          let record = {
            batch: this.product.recordId + '#' + i,
            name: this.name,
            classification: this.product.classification,
            origin: this.product.origin,
            size: this.product.size,
            weight: this.newWeights,
            harvestDate: this.product.weight,
            expirationDate: this.expirationDate,
            packingDate: this.packingDate,
            latitude: this.product.latitude,
            longitude: this.product.latitude,
          }
          this.records.push(record)
        }
      },

      submit: function () {

        let record1 = payloads.createRecord({
          recordId: 'testekkxk2',
          recordType: 'vegetable',
          properties: [
            {
              name: 'name',
              stringValue: this.product.name,
              dataType: payloads.createRecord.enum.STRING,
            },
            {
              name: 'classification',
              stringValue: this.product.classification,
              dataType: payloads.createRecord.enum.STRING,
            },
            {
              name: 'origin',
              stringValue: this.product.origin,
              dataType: payloads.createRecord.enum.STRING,
            },
            {
              name: 'weight',
              numberValue: parsing.toInt(this.product.weight),
              dataType: payloads.createRecord.enum.NUMBER,
            },
            {
              name: 'size',
              numberValue: parsing.toInt(this.product.size),
              dataType: payloads.createRecord.enum.NUMBER,
            },
            {
              name: 'harvestDate',
              timestampValue: new Date(this.product.harvestDate).getTime() / 1000,
              dataType: payloads.createRecord.enum.TIMESTAMP,
            },
            {
              name: 'expirationDate',
              timestampValue: this.product.expirationDate !== null ? new Date(this.product.expirationDate).getTime() / 1000 : null,
              dataType: payloads.createRecord.enum.TIMESTAMP,
            },
            {
              name: 'packingDate',
              timestampValue: this.product.expirationDate !== null ? new Date(this.product.packingDate).getTime() / 1000 : null,
              dataType: payloads.createRecord.enum.TIMESTAMP,
            },
            {
              name: 'location',
              locationValue: {
                latitude: parsing.toInt(this.product.latitude),
                longitude: parsing.toInt(this.product.longitude),
              },
              dataType: payloads.createRecord.enum.LOCATION,
            },
          ],
        })

        let records = []
        records.push(record1)

        this.transitionSubmit(records)

      },

      transitionSubmit (recordsPayload) {
        this.$snotify.async('Adding product to the blockchain', 'Adding Product',
          () => {
            return new Promise((resolve, reject) => {
              return transactions.submit(recordsPayload, true)
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
                    this.$emit('close')
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
      },

    }

  }
</script>

<style scoped>

</style>