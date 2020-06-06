<template>
    <v-app id="inspire">

        <v-app-bar app clipped-left color="#66BB6A" dark elevate-on-scroll>

            <v-spacer></v-spacer>
            <v-toolbar-title>Eat Your Veggies</v-toolbar-title>
            <v-spacer></v-spacer>


            <v-menu
                    :close-on-content-click="false"
                    :nudge-width="200"
                    offset-y

            >
                <template v-slot:activator="{ on }">


                    <v-btn
                            class="mr-10"
                            icon
                            v-on="on"
                    >
                        <v-badge
                                :content="notifications.length"
                                :value="notifications"

                                color="red"
                                overlap

                        >
                            <v-icon>mdi-bell</v-icon>
                        </v-badge>
                    </v-btn>


                </template>

                <v-card>
                    <v-card-text>

                        <material-notification :color="item.type" :key="item.message"
                                               class="mb-3"
                                               dismissible
                                               v-for="item in notifications.slice().reverse()"
                        >
                            <strong>{{item.type.toUpperCase()}}</strong> - {{item.message}}
                        </material-notification>

                    </v-card-text>

                </v-card>
            </v-menu>

            <template v-if="this.$store.state.token && (this.$store.state.user!=null)">
                <v-toolbar-title>({{typeOfUser(this.$store.state.user.role)}}) {{this.$store.state.user.username}}
                </v-toolbar-title>

                <v-btn @click="logout" class="ma-4">Logout</v-btn>
            </template>


        </v-app-bar>

        <v-footer absolute app color="#66BB6A">

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
      notifications: [
        { type: 'error', message: 'alguma ioahfjiajsfpia  pioajsfj' }, { type: 'success', message: 'alguma' },
        {
          type: 'warning',
          message: 'alguma'
        },  {
          type: 'warning',
          message: 'alguma'
        }, {
          type: 'warning',
          message: 'algumaalgumaalgumaalgumaalgumaalgumaalgumaalgumaalgumaalgumaalgumaalgumaalgumaalgumaalgumaalguma'
        },
      ]
    }),
    mounted () {
      this.$store.commit('loadTokenAndUserFromSession') //this keeps the user logged
      setBatcherPubkey()
      if (this.$store.state.user) {
        this.$socket.emit('user_enter', this.$store.state.user);
        this.$router.push('dashboard')

      }
    },

    methods: {
      closeDialog () {
        this.showErrors = false
      },
      handleError (error) {
        console.log("chegou aqui")
        console.error('An Error occurrence: ' + error)
        this.error = error
        this.showErrors = true
        this.notifications.push({type: 'error', message: error})
      },

      logout () {
        this.$store.commit('clearUserAndToken')
        this.$socket.emit('user_exit', this.$store.state.user);
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
    },
    sockets: {
      connect () {
        console.log('socket connected (socket ID = ' + this.$socket.id + ')');
      },
    }
  }
</script>