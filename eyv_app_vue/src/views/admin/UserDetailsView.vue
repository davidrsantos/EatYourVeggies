<template>
    <div v-if="user">
        <user-details :user-prop="user" v-on:errorEvent="handleErrors"></user-details>
        <v-card class="mx-auto mt-5" max-width="800"   v-show="this.$store.state.user!=null && this.$store.state.user.role ==='admin'">
            <v-container >
                <v-row align="center" justify="center">
                   <div class="mr-2">(Admin)This user is:  </div>
                    <v-btn :color="getColor(user.active)"
                           @click="changeStatus(user)"
                           dark
                           > {{getUserStatus(user.active) }}
                    </v-btn>
                </v-row>
            </v-container>
        </v-card>
    </div>
</template>

<script>
  export default {
    name: 'UserDetailsView',
    data: () => ({
      user: null,
    }),
    methods: {

      changeStatus (user) {

        let statusUpdate = {
          'active': null
        }
        if (user.active === 1) {
          statusUpdate.active = 0
        } else if (user.active === 0) {
          statusUpdate.active = 1
        }

        return axios.patch('users/' + user.publicKey, statusUpdate)
          .then(response => {
            this.getUser()
          })
          .catch(error => {
            console.error(error)
            this.isLoading = false
            if (error.response && error.response.data.errors) {
              console.error(error)
              this.handleErrors(error.response.data.errors)
            } else {
              this.errors = ['Problem connecting server or unknown error']
              this.showErrors = true
            }
          })
      },
      getUserStatus (active) {
        if (active) {
          return 'Active'
        }
        return 'Not Active'
      },
      getColor (active) {
        if (active === 1) return 'green'
        else return 'red'
      },

      getUser () {
        axios.get(`agents/${this.$route.params.publicKey}`)
          .then(res => {
            this.user = res.data
          }).catch(error => {
          this.$emit('errorEvent', error)
        })
      },
      handleErrors (error) {
        console.error(error)
        this.$emit('errorEvent', error)
      },
    },
    created () {
      this.getUser()
    }
  }
</script>

<style scoped>

</style>