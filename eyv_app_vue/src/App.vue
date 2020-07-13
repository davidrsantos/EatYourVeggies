<template>
    <v-app id="inspire">
        <v-app-bar app clipped-left color="primary" dark elevate-on-scroll>
            <v-app-bar-nav-icon class="ml-10 mr-5" to="/dashboard">
                <v-avatar size="90px">
                    <img src="icon.png" />
                </v-avatar>
            </v-app-bar-nav-icon>

            <v-toolbar-title>Eat Your Veggies</v-toolbar-title>

            <v-spacer></v-spacer>

            <template
                v-if="this.$store.state.token && this.$store.state.user != null"
            >
                <v-menu
                    :close-on-content-click="false"
                    :nudge-width="200"
                    offset-y
                >
                    <template v-slot:activator="{ on }">
                        <v-btn class="mr-10" icon v-on="on">
                            <v-badge
                                :content="notifications.length"
                                :value="notifications.length > 0"
                                color="red"
                                overlap
                            >
                                <v-icon>mdi-bell</v-icon>
                            </v-badge>
                        </v-btn>
                    </template>

                    <v-card>
                        <v-card-text>
                            <material-notification
                                :color="item.color"
                                :key="item.message"
                                class="mb-3"
                                elevation="5"
                                v-for="item in notifications.slice().reverse()"
                            >
                                <v-row>
                                    <v-container>
                                        <strong>{{
                                            item.title.toUpperCase()
                                        }}</strong>
                                        <div>-{{ item.message }}</div>

                                        <v-card-actions>
                                            <div v-if="item.button">
                                                <v-btn
                                                    @click="
                                                        item.button.action()
                                                    "
                                                    color="blue lighten-4"
                                                >
                                                    {{ item.button.text }}
                                                </v-btn>
                                            </div>
                                            <v-spacer />
                                            <v-btn
                                                @click="
                                                    removeFromNotifications(
                                                        item
                                                    )
                                                "
                                                class="ml-lg-10"
                                                color="blue lighten-4"
                                            >
                                                Cancel
                                            </v-btn>
                                        </v-card-actions>
                                    </v-container>
                                </v-row>
                            </material-notification>
                        </v-card-text>
                    </v-card>
                </v-menu>
                <v-toolbar-title
                    >({{ typeOfUser(this.$store.state.user.role) }})
                    {{ this.$store.state.user.username }}
                </v-toolbar-title>
                <v-btn @click="logout" class="ma-4">Logout</v-btn>
            </template>
            <template v-else>
                <v-btn
                    light
                    to="/login"
                    dark
                    color="green darken-3"
                    large
                    class="ma-2"
                    >Login</v-btn
                >
                <v-btn
                    light
                    to="/signup"
                    dark
                    large
                    color="green darken-3"
                    class="ma-2"
                    >SignUp</v-btn
                >
            </template>
        </v-app-bar>

        <v-content app transition="slide-x-transition">
            <router-view
                @errorEvent="handleError"
                @registEvent="handleRegist"
                @requestPasswordEvent="handleRequestPassword"
            />
        </v-content>

        <v-navigation-drawer
            app
            clipped
            expand-on-hover
            mini-variant
            permanent
            v-if="this.$store.state.token && this.$store.state.user != null"
        >
            <drawer />
        </v-navigation-drawer>
        <errorDialog
            :error="error"
            :show-errors="showErrors"
            v-on:closeDialog="closeDialog"
        />
        <vue-snotify></vue-snotify>
        <v-dialog v-model="requestPassword" width="unset">
            <v-card>
                <v-card-title class="red darken-1"
                    >Your session expired!</v-card-title
                >
                <v-card-subtitle
                    class="red darken-1"
                    v-if="this.$store.state.user"
                    >Sorry {{ this.$store.state.user.name }} for security
                    reasons you need to input your password again
                </v-card-subtitle>
                <request-password @close="requestPassword = false" />
            </v-card>
        </v-dialog>
        <v-footer app color="primary">
            <span class="white--text"
                >&copy; Politécnico de Leiria - 2020 - Projeto Informático
            </span>
        </v-footer>
    </v-app>
