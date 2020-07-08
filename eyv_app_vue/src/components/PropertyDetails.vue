<template>
    <v-col>
        <v-toolbar color="primary" dark>
            <v-toolbar-title>{{this.name.charAt(0).toUpperCase() + name.slice(1)}} History</v-toolbar-title>
        </v-toolbar>
        <v-row>
            <v-container v-if="this.name=='location' && centerr">
                <google-map :centerr="centerr" :locations="this.locations" :polylines-locations="this.polylines"
                            :record-id="this.recordId" v-on:refreshList="refreshList" @requestPasswordEvent="$emit('requestPasswordEvent')"/>
            </v-container>
            <v-container v-else-if="this.name=='temperature' || this.name=='humidity'|| this.name=='co2' || this.name=='shock' || this.name=='tilt'">
                <v-card
                        class="pa-5"
                        max-height="800"
                        outlined
                        tile
                >
                    <line-chart :chart-data="datacollection_line" :options="options" :styles="myStyles"
                                v-if="loaded"></line-chart>
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
        { text: 'Value', value: 'value' },
        { text: 'Reporter', value: 'reporter.name' },
        { text: 'Time', value: 'timestamp' }
        ,

      ],
      locations: [],
      polylines: [],
      loaded: false,
      loading: true,
      updates: [],
      y_values: [],
      x_values: [],
      property: null,
      centerr: null,
      recordId: '',
      name: '',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        fill: false,
        scales: {
          yAxes: [{
            stacked: false
          }]
        }
      },
      datacollection_line: {
        //Data to be represented on x-axis
        labels: [],
        datasets: [
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
    computed: {
      myStyles () {
        return {
          height: `500px`,
          position: 'relative',
          fill: false
        }
      }
    },
    methods: {
      refreshList () {
        this.polylines = []
        this.locations = []
        this.getPropertyValues()
      },

      getPropertyValues () {
        axios.get(`records/${this.recordId}/${this.name}`)
          .then(res => {
            this.configureTypeProperty(res.data)
            this.loading = false
          }).catch(function (error) {
          console.error(error)
          this.loading = false
          this.loaded = false
        })
      },

      configureTypeProperty: function (property) {
        this.updates = property.updates
        let propertyValue
        let x_valuesAux = []

        if (property.dataType === 'NUMBER') {
          property.updates.forEach(property => {

            propertyValue = (parsing.toFloat(property.value)).toFixed(3)
            this.y_values.push(propertyValue)
            x_valuesAux.push(property.timestamp)
          })
          this.updates.forEach(update => {
            update.value = parsing.floatifyValue(update.value).toFixed(3)
          })
        }
        if (property.dataType === 'LOCATION') {
          this.updates.forEach(update => {
            this.locations.push({
              position: {
                lat: parsing.toFloat(update.value.latitude),
                lng: parsing.toFloat(update.value.longitude)
              }
            })
            this.polylines.unshift({
              lat: parsing.toFloat(update.value.latitude),
              lng: parsing.toFloat(update.value.longitude)
            })
          })
          this.centerr = this.polylines[this.polylines.length - 1]
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
        this.loaded = true
      },
      formatTimestamp (sec) {
        if (!sec) {
          sec = Date.now() / 1000
        }
        return moment.unix(sec).format('DD-MM-YYYY, HH:mm:ss')
      },
      format (value) {
        if(this.name=='name'||this.name=='classification'||this.name=='origin'||this.name=='cultivationProcess'||this.name=='size'||this.name=='weight'){
          return value
        }else if(this.name=='harvestDate'||this.name=='packingDate'||this.name=='expirationDate'){
          return this.formatTimestamp(value)
        }
        if (value.hasOwnProperty('latitude')) {
          return 'Latitude: ' + value.latitude + ', Longitude: ' + value.longitude
        }
        var d = JSON.parse(value)

        if (d.hasOwnProperty('accel')) {
          return 'Accel: ' + parsing.toFloat(d.accel) + ', Duration: ' + parsing.toFloat(d.duration)
        } else if (d.hasOwnProperty('x')) {
          return 'X: ' + parsing.toFloat(d.x) + ', Y: ' + parsing.toFloat(d.y)
        } else {
          return value
        }
      }
    },
    mounted () {
      this.getPropertyValues()
    }
  }
</script>