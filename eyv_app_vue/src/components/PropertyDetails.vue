<template>
    <v-col>
        <v-toolbar color="primary" dark>
            <v-toolbar-title>{{this.name.charAt(0).toUpperCase() + name.slice(1)}} History</v-toolbar-title>
        </v-toolbar>
        <v-row>
            <v-container v-if="this.name=='location'">
                <google-map :locations="this.locations"  :polylines-locations="this.polylines" :record-id="this.recordId"/>
            </v-container>
    <v-container v-else>
        <v-card
                class="pa-5"
                outlined
                tile
        >
            <line-chart v-if="loaded" :chart-data="datacollection_line"></line-chart>
        </v-card>
    </v-container>
        </v-row>
        <v-row>
            <v-container>
                <v-card>
                    <v-card-title>
                        Update History
                        <v-spacer></v-spacer>
                        <v-text-field
                                append-icon="mdi-magnify"
                                hide-details
                                label="Search"
                                single-line
                                v-model="search"
                        ></v-text-field>
                    </v-card-title>

                    <v-data-table :headers="headers"
                                  :items="updates"
                                  :loading="loading"
                                  :search="search"
                                  fixed-header
                                  item-key="key"
                                  sort-by="timestamp"

                    >
                        <template v-slot:item.value="{ item }">
                            {{format(item.value)}}
                        </template>
                        <template v-slot:item.timestamp="{ item }">
                            {{formatTimestamp(item.timestamp)}}
                        </template>
                    </v-data-table>
                </v-card>
            </v-container>

        </v-row>
    </v-col>
</template>

<script>
  import lineChart from './LineChart.vue'
  import * as moment from 'moment'
  import * as parsing from '../services/parsing'

  export default {
    components: {
      lineChart
    },
    data: () => ({
      search: '',
      headers: [
        { text: 'Value', value:'value'},
        { text: 'Reporter', value: 'reporter.name'},
        { text: 'Time', value: 'timestamp'}
        ,

      ],
      locations: [],
      polylines: [],
      loaded:false,
      loading:true,
      updates: [],
      y_values: [],
      x_values: [],
      property: null,
      recordId: '',
      name: '',
      datacollection_line: {
        //Data to be represented on x-axis
        labels: [],
        datasets:[
          {
            label: 'Value',
            backgroundColor: '#33b3f8',
            //Data to be represented on y-axis
            data: []
          }
        ],
      },
    }),
    created: function () {
      if (this.$route.params.recordId != null) {
        this.recordId = this.$route.params.recordId
      }
      if (this.$route.params.name != null) {
        this.name = this.$route.params.name
      }
    },
    methods: {
      getPropertyValues () {
        axios.get(`records/${this.recordId}/${this.name}`)
          .then(res => {
            this.configureTypeProperty(res.data)
            this.loading=false
          }).catch(function (error) {
          console.log(error)
          this.loading = false
          this.loaded = false
        })
      },

      configureTypeProperty: function (property) {
        this.updates = property.updates
        let propertyValue;
        let x_valuesAux = []

        if (property.dataType === 'NUMBER') {
          property.updates.forEach(property => {

            propertyValue = (parsing.toFloat(property.value)).toFixed(3)
            this.y_values.push(propertyValue)
            x_valuesAux.push(property.timestamp)
          })
          this.updates.forEach(update=> {
           update.value = parsing.floatifyValue(update.value).toFixed(3)
          })
        }
        if (property.dataType === 'LOCATION') {
          this.updates.forEach(update=> {
            this.locations.push({ position: {lat:parsing.toFloat(update.value.latitude),lng:parsing.toFloat(update.value.longitude)} })
            this.polylines.push({lat:parsing.toFloat(update.value.latitude),lng:parsing.toFloat(update.value.longitude)})
          })
        }
        if (property.name === 'shock') {
          property.updates.forEach(property => {

            propertyValue = parsing.floatifyValue(property.value)
            this.y_values.push((propertyValue.duration === 0 ? 0 : propertyValue.accel / propertyValue.duration).toFixed(3))
            x_valuesAux.push(property.timestamp)

          })

        }
        if (property.name === 'tilt') {
          property.updates.forEach(property => {

            propertyValue = parsing.floatifyValue(property.value)
            this.y_values.push((Math.sqrt(propertyValue.x ** 2 + propertyValue.y ** 2).toFixed(3)))
            x_valuesAux.push(property.timestamp)

          })
        }
        this.datacollection_line.datasets[0].data = this.y_values.reverse()
        x_valuesAux = x_valuesAux.reverse()

        x_valuesAux.forEach(value => {
          this.x_values.push(this.formatTimestamp(value))
        })
        this.datacollection_line.labels = this.x_values
        this.loaded=true
      },
      formatTimestamp (sec) {
        if (!sec) {
          sec = Date.now() / 1000
        }
        return moment.unix(sec).format('DD-MM-YYYY, HH:mm:ss')
      },
      format(value){

       if(value.hasOwnProperty('latitude')) {
         return "Latitude: " + value.latitude + ", Longitude: " + value.longitude
       }
         var d = JSON.parse(value)

        if(d.hasOwnProperty('accel')) {
          return "Accel: " + parsing.toFloat(d.accel) + ", Duration: " + parsing.toFloat(d.duration)
        }else if(d.hasOwnProperty('x')){
          return "X: " + parsing.toFloat(d.x ) + ", Y: " + parsing.toFloat(d.y)
        }else{
          return value
        }
      }
    },
    mounted () {
      this.getPropertyValues()
    }
  }
</script>