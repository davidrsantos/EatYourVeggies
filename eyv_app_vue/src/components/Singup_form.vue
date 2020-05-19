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
                        maxlength="9"
                        required
                        v-model="nif"

                />

                <v-select
                        :items="typeofUser"
                        item-text="name"
                        item-value="value"
                        label="Selecione o tipo de utilizador"
                        return-object

                        single-line
                        v-model="role"
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
                        :type="showPassword ? 'text' : 'password'"
                        @blur="$v.repeatPassword.$touch()"

                        @click:append="showPassword = !showPassword"
                        @input="$v.repeatPassword.$touch()"
                        counter
                        hint="At least 8 characters"
                        label="Confirm your Password"
                        v-model="repeatPassword"
                />
                <v-row>
                    <v-btn @click="submit" class="mr-4 ml-4">submit</v-btn>
                    <v-btn @click="clear">clear</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn class="mr-8" light to="/login">Login</v-btn>
                </v-row>
            </form>
        </v-container>
    </v-card>
</template>
<script>
  import * as transactions from '../services/transactions'
  import * as api from '../services/api'
  import * as payloads from '../services/payloads'
  import {
    required,
    maxLength,
    minLength,
    sameAs,
    email,
    numeric
  } from 'vuelidate/lib/validators'

  export default {

    validations: {
      name: { required, maxLength: maxLength(50) },
      email: { required, email },
      password: {
        required,
        minLength: minLength(8)
      },
      repeatPassword: {

        sameAsPassword: sameAs('password')
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
      typeofUser: [
        { name: 'Administrador', value: 'admin' },
        { name: 'Producer', value: 'producer' },
        { name: 'Distributor', value: 'distributor' },
        { name: 'Retailer', value: 'retailer' },
        { name: 'Customer', value: 'customer' },
      ]

    }),

    computed: {
      nifErrors () {
        const errors = []
        if (!this.$v.nif.$dirty) return errors
        !this.$v.nif.minLength &&
        errors.push('Nif must be at most 9 characters long')
        !this.$v.nif.maxLength &&
        errors.push('Nif should not be more that 9 characters long')
        !this.$v.nif.required && errors.push('Nif is required.')
        return errors
      },

      passwordErrors () {
        const errors = []
        if (!this.$v.password.$dirty) return errors
        !this.$v.password.minLength &&
        errors.push('Password must be at most 8 characters long')
        !this.$v.password.required && errors.push('Password is required.')
        return errors
      },

      repeatPasswordErrors () {
        const errors = []
        if (!this.$v.repeatPassword.$dirty) return errors
        if (!this.$v.repeatPassword.$dirty && this.$v.repeatPassword !== this.$v.password)
          errors.push('Please make use the same password')
        if (!this.$v.repeatPassword.required) {
          errors.push('Password is required.')
        }

        return errors
      },

      usernameErrors () {
        const errors = []
        if (!this.$v.username.$dirty) return errors
        !this.$v.username.maxLength &&
        errors.push('Username must be at most 10 characters long')
        !this.$v.username.required && errors.push('Username is required.')
        return errors
      },

      nameErrors () {
        const errors = []
        if (!this.$v.name.$dirty) return errors
        !this.$v.name.maxLength &&
        errors.push('Name should not be more that 50 characters long')
        !this.$v.name.required && errors.push('Name is required.')
        return errors
      },
      emailErrors () {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.email && errors.push('Must be valid e-mail')
        !this.$v.email.required && errors.push('E-mail is required')
        return errors
      }
    },

    methods: {

      userSubmitter () {
        const keys = transactions.makePrivateKey(this.password)
        const user = _.assign(keys, {
          username: this.username,
          email: this.email,
          nif: this.nif,
          role: this.role.value
        })
        user.password = api.hashPassword(this.password)
        const agent = payloads.createAgent({ name: this.name })

        transactions
          .submit(agent, true)
          .then(() => axios.post('users', user)
            .then(res => {
              this.$router.push('welcome')
              this.$emit('errorEvent', 'You will need to way for the administrator to validate your registration')
            }).catch(error => {
              this.$emit('errorEvent', error.response.data.error)
            })
          ).catch(error => {
          this.$emit('errorEvent', error)
        })

      },

      submit () {
        //todo fala proteger o btn de submit, agora aceita qualquer password etc..
        this.userSubmitter()
      },
      clear () {
        this.$v.$reset()
        this.name = null
        this.email = null
        this.username = null
        this.password = null
        this.repeatPassword = null
      }
    }
  }
</script>





