<template>
        <v-card>
            <v-container>
            <v-card-title>Your session expired</v-card-title>
            <v-card-text>For security reasons please insert your password</v-card-text>
            <v-text-field label="password" v-model="password"></v-text-field>
            <v-card-actions>
                <v-btn @click="submitPassword"></v-btn>
            </v-card-actions>
            </v-container>
        </v-card>
</template>

<script>
  import * as transactions from '../services/transactions'

  export default {
    name: 'requestPassword',
    data: () => {
      return {
        password: null,
      }
    },
    methods: {
      submitPassword () {
        const STORAGE_KEY = 'fish_net.encryptedKey'

        const encryptedKey = window.localStorage.getItem(STORAGE_KEY)
        transactions.setPrivateKey(this.password, encryptedKey)
      }
    }
  }
</script>

<style scoped>

</style>