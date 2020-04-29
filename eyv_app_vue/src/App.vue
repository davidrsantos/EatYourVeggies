<template>
    <v-app id="inspire">

        <v-app-bar app clipped-left color="indigo" dark elevate-on-scroll>
            <v-spacer></v-spacer>
            <v-toolbar-title>Eat Your Veggies</v-toolbar-title>
            <v-spacer></v-spacer>


            <template v-if="this.$store.state.token && (this.$store.state.user!=null)">
                <v-toolbar-title> {{this.$store.state.user.email}}</v-toolbar-title>

                <v-btn @click="logout">Logout</v-btn>
            </template>


        </v-app-bar>
        <v-navigation-drawer app clipped expand-on-hover
                             mini-variant-width="100"
                             v-if="this.$store.state.token && (this.$store.state.user!=null)"
        >
            <v-card>
                <drawer/>
            </v-card>
        </v-navigation-drawer>
        <v-content app
        >
            <v-container>
                <router-view/>
            </v-container>
        </v-content>
        <v-footer app color="indigo">
            <span class="white--text">&copy; 2019</span>
        </v-footer>
    </v-app>
</template>

<script>
    import * as api from "./services/api";
    import * as transactions from "./services/transactions";

    export default {
        props: {
            source: String
        },
        data: () => ({

            mini: false,
        }),
        mounted() {
            this.$store.commit('loadTokenAndUserFromSession'); //this keeps the user logged
            if (this.$store.state.user) {
                this.$router.push('dashboard')
                // this.$socket.emit('user_enter', this.$store.state.user); //TODO this can be useful for a broker
            }
        },

        methods: {
            logout() {
                this.$store.commit('clearUserAndToken');
                api.clearAuth()
                transactions.clearPrivateKey()
                this.$router.push('welcome')
            }
        }
    };
</script>