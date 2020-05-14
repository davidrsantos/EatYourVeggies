<template>
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
                      :search="search"
                      item-key="key"
                      sort-by="name"
                      :loading ="loading"



        >

              <template v-slot:item.actions="{ item }">
                  <v-icon
                          @click="editItem(item)"
                          class="mr-2"
                          small
                  >
                      mdi-pencil
                  </v-icon>

              </template>

        </v-data-table>
    </v-card>
</template>

<script>
    export default {
        name: "listUsers",
        data: () => ({
            loading: true,
            users: [],
            search: '',
            headers: [
                {
                    text: 'Public Key',

                    sortable: false,
                    value: 'key',
                },
                {text: 'Name', value: 'name',},
              {text: 'Username', value: 'username'},
              {text: 'Nif', value: 'nif'},
              {text: 'Role', value: 'role'},
                {text: 'Actions', value: 'actions', sortable: false},

            ],

        }), beforeMount() {
            this.getUser();
        },
        methods: {
            getUser() {
                this.loading=true
                axios.get('/agents').then(response => {
                    this.users = response.data;
                    this.loading=false
                })
                    .catch(function (error) {
                        console.log(error);
                        this.loading=false

                    });
            }

        }
    }
</script>

<style scoped>

</style>