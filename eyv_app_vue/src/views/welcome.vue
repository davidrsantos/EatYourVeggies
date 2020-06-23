<template>

    <v-card  height="85vh" width="100%" class="mt-4 mb-4"
    >

        <v-img align="center" class="white--text  align-center " height="100%" src="@/assets/background.jpg">

            <v-card-title class="display-4 py-3 justify-center flex  font-weight-black">Welcome to Eat Your Veggies
            </v-card-title>

            <v-btn light to="/login" x-large>Login</v-btn>

                <v-btn  light to="/signup" x-large>SignUp</v-btn>

            <v-row class="justify-center">
                <v-btn @click="role" light  x-large>View available products
                </v-btn>

            </v-row>


        </v-img>
    </v-card>

</template>
<script>
  export default {
    methods: {
      role(){
        console.log('click')
        this.$store.commit('setUser', {role:'viewer'})
        this.$router.push('managerProducts')
      }
    }
  }
</script>