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
        <v-footer app absolute color="indigo">
            <span class="white--text">&copy;Instituto Politécnico de Leiria - 2020 - Projeto Informático  </span>
        </v-footer>

        <v-content app
        >
            <v-container>
                <router-view @errorEvent="handleError"/>
            </v-container>
        </v-content>
        <v-navigation-drawer app clipped expand-on-hover permanent
                             mini-variant
                             v-if="this.$store.state.token && (this.$store.state.user!=null)"
        >

            <drawer/>

        </v-navigation-drawer>
        <errorDialog :error="error" :show-errors="showErrors" v-on:closeDialog="closeDialog"/>
    </v-app>
</template>

<script>
    import * as api from "./services/api";
    import * as transactions from "./services/transactions";

    export default {
        name: "App",
        props: {
            source: String
        },
        data: () => ({

            mini: false,
            showErrors: false,
            error: null,
        }),
        mounted() {
            this.$store.commit('loadTokenAndUserFromSession'); //this keeps the user logged
            if (this.$store.state.user) {
                this.$router.push('dashboard')
                // this.$socket.emit('user_enter', this.$store.state.user); //TODO this can be useful for a broker
            }
        },

        methods: {
            closeDialog(){
                this.showErrors = false;
            },
            handleError(error){
                console.error("An Error occurrence: " + error);
                this.error = error;
                this.showErrors = true;
            },

            logout() {
                this.$store.commit('clearUserAndToken');
                api.clearAuth()
                transactions.clearPrivateKey()
                this.$router.push('welcome')
            }
        }
    };
</script>