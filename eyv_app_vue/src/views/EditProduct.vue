<template>
    <v-container>
        <v-container>
            <v-row no-gutters>
                <v-col class="col-5">
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
                                        :value="product.name"
                                        label="Name"
                                        outlined
                                        readonly

                                />

                                <v-text-field
                                        :value="product.classification"
                                        label="Classification"
                                        outlined
                                        readonly

                                />

                                <v-text-field
                                        :value="product.origin"
                                        label="Origin"
                                        outlined
                                        readonly

                                />
                                <v-text-field
                                        :value="product.size"
                                        label="Size (cm)"
                                        outlined
                                        readonly

                                />
                                <v-text-field
                                        :value="product.weight"
                                        label="Weight (grams)"
                                        outlined
                                        readonly

                                />
                                <v-text-field
                                        :value="product.harvestDate"
                                        label="Harvest Date"
                                        outlined
                                        readonly

                                />
                                <v-text-field
                                        :value="product.expirationDate==null?'N/A':product.expirationDate"
                                        label="Expiration Date"
                                        outlined
                                        readonly

                                />

                                <v-text-field
                                        :value="product.packingDate==null?'N/A':product.packingDate"
                                        label="Packing Date"
                                        outlined
                                        readonly

                                />
                            </form>

                        </v-container>


                    </v-card>

                </v-col>
                <v-spacer></v-spacer>
                <v-col class="col-5">


                    <v-card>
                        <v-card-title>
                            <v-toolbar color="green" dark>
                                <v-spacer></v-spacer>
                                <v-toolbar-title>Product Properties</v-toolbar-title>
                                <v-spacer></v-spacer>
                            </v-toolbar>
                        </v-card-title>
                        <v-container fluid
                                     v-if="this.$store.state.user.role!=='customer' && this.$store.state.user.role!==null">
                            <v-row align="center" justify="center">
                                <v-btn @click="openTransferDialog" class="mr-2" color="green" dark>Transfer Ownership
                                </v-btn>

                                <v-dialog v-model="dialog">
                                    <template v-slot:activator="{ on}">
                                        <v-btn class="ml-2"
                                               color="green"
                                               dark
                                               v-on="on"
                                        >
                                            Generate Sub-Product
                                        </v-btn>
                                    </template>


                                        <divide-product @requestPasswordEvent="$emit('requestPasswordEvent')" :product="product" @close="dialog=false"/>

                                </v-dialog>
                            </v-row>
                        </v-container>


                        <v-container>
                            <form>
                                <v-toolbar color="green" dark dense>
                                    <v-toolbar-title>Temperature ºC</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <v-btn @click="openDialog(product.temperature,'temperature','Temperature ºC')"
                                           icon
                                           v-if="this.$store.state.user.role=='customer'||this.$store.state.user.role==null?'':'mdi-pencil'">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn @click="callRoutePropertyDetails(product.recordId,'temperature')"
                                           icon
                                           v-if="this.$store.state.user.role=='customer'||this.$store.state.user.role==null?'':'mdi-folder-clock'">
                                        <v-icon>mdi-folder-clock</v-icon>
                                    </v-btn>
                                </v-toolbar>
                                <v-container>
                                    <v-text-field
                                            outlined
                                            readonly
                                            v-model="product.temperature==null?'N/A':product.temperature"
                                    />
                                </v-container>
                                <v-toolbar color="green" dark dense>
                                    <v-toolbar-title>Humidity kg/m³</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <v-btn @click="openDialog(product.humidity,'humidity','Humidity kg/m³')"
                                           icon
                                           v-if="this.$store.state.user.role=='customer'||this.$store.state.user.role==null?'':'mdi-pencil'">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn @click="callRoutePropertyDetails(product.recordId,'humidity')"
                                           icon
                                           v-if="this.$store.state.user.role=='customer'||this.$store.state.user.role==null?'':'mdi-folder-clock'">
                                        <v-icon>mdi-folder-clock</v-icon>
                                    </v-btn>
                                </v-toolbar>
                                <v-container>
                                    <v-text-field
                                            outlined
                                            readonly

                                            v-model="product.humidity==null?'N/A':product.humidity"
                                    />
                                </v-container>
                                <v-toolbar color="green" dark dense>
                                    <v-toolbar-title>CO2</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <v-btn @click="openDialog(product.humidity,'co2','CO2')"
                                           icon
                                           v-if="this.$store.state.user.role=='customer'||this.$store.state.user.role==null?'':'mdi-pencil'">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn @click="callRoutePropertyDetails(product.recordId,'co2')"
                                           icon
                                           v-if="this.$store.state.user.role=='customer'||this.$store.state.user.role==null?'':'mdi-folder-clock'">
                                        <v-icon>mdi-folder-clock</v-icon>
                                    </v-btn>
                                </v-toolbar>
                                <v-container>
                                    <v-text-field
                                            outlined
                                            readonly
                                            v-model="product.co2==null?'N/A':product.co2"

                                    />
                                </v-container>
                                <v-toolbar color="green" dark dense>
                                    <v-toolbar-title>Shock</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <v-btn @click="openShockDialog(product.acceleration,product.duration,'acceleration','duration')"
                                           icon
                                           v-if="this.$store.state.user.role=='customer'||this.$store.state.user.role==null?'':'mdi-pencil'">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn @click="callRoutePropertyDetails(product.recordId,'shock')"
                                           icon
                                           v-if="this.$store.state.user.role=='customer'||this.$store.state.user.role==null?'':'mdi-folder-clock'">
                                        <v-icon>mdi-folder-clock</v-icon>
                                    </v-btn>
                                </v-toolbar>
                                <v-container>
                                    <v-text-field
                                            label="Acceleration"
                                            outlined
                                            readonly
                                            v-model="product.acceleration==null?'N/A':product.acceleration"

                                    />

                                    <v-text-field
                                            label="Duration"
                                            outlined
                                            readonly
                                            v-model="product.duration==null?'N/A':product.duration"

                                    />
                                </v-container>
                                <v-toolbar color="green" dark dense>
                                    <v-toolbar-title>Tilt</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <v-btn @click="openTiltDialog(product.tiltX,product.tiltY,'tiltX','tiltY')"
                                           icon
                                           v-if="this.$store.state.user.role=='customer'||this.$store.state.user.role==null?'':'mdi-pencil'">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn @click="callRoutePropertyDetails(product.recordId,'tilt')"
                                           icon
                                           v-if="this.$store.state.user.role=='customer'||this.$store.state.user.role==null?'':'mdi-folder-clock'">
                                        <v-icon>mdi-folder-clock</v-icon>
                                    </v-btn>
                                </v-toolbar>
                                <v-container>
                                    <v-text-field
                                            label="X"
                                            outlined
                                            readonly
                                            v-model="product.tiltX==null?'N/A':product.tiltX"

                                    />
                                    <v-text-field
                                            label="Y"
                                            outlined
                                            readonly
                                            v-model="product.tiltY==null?'N/A':product.tiltY"

                                    />
                                </v-container>
                                <v-toolbar color="green" dark dense>
                                    <v-toolbar-title>Localization</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <v-btn @click="openLocalizationDialog(product.latitude,product.longitude,'latitude','longitude')"
                                           icon
                                           v-if="this.$store.state.user.role=='customer'||this.$store.state.user.role==null?'':'mdi-pencil'">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn @click="callRoutePropertyDetails(product.recordId,'location')"
                                           icon
                                           v-if="this.$store.state.user.role=='customer'||this.$store.state.user.role==null?'':'mdi-folder-clock'">
                                        <v-icon>mdi-folder-clock</v-icon>
                                    </v-btn>
                                </v-toolbar>
                                <v-container>
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
                                </v-container>
                            </form>
                        </v-container>
                    </v-card>
                </v-col>

            </v-row>
        </v-container>
        <v-dialog max-width="600" v-model="dialogTransfer">

            <v-card fluid>
                <v-container>

                    <v-select
                            :items="users"
                            :menu-props="{ top: true, offsetY: true }"
                            item-text="name"
                            item-value="publicKey"
                            label="Select User"
                            outlined
                            v-model="publicKey"

                    ></v-select>

                    <v-card-actions class="justify-center">

                        <v-btn
                                @click="cancel"
                                color="grey darken-1"
                        >
                            Cancel
                        </v-btn>
                        <v-btn @click="submit" class="mr-4 ml-4" color="green darken-1">Transfer</v-btn>
                    </v-card-actions>
                </v-container>
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
                                  label="X"
                                  v-model="tiltX"

                    />
                    <v-text-field :error-messages="doublePropsErrors2"
                                  @blur="$v.tiltY.$touch()"
                                  @input="$v.tiltY.$touch()"
                                  class="ml-4 mr-4"
                                  label="Y"
                                  v-model="tiltY"

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
                                  label="Acceleration"
                                  v-model="acceleration"

                    />
                    <v-text-field :error-messages="doublePropsErrors2"
                                  @blur="$v.duration.$touch()"
                                  @input="$v.duration.$touch()"
                                  class="ml-4 mr-4"
                                  label="Duration"
                                  v-model="duration"

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
                                  label="X"
                                  v-model="latitude"

                    />
                    <v-text-field :error-messages="doublePropsErrors2"
                                  @blur="$v.longitude.$touch()"
                                  @input="$v.longitude.$touch()"
                                  class="ml-4 mr-4"
                                  label="Y"
                                  v-model="longitude"

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
  import { email, maxLength, minLength, numeric, between, decimal, required, sameAs } from 'vuelidate/lib/validators'
  import { SnotifyPosition } from 'vue-snotify'

  const payloads = require('../services/payloads')
  const transactions = require('../services/transactions')

  export default {
    validations () {
      return {
        valueUpdate: this.rules,
        tiltX: {
          minLength: minLength(1),
          maxLength: maxLength(9),
          decimal
        },
        tiltY: {
          minLength: minLength(1),
          maxLength: maxLength(9),
          decimal
        },
        acceleration:
          {
            minLength: minLength(1),
            maxLength: maxLength(9),
            decimal
          },
        duration:
          {
            minLength: minLength(1),
            maxLength: maxLength(9),
            decimal
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
      }
    },
    data: () => ({
      dialog: false,
      submitStatus: null,
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
        humidity: '',
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
      humidity: '',
      co2: '',
      acceleration: '',
      duration: '',
      tiltX: '',
      tiltY: '',
      users: [],
      role: 'owner',
      publicKey: '',
      dialogTransfer: '',
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
      callRoutePropertyDetails (recordId, name) {
        this.$router.push('/propertyDetails/' + recordId + '/property/' + name)
      },

      handleErrors (error) {
        this.$emit('errorEvent', error)
      },
      filterUserRole (users) {
        let role = this.$store.state.user.role

        if (role == 'admin') {
          this.users = users
        } else if (role == 'distributor') {
          this.users = users.filter(function (user) {
            return user.role == 'retailer'
          })
        } else if (role == 'retailer') {
          this.users = users.filter(function (user) {
            return user.role == 'customer'
          })
        } else if (role == 'producer') {
          this.users = users.filter(function (user) {

            return user.role == 'distributor'
          })
        }

      },
      getUsers () {
        axios.get('/agents').then(response => {
          this.filterUserRole(response.data)
        }).catch(error => {this.$emit('errorEvent', error.response.data.error)})
      },

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
            this.product.size = parsing.toFloat(size)
          }
          let weight = getPropertyValue(response.data, 'weight')
          if (weight !== null) {
            this.product.weight = parsing.toFloat(weight)
          }
          let harvestDate = getPropertyValue(response.data, 'harvestDate')
          if (harvestDate !== null) {
            var date = new Date(harvestDate * 1000)
            this.product.harvestDate = date.toISOString().substr(0, 10)
          }
          let expirationDate = getPropertyValue(response.data, 'expirationDate')
          if (expirationDate !== null) {
            var date1 = new Date(expirationDate * 1000)
            this.product.expirationDate = date1.toISOString().substr(0, 10)
          }
          let packingDate = getPropertyValue(response.data, 'packingDate')
          if (packingDate !== null) {
            var date2 = new Date(packingDate * 1000)
            this.product.packingDate = date2.toISOString().substr(0, 10)
          }
          let temperature = getPropertyValue(response.data, 'temperature')
          if (temperature !== null) {
            this.product.temperature = parsing.toFloat(temperature)
          }
          let humidity = getPropertyValue(response.data, 'humidity')
          if (humidity !== null) {
            this.product.humidity = parsing.toFloat(humidity)
          }
          let co2 = getPropertyValue(response.data, 'co2')
          if (co2 !== null) {
            this.product.co2 = parsing.toFloat(co2)
          }
          let location = getPropertyValue(response.data, 'location')
          if (location !== null) {
            this.product.latitude = parsing.toFloat(location.latitude)
            this.product.longitude = parsing.toFloat(location.longitude)
          }
          let tilt = getPropertyValue(response.data, 'tilt')
          if (tilt !== null) {
            tilt = JSON.parse(tilt)
            this.product.tiltX = parsing.toFloat(tilt.x)
            this.product.tiltY = parsing.toFloat(tilt.y)
          }
          let shock = getPropertyValue(response.data, 'shock')
          if (shock !== null) {
            shock = JSON.parse(shock)
            this.product.acceleration = parsing.toFloat(shock.accel)
            this.product.duration = parsing.toFloat(shock.duration)
          }
        }).catch(error => {this.$emit('errorEvent', error.response.data.error)})
      },
      updateProperty (record, value) {
        let updatePayload = payloads.updateProperties({
          recordId: record,
          properties: [value]
        })
        this.$snotify.async('Updating property in the blockchain', 'Updating Property',
          () => {
            return new Promise((resolve, reject) => {
              return transactions.submit([updatePayload], true)
                .then((response) => {
                  console.log(response)
                  if (response.status && response.type === undefined) {
                    setTimeout(() => resolve({
                        title: 'Success',
                        body: 'Successfully updated property',
                        config: {
                          showProgressBar: true,
                          closeOnClick: true,
                          timeout: 8000
                        }
                      }
                    ), 2000)
                    this.getProduct()
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
      cancel () {
        this.dialogTransfer = false
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
        this.$snotify.async('Working on your proposal...', 'Sending Proposal',
          () => {
            return new Promise((resolve, reject) => {
              return transactions.submit([transferPayload], true)
                .then((response) => {
                  console.log(response)
                  if (response.status && response.type === undefined) {
                    setTimeout(() => resolve({

                        title: 'Success',
                        body: 'Successfully submitted proposal',
                        config: {
                          showProgressBar: true,
                          closeOnClick: true,
                          timeout: 8000
                        }
                      }
                    ), 2000)
                    let proposal = {
                      toPublicKey: publicKey,
                      product: recordId,
                      fromPublicKey: this.$store.state.user.publicKey
                    }
                    this.$socket.client.emit('newProposal', proposal)
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
          numberValue: parsing.toInt(this.valueUpdate),
          dataType: payloads.updateProperties.enum.NUMBER
        })
      },
      reportHumidity () {
        this.updateProperty(this.recordId, {
          name: 'humidity',
          numberValue: parsing.toInt(this.valueUpdate),
          dataType: payloads.updateProperties.enum.NUMBER
        })
      },
      reportCo2 () {
        this.updateProperty(this.recordId, {
          name: 'co2',
          numberValue: parsing.toInt(this.valueUpdate),
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
      openTransferDialog () {
        this.dialogTransfer = true
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
        this.dialogTransfer = false
      },
      submitProperty () {
        _.set(this.key, this.valueUpdate)
        if (this.key == 'temperature') {
          this.reportTemperature()
        } else if (this.key == 'humidity') {
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
          !this.$v.valueUpdate.maxLength && errors.push('The Temperature should not be more that 9 characters long')
          !this.$v.valueUpdate.decimal && errors.push('The Temperature must be a decimal number.')

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'

          return errors
        }
        if (this.key === 'co2') {

          if (!this.$v.valueUpdate.$dirty) return errors
          !this.$v.valueUpdate.minLength && errors.push('The CO2 must be at most 1 characters long')
          !this.$v.valueUpdate.maxLength && errors.push('The CO2 should not be more that 9 characters long')
          !this.$v.valueUpdate.decimal && errors.push('The CO2 must be a decimal number.')

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'

          return errors
        }
        if (this.key === 'humidity') {

          if (!this.$v.valueUpdate.$dirty) return errors
          !this.$v.valueUpdate.minLength && errors.push('The Humidity must be at most 1 characters long')
          !this.$v.valueUpdate.maxLength && errors.push('The Humidity should not be more that 9 characters long')
          !this.$v.valueUpdate.decimal && errors.push('The Humidity must be a decimal number.')

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
          !this.$v.tiltX.maxLength && errors.push('The X should not be more that 9 characters long')
          !this.$v.tiltX.decimal && errors.push('The X must be a decimal number.')

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'

          return errors
        }

        if (this.key1 === 'acceleration') {
          if (!this.$v.acceleration.$dirty) return errors
          !this.$v.acceleration.minLength && errors.push('The acceleration must be at most 1 characters long')
          !this.$v.acceleration.maxLength && errors.push('The acceleration should not be more that 9 characters long')
          !this.$v.acceleration.decimal && errors.push('The acceleration must be a decimal number.')

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'

          return errors
        }

        if (this.key1 === 'latitude') {
          if (!this.$v.latitude.$dirty) return errors
          !this.$v.latitude.minLength && errors.push('The latitude must be at most 1 characters long')
          !this.$v.latitude.maxLength && errors.push('The latitude should not be more that 9 characters long')
          !this.$v.latitude.decimal && errors.push('The latitude must be a decimal number.')
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
          !this.$v.tiltY.maxLength && errors.push('The Y should not be more that 9 characters long')
          !this.$v.tiltY.decimal && errors.push('The Y must be a decimal number.')

          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'

          return errors
        }

        if (this.key2 === 'duration') {
          if (!this.$v.duration.$dirty) return errors
          !this.$v.duration.minLength && errors.push('The duration must be at most 1 characters long')
          !this.$v.duration.maxLength && errors.push('The duration should not be more that 9 characters long')
          !this.$v.duration.decimal && errors.push('The duration must be a decimal number.')
          if (errors.length !== 0) this.submitStatus = 'ERROR'
          else this.submitStatus = 'OK'
          return errors
        }

        if (this.key2 === 'longitude') {
          if (!this.$v.longitude.$dirty) return errors
          !this.$v.longitude.minLength && errors.push('The longitude must be at most 1 characters long')
          !this.$v.longitude.maxLength && errors.push('The longitude should not be more that 9 characters long')
          !this.$v.longitude.decimal && errors.push('The longitude must be a decimal number.')
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
              maxLength: maxLength(9),
              decimal
            }
          case 'co2':
            return {
              minLength: minLength(1),
              maxLength: maxLength(9),
              decimal
            }
          case 'humidity':
            return {
              minLength: minLength(1),
              maxLength: maxLength(9),
              decimal
            }

        }

      }
    },

    beforeMount: function () {
      this.getProduct()
      this.getUsers()
    },
  }

</script>

<style scoped>

</style>