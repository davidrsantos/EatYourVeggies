<template>
    <v-card class="mx-auto" max-width="800">
        <v-container>
            <form>
                <v-text-field
                        :counter="10"
                        :error-messages="nameErrors"
                        @blur="$v.name.$touch()"
                        @input="$v.name.$touch()"
                        label="Name"
                        required
                        v-model="name"
                />
                <v-text-field
                        :error-messages="emailErrors"
                        @blur="$v.email.$touch()"
                        @input="$v.email.$touch()"
                        label="E-mail"
                        required
                        v-model="email"
                />

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
                        :counter="9"
                        :error-messages="nifErrors"
                        @blur="$v.nif.$touch()"
                        @input="$v.nif.$touch()"
                        label="Nif"
                        required
                        v-model="nif"
                        maxlength="9"

                />

                <v-select
                        v-model="role"
                        :items="typeofUser"
                        item-text="name"
                        item-value="value"
                        label="Selecione o tipo de utilizador"

                        return-object
                        single-line
                ></v-select>


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

                <v-text-field
                        :error-messages="repeatPasswordErrors"
                        :type="password"
                        @blur="$v.repeatPassword.$touch()"
                        @input="$v.repeatPassword.$touch()"
                        counter
                        hint="At least 8 characters"
                        label="Confirm your Password"
                        v-model="repeatPassword"
                />

                <v-btn @click="submit" class="mr-4">submit</v-btn>
                <v-btn @click="clear">clear</v-btn>
            </form>
        </v-container>
    </v-card>
</template>
<script>
    import * as transactions from "../services/transactions";
    import * as api from "../services/api";
    import * as payloads from "../services/payloads";
    import {
        required,
        maxLength,
        minLength,
        sameAs,
        email,
        numeric
    } from "vuelidate/lib/validators";

    export default {

        validations: {
            name: {required, maxLength: maxLength(50)},
            email: {required, email},
            password: {
                required,
                minLength: minLength(8)
            },
            repeatPassword: {

                sameAsPassword: sameAs("password")
            },
            username: {
                required, maxLength: maxLength(10)
            },
            nif: {
                required, minLength: minLength(9), maxLength: maxLength(9), numeric
            },
        },

        data: () => ({
            name: null,
            email: null,
            password: null,
            repeatPassword: null,
            username: null,
            showPassword: false,
            nif: null,
            role: null,
            typeofUser:[
                {name:'Administrador', value: 'admin'},
                {name:'Produtor', value: 'prod'},
                {name:'Distribuidor', value: 'dist'},
                {name:'Administrador', value: 'admin'},//todo faltam adicionar e por em ingles
        ]

        }),

        computed: {
            nifErrors() {
                const errors = [];
                if (!this.$v.nif.$dirty) return errors;
                !this.$v.nif.minLength &&
                errors.push("Nif must be at most 9 characters long");
                !this.$v.nif.maxLength &&
                errors.push("Nif should not be more that 9 characters long");
                !this.$v.nif.required && errors.push("Nif is required.");
                return errors;
            },

            passwordErrors() {
                const errors = [];
                if (!this.$v.password.$dirty) return errors;
                !this.$v.password.minLength &&
                errors.push("Password must be at most 8 characters long");
                !this.$v.password.required && errors.push("Password is required.");
                return errors;
            },

            repeatPasswordErrors() {
                const errors = [];
                if (!this.$v.repeatPassword.$dirty) return errors;
                if (this.$v.repeatPassword !== this.$v.password)
                    errors.push("Please make use the same password");
                !this.$v.repeatPassword.required && errors.push("Password is required.");
                return errors;
            },

            usernameErrors() {
                const errors = [];
                if (!this.$v.username.$dirty) return errors;
                !this.$v.username.maxLength &&
                errors.push("Username must be at most 10 characters long");
                !this.$v.username.required && errors.push("Username is required.");
                return errors;
            },

            nameErrors() {
                const errors = [];
                if (!this.$v.name.$dirty) return errors;
                !this.$v.name.maxLength &&
                errors.push("Name must be at most 50 characters long"); //TODO alterar mensagem de erro
                !this.$v.name.required && errors.push("Name is required.");
                return errors;
            },
            emailErrors() {
                const errors = [];
                if (!this.$v.email.$dirty) return errors;
                !this.$v.email.email && errors.push("Must be valid e-mail");
                !this.$v.email.required && errors.push("E-mail is required");
                return errors;
            }
        },

        methods: {
            userSubmitter() {
                const keys = transactions.makePrivateKey(this.password);
                const user = _.assign(keys, {
                    username: this.username,
                    email: this.email
                });
                user.password = api.hashPassword(this.password);
                const agent = payloads.createAgent({name: this.name});

                // console.log(agent);
                transactions
                    .submit(agent, true)
                    .then(() => api.post("users", user))
                    .then(res => {
                        api.setAuth(res.authorization);                      //provavelmente este já não vai ser necessário
                        this.$store.commit('setToken', res.authorization);   //porque temos este
                        this.$router.push('dashboard')

                    }); //TODO o token já fica aqui guardado

            },

            submit() {
                this.userSubmitter();
            },
            clear() {
                this.$v.$reset();
                this.name = null;
                this.email = null;
                this.username = null;
                this.password = null;
                this.repeatPassword = null;
            }
        }
    };
</script>