</template>

<script>
import { SnotifyPosition } from 'vue-snotify';
import * as api from './services/api';
import * as transactions from './services/transactions';

const { setBatcherPubkey } = require('./services/transactions');

export default {
    sockets: {
        connect() {
            console.log(
                'socket connected (socket ID = ' + this.$socket.client.id + ')'
            );
        },
        newUser(user) {
            let buttons = [
                {
                    text: 'Details',
                    action: () =>
                        this.$router.push({
                            name: 'userDetails',
                            params: { publicKey: user.publicKey }
                        }),
                    bold: false
                },
                {
                    text: 'Later',
                    action: toast => {
                        vm.$snotify.remove(toast.id);
                    }
                }
            ];
            let message =
                user.name + '\n is ask to sign in!! Do you want to see more?';
            let title = 'New User';
            this.$snotify.confirm(message, title, {
                timeout: 9999,
                showProgressBar: true,
                closeOnClick: false,
                pauseOnHover: true,
                buttons
            });
            this.notifications.push({
                color: 'confirm',
                title: title,
                message: message,
                button: buttons[0]
            });
        },
        newProposal(proposal) {
            let buttons = [
                {
                    text: 'Details',
                    action: () => {
                      this.$router.push({ path: '/dashboard' })
                      vm.$snotify.remove(toast.id)}
                },
                {
                    text: 'Later',
                    action: toast => {
                        vm.$snotify.remove(toast.id);
                    }
                }
            ];
            let message =
                'the user: \n' +
                proposal.fromPublicKey +
                '\n  is asking you to accept the proposal regarding the product: ' +
                proposal.product +
                '\n  Do you want to see more?';
            let title = 'New Proposal';
            this.$snotify.confirm(message, title, {
                timeout: 9999,
                showProgressBar: true,
                closeOnClick: false,
                pauseOnHover: true,
                buttons
            });
            this.notifications.push({
                color: 'confirm',
                title: title,
                message: message,
                button: buttons[0]
            });
        }
    },

    name: 'App',
    props: {
        source: String
    },
    data: () => ({
        requestPassword: false,
        mini: false,
        showErrors: false,
        error: null,
        notifications: []
    }),
    mounted() {
        this.$store.commit('loadTokenAndUserFromSession'); //this keeps the user logged
        setBatcherPubkey();
        if (this.$store.state.user) {
            this.$socket.client.emit('user_enter', this.$store.state.user);
          this.$store.commit('setViewer', false);
            this.$router.push('dashboard');
        }
    },

    methods: {
        removeFromNotifications(item) {
            let index = this.notifications.indexOf(item);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        },
        closeDialog() {
            this.showErrors = false;
        },
        handleRequestPassword() {
            this.requestPassword = true;
        },

        handleError(error) {
            console.error('An Error occurrence: ' + error);
            this.error = error;
            this.showErrors = true;
            this.notifications.push({
                title: 'error',
                color: 'error',
                message: error
            });
        },
        handleRegist(msg) {
            this.$snotify.warning(msg, 'Hello New User', {
                timeout: 50000,
                position: SnotifyPosition.centerBottom,
                bodyMaxLength: 500
            });
        },

        logout: function() {
            this.$store.commit('clearUserAndToken');
            this.$socket.client.emit('user_exit', this.$store.state.user);
            api.clearAuth();
            transactions.clearPrivateKey();
            this.$router
                .push('/')
                .then(value => console.log(value))
                .catch(reason => console.log(reason));
        },
        typeOfUser(role) {
            switch (role) {
                case 'admin':
                    return 'Administrator';
                case 'producer':
                    return 'Producer';
                case 'distributor':
                    return 'Distributor';
                case 'retailer':
                    return 'Retailer';
                case 'customer':
                    return 'Customer';
                default:
                    return 'Unknown';
            }
        }
    }
};
</script>
<style lang="scss">
@import '~vue-snotify/styles/material';
</style>
