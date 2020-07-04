<template>
    <v-card>
        <v-container>
            <v-text-field
                    :value="product.weight"
                    label="Weight (grams)"
                    outlined
                    readonly

            />

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

            you will get {{slider}} with {{newProducts}} grams
            <v-btn @click="recordPayload">recors</v-btn>
        </v-container>
    </v-card>
</template>

<script>
  import * as payloads from '../services/payloads'
  import * as parsing from '../services/parsing'
  import * as transactions from '../services/transactions'

  export default {
    name: 'DivideProduct',
    props: ['product'],
    data () {
      return {
        min: 1,
        max: this.product.weight,
        slider: 1,
        plus: 1,
      }
    },

    created: function () {

    },
    beforeMount: function () {
      // this.getProduct()
      // this.getUsers()
    },
    computed: {

      // a computed getter
      newProducts: function () {
        return (this.product.weight / this.slider).toFixed(2)
      }
    },
    methods: {
      recordPayload: function () {

       let record1 =  payloads.createRecord({
          recordId: "testekkxk2",
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
        let record2 =  payloads.createRecord({
          recordId: "testekkk1",
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
        records.push(record2)

       this.transitionSubmit(record1)


        this.plus++


    },

    transitionSubmit (recordPayload) {
      this.$snotify.async('Adding product to the blockchain', 'Adding Product',
        () => {
          return new Promise((resolve, reject) => {
            return transactions.submit(recordPayload, true)
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
    },

  }

  }
</script>

<style scoped>

</style>