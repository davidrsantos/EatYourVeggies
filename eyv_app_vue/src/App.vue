<template>
    <v-app id="inspire">

        <v-app-bar app color="indigo" dark clipped-left  elevate-on-scroll>

            <v-toolbar-title>Eat Your Veggies</v-toolbar-title>
            <v-spacer></v-spacer>


            <template v-if="this.$store.state.token">
                <v-btn
                        @mouseover="drawer = true"
                        dark height="auto" icon
                        width="auto"
                >
                    <v-avatar>
<!--                        <v-img v-bind:src="'storage/fotos/' + this.$store.state.user.photo"></v-img>-->
                    </v-avatar>
                </v-btn>


<v-btn @click="logout">Logout</v-btn>
            </template>
            <template v-else>
                <v-btn text to="/login">Login</v-btn>
                <v-btn  to="/singup">SingUp</v-btn>
            </template>
        </v-app-bar>
        <v-navigation-drawer expand-on-hover      app mini-variant-width="100"
                             clipped
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
            logout(){
                this.$store.commit('clearUserAndToken');
                api.clearAuth()
                transactions.clearPrivateKey()
                console.log(this.$store.state.token)
            }
        }
    };
</script>