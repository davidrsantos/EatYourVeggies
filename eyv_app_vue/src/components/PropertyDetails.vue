<template>
    <v-container>
        <v-card
                class="pa-5"
                outlined
                tile
        >
            <v-toolbar color="primary" dark>
                <v-toolbar-title>{{this.name.charAt(0).toUpperCase() + name.slice(1)}} History</v-toolbar-title>
            </v-toolbar>
            <line-chart v-if="loaded" :chart-data="datacollection_line"></line-chart>
        </v-card>
    </v-container>
</template>

<script>
  import lineChart from './LineChart.vue'
  import * as moment from 'moment'

  const parsing = require('../services/parsing')
  export default {
    components: {
      lineChart
    },
    data: () => ({
      loaded:false,
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
]
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
          }).catch(function (error) {
          console.log(error)
          this.loading = false
        })
      },

      configureTypeProperty: function (property) {
        if (property.dataType === 'NUMBER') {
          property.updates.forEach(property => {

            let propertyValue = property.value

            this.y_values.push(propertyValue)
            this.x_values.push(this.formatTimestamp(property.timestamp))

          })
          this.datacollection_line.datasets[0].data = this.y_values
          this.datacollection_line.labels = this.x_values
          this.loaded=true
         }
        if (property.name === 'shock') {
          property.updates.forEach(property => {

            let propertyValue = parsing.floatifyValue(property.value)

            this.y_values.push(propertyValue.duration === 0 ? 0 : propertyValue.accel / propertyValue.duration)
            this.x_values.push(this.formatTimestamp(property.timestamp))

          })
          this.datacollection_line.datasets[0].data = this.y_values
          this.datacollection_line.labels = this.x_values
          this.loaded=true

        }
        if (property.name === 'tilt') {
          property.updates.forEach(property => {

            let propertyValue = parsing.floatifyValue(property.value)

            this.y_values.push(Math.sqrt(propertyValue.x ** 2 + propertyValue.y ** 2))
            this.x_values.push(this.formatTimestamp(property.timestamp))

          })
          this.datacollection_line.datasets[0].data = this.y_values
          this.datacollection_line.labels = this.x_values
          this.loaded=true
        }

      },
      formatTimestamp (sec) {
        if (!sec) {
          sec = Date.now() / 1000
        }
        return moment.unix(sec).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    mounted () {
      this.getPropertyValues()
    }
  }
</script>