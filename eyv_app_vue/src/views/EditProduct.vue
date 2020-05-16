<template>
    <v-container fluid>
        <v-row no-gutters>
            <v-col class="col-8">
                <v-card class="mx-auto" max-width="700">
                    <v-toolbar color="green" dark>
                        <v-spacer></v-spacer>
                        <v-toolbar-title>Product Information</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
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
                                    :value="product.name"

                            />

                            <v-text-field
                                    label="Classification"
                                    outlined
                                    readonly
                                    :value="product.classification"

                            />

                            <v-text-field
                                    label="Origin"
                                    outlined
                                    readonly
                                    :value="product.origin"

                            />
                            <v-text-field
                                    label="Size"
                                    outlined
                                    readonly
                                    :value="product.size"

                            />
                            <v-text-field
                                    label="Weight"
                                    outlined
                                    readonly
                                    :value="product.weight"

                            />
                            <v-text-field
                                    label="Harvest Date"
                                    outlined
                                    readonly
                                    :value="product.harvestDate"

                            />
                            <v-text-field
                                    label="Expiration Date"
                                    outlined
                                    readonly
                                    :value="product.expirationDate"

                            />
                            <v-text-field
                                    label="Packing Date"
                                    outlined
                                    readonly
                                    :value="product.packingDate"

                            />

                        </form>

                    </v-container>

                </v-card>

            </v-col>
            <v-col class="col-4">
                <v-toolbar color="green" dark>
                    <v-spacer></v-spacer>
                    <v-toolbar-title>Product Properties</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>

                <v-card>
                    <v-list
                            rounded>
                        <v-list-item
                                class="px-2"
                        >
                            <v-list-item-content>
                                <v-list-item-title>
                                    <v-btn dark color="green" @click="showDialogTransfer=true">Transfer Ownership
                                    </v-btn>
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>

                </v-card>

                <v-card>
                    <v-container>
                        <form>
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

                            <v-toolbar dense color="green" dark>
                                <v-toolbar-title>Shock</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-btn icon
                                       @click="openShockDialog(product.acceleration,product.duration,'acceleration','duration')">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </v-toolbar>
                            <v-text-field
                                    label="Acceleration"
                                    outlined
                                    readonly
                                    v-model="product.acceleration"

                            />

                            <v-text-field
                                    label="Duration"
                                    outlined
                                    readonly
                                    v-model="product.duration"

                            />

                            <v-toolbar dense color="green" dark>
                                <v-toolbar-title>Tilt</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-btn icon
                                       @click="openTiltDialog(product.tiltX,product.tiltY,'tiltX','tiltY')">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </v-toolbar>
                            <v-text-field
                                    label="X"
                                    outlined
                                    readonly
                                    v-model="product.tiltX"

                            />
                            <v-text-field
                                    label="Y"
                                    outlined
                                    readonly
                                    v-model="product.tiltY"

                            />
                            <v-toolbar dense color="green" dark>
                                <v-toolbar-title>Localization</v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-btn icon
                                       @click="openLocalizationDialog(product.latitude,product.longitude,'latitude','longitude')">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </v-toolbar>


                            <v-text-field
                                    label="Latitude"
                                    outlined
                                    readonly
                                    v-model="product.latitude"
                            />
                            <v-text-field
                                    label="Longitude"
                                    outlined
                                    readonly
                                    v-model="product.longitude"
                            />
                        </form>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="showDialogTransfer" max-width="600">

            <v-card fluid>
                <v-container>
                    <v-select
                            :items="agents"
                            item-text="name"
                            label="Select User"
                            item-value="key"
                            v-model="publicKey"
                            outlined
                    ></v-select>
                </v-container>
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

                    <v-card-title class="headline">Insert {{dialogLabel}}:</v-card-title>

                    <v-text-field :error-messages="keyErrors"
                                  @blur="$v.valueUpdate.$touch()"
                                  @input="$v.valueUpdate.$touch()"
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
                        <v-btn :disabled="submitStatus==='ERROR'" @click="submitProperty" class="ml-4"
                               color="green darken-1">Insert
                        </v-btn>

                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>
        <v-dialog
                max-width="600"
                v-model="dialogTilt"
        >
            <v-card>
                <v-container>

                    <v-card-title class="headline">Insert Tilt:</v-card-title>

                    <v-text-field :error-messages="doublePropsErrors"
                                  @blur="$v.tiltX.$touch()"
                                  @input="$v.tiltX.$touch()"
                                  class="ml-4 mr-4"
                                  v-model="tiltX"
                                  label="X"

                    />
                    <v-text-field :error-messages="doublePropsErrors2"
                                  @blur="$v.tiltY.$touch()"
                                  @input="$v.tiltY.$touch()"
                                  class="ml-4 mr-4"
                                  v-model="tiltY"
                                  label="Y"

                    />

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                                @click="cancelTiltInsert"
                                color="grey darken-1"
                        >
                            Cancel
                        </v-btn>
                        <v-btn :disabled="submitStatus==='ERROR'" @click="submitTilt" class="ml-4"
                               color="green darken-1">Insert
                        </v-btn>

                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>

        <v-dialog
                max-width="600"
                v-model="dialogShock"
        >
            <v-card>
                <v-container>

                    <v-card-title class="headline">Insert Shock:</v-card-title>
                    <v-text-field :error-messages="doublePropsErrors"
                                  @blur="$v.acceleration.$touch()"
                                  @input="$v.acceleration.$touch()"
                                  class="ml-4 mr-4"
                                  v-model="acceleration"
                                  label="Acceleration"

                    />
                    <v-text-field :error-messages="doublePropsErrors2"
                                  @blur="$v.duration.$touch()"
                                  @input="$v.duration.$touch()"
                                  class="ml-4 mr-4"
                                  v-model="duration"
                                  label="Duration"

                    />
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                                @click="cancelShockInsert"
                                color="grey darken-1"
                        >
                            Cancel
                        </v-btn>
                        <v-btn :disabled="submitStatus==='ERROR'" @click="submitShock" class="ml-4"
                               color="green darken-1">Insert
                        </v-btn>

                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>

        <v-dialog
                max-width="600"
                v-model="dialogLocalization"
        >
            <v-card>
                <v-container>

                    <v-card-title class="headline">Insert Localization:</v-card-title>
                    <v-text-field :error-messages="doublePropsErrors"
                                  @blur="$v.latitude.$touch()"
                                  @input="$v.latitude.$touch()"
                                  class="ml-4 mr-4"
                                  v-model="latitude"
                                  label="X"

                    />
                    <v-text-field :error-messages="doublePropsErrors2"
                                  @blur="$v.longitude.$touch()"
                                  @input="$v.longitude.$touch()"
                                  class="ml-4 mr-4"
                                  v-model="longitude"
                                  label="Y"

                    />
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                                @click="cancelLocalizationInsert"
                                color="grey darken-1"
                        >
                            Cancel
                        </v-btn>
                        <v-btn :disabled="submitStatus==='ERROR'" @click="submitLocalization" class="ml-4"
                               color="green darken-1">Insert
                        </v-btn>

                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>

    </v-container>

