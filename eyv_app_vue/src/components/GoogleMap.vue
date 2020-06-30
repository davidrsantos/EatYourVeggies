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
                :zoom="12"
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
    props: ['locations','polylinesLocations', 'recordId'],
    name: "GoogleMap",
    data () {
      return {
        localizations: this.locations,
        polylines: this.polylinesLocations,
        record: this.recordId,
        // default to Montreal to keep it simple
        // change this to whatever makes sense
        center: { lat: this.polylinesLocations[this.polylinesLocations.length-1].lat, lng: this.polylinesLocations[this.polylinesLocations.length-1].lng },
        markers: [],
        markersPolyline: [],
        currentPlace: null,
        loading :  false
      };
    },

    mounted () {
      console.log('location')
      console.log(this.location)
     // this.loading = true
      this.geolocate();
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
          console.log('center')
          console.log(this.center)
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
        return transactions.submit([updatePayload], true).then(() => {
          console.log('Successfully submitted property update')
          this.getProduct();
        }).catch(error=>{this.$emit('errorEvent', error)})
      },
      geolocate: function () {
        navigator.geolocation.getCurrentPosition(position => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        });
        /*
        let bounds = new google.maps.LatLngBounds()//todo zoom no mapa
        this.markers.forEach(position => bounds.extend(position))
        map.fitBounds(bounds)
        */
      },
      addHistoryLocations () {
        this.markers = this.localizations;
        this.markersPolyline = this.polylines;
        console.log('markersPolyline')
        console.log(this.markersPolyline)
      }
    }
  }
</script>