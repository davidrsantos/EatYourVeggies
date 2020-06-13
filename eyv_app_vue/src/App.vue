<template>
    <v-app id="inspire">

        <v-app-bar app clipped-left color="#66BB6A" dark elevate-on-scroll>
            <v-spacer/>
            <v-avatar size="90px">
                <img src="icon.png"/>
            </v-avatar>

            <v-toolbar-title link="/dashboard">Eat Your Veggies</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-btn @click="teste">newUser</v-btn>
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
                                :value="notifications.length>0"
                                color="red"
                                overlap

                        >
                            <v-icon>mdi-bell</v-icon>
                        </v-badge>
                    </v-btn>


                </template>

                <v-card>
                    <v-card-text>

                        <material-notification :color="item.color" :key="item.message"
                                               class="mb-3"
                                               elevation="5"
                                               v-for="item in notifications.slice().reverse()"

                        >
                            <v-row>
                                <strong>{{item.title.toUpperCase()}}</strong>   <div>  -{{item.message}}</div>
                                <v-spacer/>
                                <v-btn @click="removeFromNotifications(item)" icon>
                                    <v-icon>mdi-eye</v-icon>
                                </v-btn>
                            </v-row>
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
                <router-view @errorEvent="handleError" @registEvent="handleRegist"/>


            </v-container>

        </v-content>
        <v-navigation-drawer app clipped expand-on-hover mini-variant
                             permanent
                             v-if="this.$store.state.token && (this.$store.state.user!=null)"
        >

            <drawer/>

        </v-navigation-drawer>
        <errorDialog :error="error" :show-errors="showErrors" v-on:closeDialog="closeDialog"/>
        <vue-snotify ></vue-snotify>
    </v-app>
</template>

<script>
  import {SnotifyPosition, SnotifyStyle} from 'vue-snotify';
  import * as api from './services/api'
  import * as transactions from './services/transactions'

  const { setBatcherPubkey } = require('./services/transactions')


  export default {
    sockets: {
      connect () {
        console.log('socket connected (socket ID = ' + this.$socket.client.id + ')')
      },
      newUser (user) {
        console.log('ola new user!')
        let buttons = [
          { text: 'Details', action: () => console.log('Clicked: Yes'), bold: false },
          {
            text: 'Later', action: (toast) => {
              console.log('Clicked: Later')
              vm.$snotify.remove(toast.id)
            }
          },
          {
            text: 'Close', action: (toast) => {
              console.log('Clicked: No')
              vm.$snotify.remove(toast.id)

            }, bold: true
          },
        ]
        let message = user.name + '\n is ask to sign in!! Do you want to see more?'
        let title = 'New User'
        this.$snotify.confirm(message, title,
          {
            timeout: 5000,
            showProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            buttons
          })
        this.notifications.push({ color: 'confirm', title: title, message: message })
      }
    },

    name: 'App',
    props: {
      source: String
    },
    data: () => ({

      mini: false,
      showErrors: false,
      error: null,
      notifications: [
        { title: 'error', message: 'alguma ioahfjiajsfpia  pioajsfj' }, {
          title: 'success',
          message: 'alguma',
          color: 'success'
        },
        {
          title: 'warning',
          message: 'alguma',
          color: 'warning'
        }, {
          title: 'warning',
          message: 'alguma'
        }, {
          title: 'warning',
          message: 'sdxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxkijmdsf  iosdfh o isd vdsvvvvvvvvvvvvvvvvvvvvvvfg gdddddddddddddddddddsgdsfa'
        },
      ]
    }),
    mounted () {
      this.$store.commit('loadTokenAndUserFromSession') //this keeps the user logged
      setBatcherPubkey()
      if (this.$store.state.user) {
        this.$socket.client.emit('user_enter', this.$store.state.user)
        this.$router.push('dashboard')

      }
    },

    methods: {
      removeFromNotifications (item) {
        let index = this.notifications.indexOf(item)
        if (index > -1) {
          this.notifications.splice(index, 1)
        }
      },
      teste () {
        let user = { name: 'ola' }
        this.$socket.client.emit('newUser', user)

      },
      closeDialog () {
        this.showErrors = false
      },
      handleError (error) {
        console.log('chegou aqui')
        console.error('An Error occurrence: ' + error)
        this.error = error
        this.showErrors = true
        this.notifications.push({ title: 'error', color: 'error', message: error })
      },
      handleRegist (msg) {
        this.$snotify.warning(msg,'Hello New User',{
          timeout: 5000,
          position: SnotifyPosition.centerBottom,
          bodyMaxLength: 500
        })

      },

      logout () {
        this.$store.commit('clearUserAndToken')
        this.$socket.client.emit('user_exit', this.$store.state.user)
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

  }
</script>
<style lang="scss">
    @import "~vue-snotify/styles/material";
</style>
