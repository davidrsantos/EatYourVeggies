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
      getPropertyValues () {//todo
        console.log(this.recordId + '    ' + this.name)
        axios.get(`records/${this.recordId}/${this.name}`)
          .then(res => {
            this.configureTypeProperty(res.data)
          })
      },

      configureTypeProperty: function (property) {
        //if (property.dataType === 'NUMBER') {
        // return m(LineGraphWidget, { updates: property.updates })
        // }
        if (property.name === 'shock') {
          property.updates.forEach(property => {

            let propertyValue = parsing.floatifyValue(property.value)

            this.y_values.push(propertyValue.duration === 0 ? 0 : propertyValue.accel / propertyValue.duration)
            this.x_values.push(this.formatTimestamp(property.timestamp))

          })

          this.datacollection_line.datasets[0].data = this.y_values
          this.datacollection_line.labels = this.x_values
          this.loaded=true
          console.log('y_values' + this.y_values)
          console.log('x_values' + this.x_values)
        }
        if (property.name === 'tilt') {
          let amplitudes
          for (let update in property.updates) {
            amplitudes.push(Math.sqrt(update.value.x ** 2 + update.value.y ** 2))
          }
          console.log(amplitudes)
        }
        /*
               if (property.name === 'shock') {
                  return m(LineGraphWidget, {
                    updates: property.updates.map(update => {
                      const degree = update.value.duration === 0
                        ? 0
                        : update.value.accel / update.value.duration
                      return _.assign({}, update, {value: degree.toFixed(3)})
                    })
                  })
                }

                return null*/
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