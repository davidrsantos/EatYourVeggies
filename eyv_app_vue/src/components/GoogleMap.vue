<template>
    <v-container>
        <v-row>
            <v-col align="center">
                <v-toolbar
                        dense
                        height="80"
                        width="500"
                >
                    <label>
                        <gmap-autocomplete @place_changed="setPlace"
                                           placeholder="Search new location"
                                           style="width:200%;  height: 50px; border: 1px solid #ccc; text-align: center; display: inline-block;">
                        </gmap-autocomplete>
                    </label>
                    <v-spacer></v-spacer>
                    <v-btn @click="addMarker" color="green">Add</v-btn>
                </v-toolbar>
            </v-col>
            <v-col align="center">
                <v-toolbar dense height="100"
                           width="600">
                    <v-text-field :error-messages="LatErrors"
                                  @blur="$v.latitude.$touch()"
                                  @input="$v.latitude.$touch()"
                                  label="Latitude"
                                  outlined
                                  v-model="latitude">
                    </v-text-field>
                    <v-spacer></v-spacer>
                    <v-text-field :error-messages="LngErrors"
                                  @blur="$v.longitude.$touch()"
                                  @input="$v.longitude.$touch()"
                                  label="Longitude"
                                  outlined
                                  v-model="longitude">
                    </v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="submitStatus==='ERROR'" @click="insertLocalization" align="center" color="green">
                        Add
                    </v-btn>
                </v-toolbar>
            </v-col>
        </v-row>
        <br>
        <gmap-map
                :center="center"
                :zoom="5"
                style="width:100%;  height: 400px;"
        >
            <gmap-marker
                    :key="index"
                    :position="m.position"
                    @click="center=m.position"
                    v-for="(m, index) in markers"
            ></gmap-marker>
            <gmap-polyline
                    :options="{ strokeColor:'#e70808'}"
                    :path="this.polylinesLocations">
            </gmap-polyline>
        </gmap-map>

    </v-container>
</template>

<script>
  import * as parsing from '../services/parsing'
  import GoogleMapsLoader from 'google-maps'
  import { maxLength, minLength, between, decimal, required } from 'vuelidate/lib/validators'

  const payloads = require('../services/payloads')
  const transactions = require('../services/transactions')

  export default {
    props: ['locations', 'polylinesLocations', 'recordId', 'centerr'],
    name: 'GoogleMap',
    validations () {
      return {
        latitude: {
          minLength: minLength(1),
          maxLength: maxLength(10),
          decimal,
          between: between(-90, 90)
        },
        longitude:
          {
            minLength: minLength(1),
            maxLength: maxLength(10),
            decimal,
            between: between(-180, 180)
          }
      }
    },
    data () {
      return {
        submitStatus: null,
        latitude: '',
        longitude: '',
        localizations: this.locations,
        polylines: this.polylinesLocations,
        record: this.recordId,
        center: { lat: this.centerr.lat, lng: this.centerr.lng },
        markers: [],
        markersPolyline: [],
        currentPlace: null,
      }
    },
    mounted () {
      this.addHistoryLocations()
    },
    computed: {
      LatErrors () {
        const errors = []

        if (!this.$v.latitude.$dirty) return errors
        !this.$v.latitude.minLength && errors.push('The latitude must be at most 1 characters long')
        !this.$v.latitude.maxLength && errors.push('The latitude should not be more that 10 characters long')
        !this.$v.latitude.decimal && errors.push('The latitude must be a decimal number.')
        !this.$v.latitude.between && errors.push('The latitude must be between -90 and 90.')
        if (errors.length !== 0) this.submitStatus = 'ERROR'
        else this.submitStatus = 'OK'

        return errors
      },
      LngErrors () {
        const errors = []

        if (!this.$v.longitude.$dirty) return errors
        !this.$v.longitude.minLength && errors.push('The longitude must be at most 1 characters long')
        !this.$v.longitude.maxLength && errors.push('The longitude should not be more that 10 characters long')
        !this.$v.longitude.decimal && errors.push('The longitude must be a decimal number.')
        !this.$v.longitude.between && errors.push('The longitude must be between -180 and 180.')
        if (errors.length !== 0) this.submitStatus = 'ERROR'
        else this.submitStatus = 'OK'
        return errors

      }
    },
    methods: {
      // receives a place object via the autocomplete component
      setPlace (place) {
        this.currentPlace = place
      },
      addMarker () {
        if (this.currentPlace) {
          const marker = {
            lat: this.currentPlace.geometry.location.lat(),
            lng: this.currentPlace.geometry.location.lng()
          }
          this.markers.push({ position: marker })
          this.markersPolyline.push({
            lat: this.currentPlace.geometry.location.lat(),
            lng: this.currentPlace.geometry.location.lng()
          })
          this.reportLocalization()
          this.center = marker
          this.currentPlace = null
        }
      },
      insertLocalization () {
        if (this.latitude !== null && this.longitude !== null) {
          const marker = {
            lat: parseFloat(this.latitude),
            lng: parseFloat(this.longitude)
          }
          this.center = marker
          this.markers.push({ position: marker })
          this.markersPolyline.push({
            lat: parseFloat(this.latitude),
            lng: parseFloat(this.longitude)
          })

          this.updateProperty(this.record, {
            name: 'location',
            locationValue: {
              latitude: parsing.toInt(this.latitude),
              longitude: parsing.toInt(this.longitude)
            },
            dataType: payloads.updateProperties.enum.LOCATION
          })

          this.latitude = ''
          this.longitude = ''

        }
      },
      reportLocalization () {
        this.updateProperty(this.record, {
          name: 'location',
          locationValue: {
            latitude: parsing.toInt(this.currentPlace.geometry.location.lat()),
            longitude: parsing.toInt(this.currentPlace.geometry.location.lng())
          },
          dataType: payloads.updateProperties.enum.LOCATION
        })
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
                    this.$emit('refreshList')
                  }
                }).catch(error => {
                  if (error === 'requestPassword') {
                    this.$emit('requestPasswordEvent')
                    reject({
                        title: 'Error',
                        body: '',
                        icon: false,
                        config: {
                          timeout: 1
                        }
                      }
                    )
                  } else {
                    console.log(error)
                    setTimeout(() => reject({
                      title: 'Error',
                      body: error,
                      config: {
                        showProgressBar: true,
                        closeOnClick: true,
                        timeout: 8000
                      }
                    }), 2000)
                  }
                })
            })
          })

      },
      addHistoryLocations () {
        this.markers = this.localizations
        this.markersPolyline = this.polylines
      }
    }
  }
</script>