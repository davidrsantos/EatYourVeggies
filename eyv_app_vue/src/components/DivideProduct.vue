<template>
    <v-container>
        <v-text-field
                :value="product.weight"
                label="Weight (grams)"
                outlined
                readonly

        />

        <v-subheader>Min and max default slider</v-subheader>

        <v-card-text>
            <v-row>
                <v-col class="pr-4">
                    <v-slider
                            :max="max"
                            :min="min"
                            class="align-center"
                            hide-details
                            v-model="slider"
                    >
                        <template v-slot:append>
                            <v-text-field
                                    class="mt-0 pt-0"
                                    hide-details
                                    single-line
                                    style="width: 60px"
                                    type="number"
                                    v-model="slider"
                            ></v-text-field>
                        </template>
                    </v-slider>
                </v-col>
            </v-row>
        </v-card-text>
    </v-container>
</template>

<script>
  export default {
    name: 'DivideProduct',
    props: ['product'],
    data () {
      return {
        min: 1,
        max: this.product.weight,
        slider: 1,
        range: [-20, 70],
      }
    },

    created: function () {

    },
    beforeMount: function () {
      this.getProduct()
      this.getUsers()
    },

  }
</script>

<style scoped>

</style>