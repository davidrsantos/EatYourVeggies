<template>
    <v-container>
        <v-toolbar
                dense
                width="500"
                height="80"
        >
            <label>
                <gmap-autocomplete placeholder="Search new location" style="width:200%;  height: 50px; border: 1px solid #ccc; text-align: center; display: inline-block;"
                                   @place_changed="setPlace">
                </gmap-autocomplete>
            </label>
            <v-spacer></v-spacer>
            <v-btn color="green" @click="addMarker">Add</v-btn>

        </v-toolbar>
        <br>
        <gmap-map
                :center="center"
                :zoom="5"
                style="width:100%;  height: 400px;"
        >
            <gmap-marker
                    :key="index"
                    v-for="(m, index) in markers"
                    :position="m.position"
                    @click="center=m.position"
            ></gmap-marker>
            <gmap-polyline
                    :path="this.polylinesLocations"
                    :options="{ strokeColor:'#e70808'}">
            </gmap-polyline>
        </gmap-map>

    </v-container>
</template>

<script>
  import * as parsing from '../services/parsing'
  import GoogleMapsLoader from 'google-maps'
  const payloads = require('../services/payloads')
  const transactions = require('../services/transactions')

  export default {
    props: ['locations','polylinesLocations', 'recordId', 'centerr'],
    name: "GoogleMap",
    data () {
      return {
        localizations: this.locations,
        polylines: this.polylinesLocations,
        record: this.recordId,
        center: { lat: this.centerr.lat, lng: this.centerr.lng},
        markers: [],
        markersPolyline: [],
        currentPlace: null,
      };
    },
    mounted () {
      this.addHistoryLocations();
    },

    methods: {
      // receives a place object via the autocomplete component
      setPlace (place) {
        this.currentPlace = place;
      },
      addMarker () {
        if (this.currentPlace) {
          const marker = {
            lat: this.currentPlace.geometry.location.lat(),
            lng: this.currentPlace.geometry.location.lng()
          };
          this.markers.push({ position: marker });
          this.markersPolyline.push({lat:this.currentPlace.geometry.location.lat(),lng: this.currentPlace.geometry.location.lng()})
          this.reportLocalization();
          this.center = marker;
          this.currentPlace = null;
        }
      },

      reportLocalization() {
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
      addHistoryLocations () {
        this.markers = this.localizations;
        this.markersPolyline = this.polylines;
      }
    }
  }
</script>