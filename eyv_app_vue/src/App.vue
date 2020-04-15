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
            <template v-else>
                <v-btn light to="/login">Login</v-btn>
                <v-btn light to="/singup">SingUp</v-btn>
            </template>

        </v-app-bar>
        <v-navigation-drawer app clipped expand-on-hover
                             mini-variant-width="100"
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

        methods: {
            logout() {
                this.$store.commit('clearUserAndToken');
                api.clearAuth()
                transactions.clearPrivateKey()
                console.log(this.$store.state.token)
            }
        }
    };
</script>