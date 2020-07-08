<template>
    <v-container>
        <v-card>
            <v-card-title>
                Users
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
                          :items="users"
                          :loading="loading"
                          :search="search"
                          fixed-header
                          item-key="key"
                          sort-by="name"


            >

                <template v-slot:item.active="{ item }">
                    <v-btn :color="getColor(item.active)"
                           @click="changeStatus(item)"
                           dark
                           rounded> {{getUserStatus(item.active) }}
                    </v-btn>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon
                            @click.stop="editItem(item)"
                            class="mr-2"
                            small
                    >
                        mdi-pencil
                    </v-icon>

                </template>

            </v-data-table>
        </v-card>
        <v-dialog class="mx-auto" max-width="800" v-model="showUserDetails">
            <user-details v-on:errorEvent="handleErrors" :user-prop="user" v-on:refreshList="refreshList"></user-details>
        </v-dialog>

    </v-container>
</template>

<script>
  export default {
    name: 'listUsers',
    data: () => ({
      showUserDetails: false,
      user: null,
      loading: true,
      users: [],
      search: '',
      headers: [
        {
          text: 'Public Key',

          align: 'start',
          value: 'publicKey',
        },
        { text: 'Name', value: 'name', },
        { text: 'Username', value: 'username' },
        { text: 'Nif', value: 'nif' },
        { text: 'Role', value: 'role' },
        { text: 'Email', value: 'email' },
        { text: 'Status', value: 'active' },
        { text: 'Actions', value: 'actions', sortable: false },

      ],

    }), beforeMount () {
      this.getUsers()
    },
    methods: {
      handleErrors (error) {
        console.error(error)
        this.$emit('errorEvent', error)
      },

      refreshList () {
        this.getUsers()
      },
      getUsers () {
        this.loading = true
        axios.get('/agents').then(response => {
          this.users = response.data
          this.loading = false
        })
          .catch(function (error) {
            console.error(error)
            this.loading = false

          })
      },
      editItem (item) {
        this.user = item

        this.showUserDetails = true
      },

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
            this.getUsers()
          })
          .catch(error => {
            console.error(error)
            this.isLoading = false
            if (error.response && error.response.data.errors) {
              console.error(error.response)
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
      }
    }
  }
</script>

<style scoped>

</style>