</template>

<script>
  import { getPropertyValue } from '../utils/records'
  import * as api from '../services/api'
  import * as parsing from '../services/parsing'
  import { email, maxLength, minLength, numeric, between, required, sameAs } from 'vuelidate/lib/validators'

  const payloads = require('../services/payloads')
  const transactions = require('../services/transactions')

  export default {
    validations () {
      return {
        valueUpdate: this.rules,
        tiltX: {
          minLength: minLength(1),
          maxLength: maxLength(6),
          numeric
        },
        tiltY: {
          minLength: minLength(1),
          maxLength: maxLength(6),
          numeric
        },
        acceleration:
          {
            minLength: minLength(1),
            maxLength: maxLength(6),
            numeric
          },
        duration:
          {
            minLength: minLength(1),
            maxLength: maxLength(6),
            numeric
          },
        latitude: {
          minLength: minLength(1),
          maxLength: maxLength(9),
          numeric,
          between: between(-90, 90)
        },
        longitude:
          {
            minLength: minLength(1),
            maxLength: maxLength(9),
            numeric,
            between: between(-180, 180)
          }
      }
    },
    data: () => ({
      submitStatus: null,
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
        acceleration: '',
        duration: '',
        tiltX: '',
        tiltY: '',
      },
      //value for update properties
      latitude: '',
      longitude: '',
      temperature: '',
      humidade: '',
      co2: '',
      acceleration: '',
      duration: '',
      tiltX: '',
      tiltY: '',
      agents: [],
      users: [],
      role: 'owner',
      publicKey: '',
      dialogLabel: '',
      dialogProperties: '',
      dialogTilt: '',
      dialogShock: '',
      dialogLocalization: '',
      valueUpdate: null,
      key: '',
      key1: '',
      key2: ''

    }),
    created: function () {
      if (this.$route.params.recordId != null) {
        this.recordId = this.$route.params.recordId

      }
    },
    methods: {
      handleErrors (error) {
        this.$emit('errorEvent', error)
      },

      getAgents () {
        axios.get('/agents').then(response => {
          this.agents = response.data

          console.log(this.agents)
        })
          .catch(function (error) {
            console.log(error)
          })
      },
      /*
      getUsers () {
        axios.get('/users').then(response => {
          this.users = response.data

          console.log(this.users)
        })
          .catch(function (error) {
            console.log(error)
          })
      },

       */
      getPropertyValue (item, prop) {
        return getPropertyValue(item, prop)
      },

      getProduct () {
        axios.get(`/records/${this.recordId}`).then(response => {
          this.product = response.data
          let name = getPropertyValue(response.data, 'name')
          if (name !== null) {
            this.product.name = name
          }
          let classification = getPropertyValue(response.data, 'classification')
          if (name !== null) {
            this.product.classification = classification
          }
          let origin = getPropertyValue(response.data, 'origin')
          if (origin !== null) {
            this.product.origin = origin
          }
          let size = getPropertyValue(response.data, 'size')
          if (size !== null) {
            this.product.size = size
          }
          let weight = getPropertyValue(response.data, 'weight')
          if (weight !== null) {
            this.product.weight = weight
          }
          let harvestDate = getPropertyValue(response.data, 'harvestDate')
          if (harvestDate !== null) {
            this.product.harvestDate = harvestDate
          }
          let expirationDate = getPropertyValue(response.data, 'expirationDate')
          if (expirationDate !== null) {
            this.product.expirationDate = expirationDate
          }
          let packingDate = getPropertyValue(response.data, 'packingDate')
          if (packingDate !== null) {
            this.product.packingDate = packingDate
          }
          let temperature = getPropertyValue(response.data, 'temperature')
          if (temperature !== null) {
            this.product.temperature = temperature
          }
          let humidade = getPropertyValue(response.data, 'humidade')
          if (humidade !== null) {
            this.product.humidade = humidade
          }
          let co2 = getPropertyValue(response.data, 'co2')
          if (co2 !== null) {
            this.product.co2 = co2
          }
          let location = getPropertyValue(response.data, 'location')
          if (location !== null) {
            this.product.latitude = location.latitude
            this.product.longitude = location.longitude
          }
          let tilt = getPropertyValue(response.data, 'tilt')
          if (tilt !== null) {
            this.product.tiltX = tilt.x
            this.product.tiltY = tilt.y
          }
          let shock = getPropertyValue(response.data, 'shock')
          if (shock !== null) {
            this.product.acceleration = shock.acceleration
            this.product.duration = shock.duration
          }

          console.log(this.product)
        })
          .catch(function (error) {
            console.log(error)
          })
      },
      updateProperty (record, value) {
        let updatePayload = payloads.updateProperties({
          recordId: record,
          properties: [value]
        })
        return transactions.submit([updatePayload], true).then(() => {
          console.log('Successfully submitted property update')
        })
      },
      cancel () {
        this.showDialogTransfer = false
      },
      cancelInsert () {
        this.dialogProperties = false
      },
      cancelTiltInsert () {
        this.dialogTilt = false
      },
      cancelShockInsert () {
        this.dialogShock = false
      },
      cancelLocalizationInsert () {
        this.dialogLocalization = false
      },
      submitProposal (recordId, role, publicKey) {

        let transferPayload = payloads.createProposal({
          recordId: recordId,
          receivingAgent: publicKey,
          role: this.roleToEnum(role)
        })
        console.log(publicKey)
        return transactions.submit([transferPayload], true).then(() => {
          console.log('Successfully submitted proposal')
        })
      },
      reportShock () {
        this.updateProperty(this.recordId, {
          name: 'shock',
          stringValue: JSON.stringify({
            accel: parsing.toInt(this.acceleration),
            duration: parsing.toInt(this.duration)
          }),
          dataType: payloads.updateProperties.enum.STRING
        })
      },
      reportTilt () {
        this.updateProperty(this.recordId, {
          name: 'tilt',
          stringValue: JSON.stringify({
            x: parsing.toInt(this.tiltX),
            y: parsing.toInt(this.tiltY)
          }),
          dataType: payloads.updateProperties.enum.STRING
        })
      },
      reportLocalization () {
        this.updateProperty(this.recordId, {
          name: 'location',
          locationValue: {
            latitude: parsing.toInt(this.latitude),
            longitude: parsing.toInt(this.longitude)
          },
          dataType: payloads.updateProperties.enum.LOCATION
        })
      },
      reportTemperature () {
        this.updateProperty(this.recordId, {
          name: 'temperature',
          numberValue: parsing.toInt(this.temperature),
          dataType: payloads.updateProperties.enum.NUMBER
        })
      },
      reportHumidity () {
        this.updateProperty(this.recordId, {
          name: 'humidade',
          numberValue: parsing.toInt(this.humidade),
          dataType: payloads.updateProperties.enum.NUMBER
        })
      },
      reportCo2 () {
        this.updateProperty(this.recordId, {
          name: 'co2',
          numberValue: parsing.toInt(this.co2),
          dataType: payloads.updateProperties.enum.NUMBER
        })
      },
      openDialog (model, key, label) {
        this.dialogProperties = true
        this.key = key
        this.dialogLabel = label
        this.valueUpdate = model
      },
      openTiltDialog (tiltX, tiltY, key1, key2) {
        this.dialogTilt = true
        this.key1 = key1
        this.key2 = key2
        this.tiltX = tiltX
        this.tiltY = tiltY

      },
      openShockDialog (acceleration, duration, key1, key2) {
        this.dialogShock = true
        this.key1 = key1
        this.key2 = key2
        this.acceleration = acceleration
        this.duration = duration
      },
      openLocalizationDialog (latitude, longitude, key1, key2) {
        this.dialogLocalization = true
        this.key1 = key1
        this.key2 = key2
        this.latitude = latitude
        this.longitude = longitude
      },
      roleToEnum (role) {//todo perguntar as proffs se querem manter o custodiam e o reporter
        if (role = 'owner') {
          return payloads.createProposal.enum.OWNER
        } else if (role = 'custodian') {
          return payloads.createProposal.enum.CUSTODIAN
        } else if (role = 'reporter') {
          return payloads.createProposal.enum.REPORTER
        }
      },
      submit () {
        this.submitProposal(this.recordId, this.role, this.publicKey)
        this.showDialogTransfer = false
      },
      submitProperty () {
        _.set(this.key, this.valueUpdate)
        if (this.key == 'temperature') {
          this.reportTemperature()
        } else if (this.key == 'humidade') {
          this.reportHumidity()
        } else {
          this.reportCo2()
        }
        this.key = ''
        this.dialogProperties = false
      },
      submitTilt () {
        _.set(this.tiltX, this.tiltY)
        this.reportTilt()
        this.dialogTilt = false
      },
      submitShock () {
        _.set(this.acceleration, this.duration)
        this.reportShock()
        this.dialogShock = false
      },
      submitLocalization () {
        _.set(this.latitude, this.longitude)
        this.reportLocalization()
        this.dialogLocalization = false
      },

    },
    computed: {
      keyErrors () {
        const errors = []
        if (this.key === 'temperature') {

          if (!this.$v.valueUpdate.$dirty) return errors
          !this.$v.valueUpdate.minLength && errors.push('The Temperature must be at most 1 characters long')
          !this.$v.valueUpdate.maxLength && errors.push('The Temperature should not be more that 6 characters long')
          !this.$v.valueUpdate.numeric && errors.push('The Temperature must be numeric.')

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'

          return errors
        }
        if (this.key === 'co2') {

          if (!this.$v.valueUpdate.$dirty) return errors
          !this.$v.valueUpdate.minLength && errors.push('The CO2 must be at most 1 characters long')
          !this.$v.valueUpdate.maxLength && errors.push('The CO2 should not be more that 6 characters long')
          !this.$v.valueUpdate.numeric && errors.push('The CO2 must be numeric.')

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'

          return errors
        }
        if (this.key === 'humidade') {

          if (!this.$v.valueUpdate.$dirty) return errors
          !this.$v.valueUpdate.minLength && errors.push('The Humidity must be at most 1 characters long')
          !this.$v.valueUpdate.maxLength && errors.push('The Humidity should not be more that 6 characters long')
          !this.$v.valueUpdate.numeric && errors.push('The Humidity must be numeric.')

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'

          return errors
        }

      },
      doublePropsErrors () {
        const errors = []
        if (this.key1 === 'tiltX') {
          if (!this.$v.tiltX.$dirty) return errors
          !this.$v.tiltX.minLength && errors.push('The X must be at most 1 characters long')
          !this.$v.tiltX.maxLength && errors.push('The X should not be more that 6 characters long')
          !this.$v.tiltX.numeric && errors.push('The X must be numeric.')

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'

          return errors
        }

        if (this.key1 === 'acceleration') {
          if (!this.$v.acceleration.$dirty) return errors
          !this.$v.acceleration.minLength && errors.push('The acceleration must be at most 1 characters long')
          !this.$v.acceleration.maxLength && errors.push('The acceleration should not be more that 6 characters long')
          !this.$v.acceleration.numeric && errors.push('The acceleration must be numeric.')

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'

          return errors
        }

        if (this.key1 === 'latitude') {
          if (!this.$v.latitude.$dirty) return errors
          !this.$v.latitude.minLength && errors.push('The latitude must be at most 1 characters long')
          !this.$v.latitude.maxLength && errors.push('The latitude should not be more that 9 characters long')
          !this.$v.latitude.numeric && errors.push('The latitude must be numeric.')
          !this.$v.latitude.between && errors.push('The latitude must be between -90 and 90.')
          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'

          return errors
        }

      },
      doublePropsErrors2 () {
        const errors = []

        if (this.key2 === 'tiltY') {
          if (!this.$v.tiltY.$dirty) return errors
          !this.$v.tiltY.minLength && errors.push('The Y must be at most 1 characters long')
          !this.$v.tiltY.maxLength && errors.push('The Y should not be more that 6 characters long')
          !this.$v.tiltY.numeric && errors.push('The Y must be numeric.')

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'

          return errors
        }

        if (this.key2 === 'duration') {
          if (!this.$v.duration.$dirty) return errors
          !this.$v.duration.minLength && errors.push('The duration must be at most 1 characters long')
          !this.$v.duration.maxLength && errors.push('The duration should not be more that 6 characters long')
          !this.$v.duration.numeric && errors.push('The duration must be numeric.')
          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'

          return errors
        }

        if (this.key2 === 'longitude') {
          if (!this.$v.longitude.$dirty) return errors
          !this.$v.longitude.minLength && errors.push('The longitude must be at most 1 characters long')
          !this.$v.longitude.maxLength && errors.push('The longitude should not be more that 9 characters long')
          !this.$v.longitude.numeric && errors.push('The longitude must be numeric.')
          !this.$v.longitude.between && errors.push('The longitude must be between -180 and 180.')

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'

          return errors
        }
      },
      rules () {
        switch (this.key) {
          case 'temperature':
            return {
              minLength: minLength(1),
              maxLength: maxLength(6),
              numeric
            }
          case 'co2':
            return {
              minLength: minLength(1),
              maxLength: maxLength(6),
              numeric
            }
          case 'humidade':
            return {
              minLength: minLength(1),
              maxLength: maxLength(6),
              numeric
            }

        }

      }
    },

    beforeMount: function () {
      this.getProduct()
      this.getAgents()
      // this.getUsers()
    },
  }

</script>

<style scoped>

</style>