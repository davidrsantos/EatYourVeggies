<template>
    <v-card class="mx-auto" max-width="800">
        <v-container>
            <form>
                <v-text-field
                        :counter="10"
                        :error-messages="usernameErrors"
                        @blur="$v.username.$touch()"
                        @input="$v.username.$touch()"
                        label="Username"
                        required
                        v-model="username"
                />

                <v-text-field
                        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        :error-messages="passwordErrors"
                        :type="showPassword ? 'text' : 'password'"
                        @blur="$v.password.$touch()"
                        @click:append="showPassword = !showPassword"
                        @input="$v.password.$touch()"
                        counter
                        hint="At least 8 characters"
                        label="Password"
                        v-model="password"
                />
                <v-row>
                    <v-btn @click="submit" class="mr-4 ml-4">submit</v-btn>
                    <v-btn @click="clear">clear</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn class="mr-8" light to="/singup">SingUp</v-btn>
                </v-row>
            </form>


        </v-container>

    </v-card>
</template>
<script>
    import {validationMixin} from "vuelidate";
    import {
        required,
        maxLength,
        minLength,

    } from "vuelidate/lib/validators";
    import * as transactions from "../services/transactions";
    import * as api from "../services/api";

    export default {
        mixins: [validationMixin],

        validations: {
            password: {
                required,
                minLength: minLength(8)
            },

            username: {
                required,
                maxLength: maxLength(10)
            }
        },

        data: () => ({
            password: null,
            username: null,
            showPassword: false
        }),

        computed: {
            passwordErrors() {
                const errors = [];
                if (!this.$v.password.$dirty) return errors;
                !this.$v.password.minLength &&
                errors.push("Password must be at most 8 characters long");
                !this.$v.password.required && errors.push("Password is required.");
                return errors;
            },

            usernameErrors() {
                const errors = [];
                if (!this.$v.username.$dirty) return errors;
                !this.$v.username.maxLength &&
                errors.push("Username must be at most 10 characters long");
                !this.$v.username.required && errors.push("Username is required.");
                return errors;
            }
        },

        methods: {
            login() {
                const credentials = {
                    username: this.username,
                    password: api.hashPassword(this.password) //Ver onde vou por esta função quando o ficheiro api desaparecer
                };
                axios.post("authorization", credentials).then(res => {
                    transactions.setPrivateKey(this.password, res.data.encryptedKey);
                    this.$store.commit("setToken", res.data.authorization);
                    let pubKey = window.atob(this.$store.state.token.split('.')[1]) //Vai buscar o valor do meio do token e depois decodes porque estava encoded em base-64
                    axios.get(`agents/${pubKey}`)
                        .then(res => {
                            console.log(res);
                            this.$store.commit('setUser', res.data)
                            this.$router.push("dashboard")
                        }).catch(error => {
                        this.$emit('errorEvent', error)
                    })
                }).catch(error => {
                  console.log(error.toString())
                  this.$emit('errorEvent', error.response.data.error)
                });
            },

            submit() {
                this.login();
            },
            clear() {
                this.$v.$reset();
                this.username = null;
                this.password = null;
            }
        }
    };
</script>





