<template>
    <v-app id="inspire">

        <v-app-bar app clipped-left color="#66BB6A" dark elevate-on-scroll>

            <v-spacer></v-spacer>
            <v-toolbar-title>Eat Your Veggies</v-toolbar-title>
            <v-spacer></v-spacer>


            <template v-if="this.$store.state.token && (this.$store.state.user!=null)">
                <v-toolbar-title>({{typeOfUser(this.$store.state.user.role)}}) {{this.$store.state.user.username}}
                </v-toolbar-title>
                <v-btn @click="logout" class="ma-4">Logout</v-btn>
            </template>


        </v-app-bar>

        <v-footer app absolute color="#66BB6A">

            <span class="white--text">&copy;Instituto Politécnico de Leiria - 2020 - Projeto Informático  </span>
        </v-footer>

        <v-content app
        >
            <v-container>
                <router-view @errorEvent="handleError"/>
            </v-container>
        </v-content>
        <v-navigation-drawer app clipped expand-on-hover mini-variant
                             permanent
                             v-if="this.$store.state.token && (this.$store.state.user!=null)"
        >

            <drawer/>

        </v-navigation-drawer>
        <errorDialog :error="error" :show-errors="showErrors" v-on:closeDialog="closeDialog"/>
    </v-app>
</template>

<script>
  import * as api from './services/api'
  import * as transactions from './services/transactions'

  const { setBatcherPubkey } = require('./services/transactions')

  export default {
    name: 'App',
    props: {
      source: String
    },
    data: () => ({

      mini: false,
      showErrors: false,
      error: null,
    }),
    mounted () {
      this.$store.commit('loadTokenAndUserFromSession') //this keeps the user logged
      setBatcherPubkey()
      if (this.$store.state.user) {
        this.$router.push('dashboard')
        // this.$socket.emit('user_enter', this.$store.state.user); //TODO this can be useful for a broker
      }
    },

    methods: {
      closeDialog () {
        this.showErrors = false
      },
      handleError (error) {
        console.error('An Error occurrence: ' + error)
        this.error = error
        this.showErrors = true
      },

      logout () {
        this.$store.commit('clearUserAndToken')
        api.clearAuth()
        transactions.clearPrivateKey()
        this.$router.push('welcome')
      },
      typeOfUser (role) {

        switch (role) {
          case 'admin':
            return 'Administrator'
          case 'producer':
            return 'Producer'
          case 'distributor':
            return 'Distributor'
          case 'retailer':
            return 'Retailer'
          case 'customer':
            return 'Customer'
          default:
            return 'Unknown'
        }
      }
    }
  }
</script>