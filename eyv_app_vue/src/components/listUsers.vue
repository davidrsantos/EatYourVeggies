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
                          item-key="key"
                          sort-by="name"


            >

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
        <v-dialog v-model="showUserDetails" class="mx-auto" max-width="800">
             <user-details :user="user"></user-details>
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

          sortable: false,
          value: 'key',
        },
        { text: 'Name', value: 'name', },
        { text: 'Username', value: 'username' },
        { text: 'Nif', value: 'nif' },
        { text: 'Role', value: 'role' },
        {text: 'Email', value: 'email'},
        { text: 'Actions', value: 'actions', sortable: false },

      ],

    }), beforeMount () {
      this.getUser()
    },
    methods: {
      getUser () {
        this.loading = true
        axios.get('/agents').then(response => {
          this.users = response.data
          this.loading = false
        })
          .catch(function (error) {
            console.log(error)
            this.loading = false

          })
      },
      editItem (item) {
        this.user = item

        this.showUserDetails = true
      },
    }
  }
</script>

<style scoped>

</style>