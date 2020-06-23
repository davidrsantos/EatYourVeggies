<template>
    <div>
        <div>
            <label>
                <gmap-autocomplete
                        @place_changed="setPlace">
                </gmap-autocomplete>
                <button @click="addMarker">Add</button>
            </label>
            <br/>

        </div>
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
        </gmap-map>
    </div>
</template>

<script>
  import * as parsing from '../services/parsing'

  export default {
    props:['locations'],
    name: "GoogleMap",
    data() {
      return {
        localizations: this.locations,
        // default to Montreal to keep it simple
        // change this to whatever makes sense
        center: { lat: 45.508, lng: -73.587 },
        markers: [],
        places: [],
        currentPlace: null,
      };
    },

    mounted() {
      this.geolocate();
      this.addHistoryLocations(this.localizations);
    },

    methods: {
      // receives a place object via the autocomplete component
      setPlace(place) {
        this.currentPlace = place;
      },
      addMarker() {
        if (this.currentPlace) {
          const marker = {
            lat: this.currentPlace.geometry.location.lat(),
            lng: this.currentPlace.geometry.location.lng()
          };
          this.markers.push({ position: marker });
          console.log('markers verdadeitos')
          console.log(this.markers)
          this.places.push(this.currentPlace);
          this.center = marker;
          this.currentPlace = null;
        }
      },
      geolocate: function() {
        navigator.geolocation.getCurrentPosition(position => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        });
      },
      addHistoryLocations(locations){
       locations.forEach(update=> {
         this.markers.push({ position: {lat:parsing.toFloat(update.latitude),lng:parsing.toFloat(update.longitude)} });
        })
        /*var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < this.markers.length; i++) {
          bounds.extend(this.markers[i]);
        }
        map.fitBounds(bounds);*/
        console.log('markers')
        console.log(this.markers)
      }
    }
  };
</script>