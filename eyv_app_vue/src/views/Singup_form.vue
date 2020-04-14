<template>
  <v-card class="mx-auto" max-width="800">
    <v-container>
      <form>
        <v-text-field
                v-model="name"
                :error-messages="nameErrors"
                :counter="10"
                label="Name"
                required
                @input="$v.name.$touch()"
                @blur="$v.name.$touch()"
        />
        <v-text-field
                v-model="email"
                :error-messages="emailErrors"
                label="E-mail"
                required
                @input="$v.email.$touch()"
                @blur="$v.email.$touch()"
        />

        <v-text-field
                v-model="username"
                :error-messages="usernameErrors"
                :counter="10"
                label="Username"
                required
                @input="$v.username.$touch()"
                @blur="$v.username.$touch()"
        />

        <v-text-field
                v-model="password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                hint="At least 8 characters"
                counter
                @click:append="showPassword = !showPassword"
                :error-messages="passwordErrors"
                @input="$v.password.$touch()"
                @blur="$v.password.$touch()"
        />

        <v-text-field
                v-model="repeatPassword"
                :type="password"
                label="Confirm your Password"
                hint="At least 8 characters"
                counter
                :error-messages="repeatPasswordErrors"
                @input="$v.repeatPassword.$touch()"
                @blur="$v.repeatPassword.$touch()"
        />

        <v-btn class="mr-4" @click="submit">submit</v-btn>
        <v-btn @click="clear">clear</v-btn>
      </form>
    </v-container>
  </v-card>
</template>
<script>
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  minLength,
  sameAs,
  email
} from "vuelidate/lib/validators";
import transactions from "../services/transactions";
import api from "../services/api";
import payloads from "../services/payloads";

export default {
  mixins: [validationMixin],

  validations: {
    name: { required, maxLength: maxLength(10) },
    email: { required, email },
    password: {
      required,
      minLength: minLength(8)
    },
    repeatPassword: {
      required,
      sameAsPassword: sameAs("password")
    },
    username:{
      required, maxLength: maxLength(10) 
    }
  },

  data: () => ({
    name: null,
    email: null,
    password: null,
    repeatPassword: null,
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
        errors.push("Name must be at most 10 characters long");
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
      const agent = payloads.createAgent({ name: this.name });

      // console.log(agent);
      transactions
        .submit(agent, true)
        .then(() => api.post("users", user))
        .then(res => api.setAuth(res.authorization)); //TODO o token já fica aqui guardado
      //.then(() => m.route.set("/"));
    },

    submit() {
      this.userSubmitter();
    },
    clear() {
      this.$v.$reset();
      this.name = null;
      this.email = null;
      this.password = null;
      this.repeatPassword = null;
    }
  }
};
</script>





