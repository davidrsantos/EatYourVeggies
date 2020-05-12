<template>
    <v-container>
        <v-card class="mx-auto" max-width="800">
            <v-container>
                <form>
                    <v-text-field
                            label="Name"
                            outlined
                            readonly
                            v-model="user.name"

                    />


                    <v-text-field
                            @click:append="openDialog(user.email,'email','E-mail')"
                            append-icon="mdi-pencil"
                            label="E-mail"
                            outlined
                            readonly
                            v-model="user.email"

                    />

                    <v-text-field
                            @click:append="openDialog(user.username,'username','Username')"
                            append-icon="mdi-pencil"
                            label="Username"
                            outlined
                            readonly

                            v-model="user.username"
                    />

                    <v-text-field
                            @click:append="openDialog(user.nif,'nif','Nif')"
                            append-icon="mdi-pencil"
                            label="Nif"
                            outlined
                            readonly

                            v-model="user.nif"

                    />

                    <v-text-field
                            @click:append="openDialog(user.role,'role','Role')"

                            append-icon="mdi-pencil"
                            label="Role"
                            outlined
                            readonly

                            :value="typeOfUser(user.role)"

                    />


                </form>
                <div class="text-center">
                    <v-dialog
                            v-model="dialogPassword"
                            width="600"
                    >
                        <template v-slot:activator="{ on }">
                            <v-btn
                                    color="red lighten-2"
                                    dark
                                    v-on="on"
                            >
                                Change Password
                            </v-btn>
                        </template>

                        <v-card class="mx-auto" max-width="800">
                            <v-container>
                                <form>
                                    <v-text-field
                                            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                            :type="showPassword ? 'text' : 'password'"

                                            @click:append="showPassword = !showPassword"

                                            label="Old Password"
                                            v-model="oldPassword"
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
                                            label="New Password"
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
                                            label="Confirm your New Password"
                                            v-model="repeatPassword"
                                    />

                                    <v-divider></v-divider>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                                @click="submitPasswordChange"
                                                color="primary"
                                                text
                                        >
                                            Change
                                        </v-btn>
                                    </v-card-actions>
                                </form>
                            </v-container>
                        </v-card>
                    </v-dialog>
                </div>
            </v-container>
        </v-card>
        <v-dialog
                max-width="600"
                v-model="dialog"
        >
            <v-card>
                <v-container fluid>
                    <v-card-title class="headline">Do you want to change your {{dialogLabel}}?</v-card-title>

                    <v-text-field :error-messages="keyErrors"

                                  @blur="$v.valueUpdateForm.$touch()"
                                  @input="$v.valueUpdateForm.$touch()"
                                  class="ml-4 mr-4"
                                  v-if="key!=='role'"
                                  v-model="valueUpdate"
                    />

                    <v-select :items="typeofUser"
                              item-text="name"
                              item-value="value"
                              label="Select your role"
                              return-object
                              single-line
                              solo
                              v-else
                              v-model="valueUpdate"
                    ></v-select>


                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                                @click="cancel"
                                color="grey darken-1"
                        >
                            Cancel
                        </v-btn>
                        <v-btn @click="submit" class="ml-4" color="green darken-1">Update</v-btn>

                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import * as transactions from "../services/transactions";
    import * as api from "../services/api";
    import * as payloads from "../services/payloads";
    import {email, maxLength, minLength, numeric, required, sameAs} from "vuelidate/lib/validators";

    export default {
        name: "profile",
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
            showPassword: false,
            oldPassword: null,
            password: null,
            repeatPassword: null,
            dialogPassword: false,
            valueUpdate: null,
            dialog: false,
            key: '',
            dialogLabel: '',
            user: {
                name: '',
                username: '',
                email: '',
                nif: '',
                role: '',
            },
            userValueUpdate: {
                name: '',
                username: '',
                email: '',
                nif: '',
                role: '',
            },

            typeofUser: [
                {name: 'Administrator', value: 'admin'},
                {name: 'Producer', value: 'producer'},
                {name: 'Distributor', value: 'distributor'},
                {name: 'Retailer', value: 'retailer'},
                {name: 'Customer', value: 'customer'}]
        }),
        created: function () {
            if (this.$store.state.user != null) {
                this.user = this.$store.state.user;

            }


        },
        methods: {
            typeOfUser(role) {

                switch (role) {
                    case 'admin':
                        return 'Administrator'
                    case 'producer':
                        return 'Producer'
                    case 'distributor':
                        return 'Distributor'
                    case 'retailer':
                        return 'Retailer'
                    case 'customer':
                        return 'Customer'
                    default:
                        return 'Unknown'
                }
            },
            submitPasswordChange() {

                transactions.changePassword(this.password, this.oldPassword)
                    .then(encryptedKey => {
                        return api.patch('users', {
                            encryptedKey,
                            password: api.hashPassword(this.password)
                        })

                    }).then(() => {
                    this.dialogPassword = false
                })
            },

            userUpdate() {
                console.log(this.valueUpdate + '+' + this.key)

                return api.patch('users', _.pick(this.userValueUpdate, this.key))
                    .then((user) => {
                        user.name = this.user.name
                        this.$store.commit('setUser', user);
                        this.user = user;
                    })

            },
            cancel() {
                this.dialog = false;
                this.key = '';
                this.dialogLabel = '';
                this.valueUpdate = null;
            },

            submit() {
                _.set(this.userValueUpdate, this.key, this.valueUpdate)
                this.userUpdate();
                this.dialog = false;
                this.key = '';
                this.dialogLabel = '';
                this.valueUpdate = null;


            },
            openDialog(model, key, label) {//todo - ver se vai ser preciso colocar outra label aqui para as props c/ + de 2 atrb
                this.dialog = true;
                this.key = key;
                this.dialogLabel = label;
                this.valueUpdate = model;
            }

        },
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
                if (!this.$v.repeatPassword.$dirty && this.$v.repeatPassword !== this.$v.password)
                    errors.push("Please make use the same password");
                if (!this.$v.repeatPassword.required) {
                    errors.push("Password is required.");
                }

                return errors;
            },


            keyErrors() {
                const errors = [];
                /*  if (this.key === 'nif') {
                      if (!this.$v.valueUpdate.$dirty) return errors;
                      !this.$v.valueUpdate.minLength &&
                      errors.push("Nif must be at most 9 characters long");
                      !this.$v.valueUpdate.maxLength &&
                      errors.push("Nif should not be more that 9 characters long");
                      !this.$v.valueUpdate.required && errors.push("Nif is required.");
                      return errors;
                  }

                  if (this.key === 'email') {

                      if (!this.$v.valueUpdate.$dirty) return errors;
                      !this.$v.valueUpdate.email && errors.push("Must be valid e-mail");
                      !this.$v.valueUpdate.required && errors.push("E-mail is required");
                      return errors;
                  }

                  if (this.key === 'username') {

                      if (!this.$v.valueUpdate.$dirty) return errors;
                      !this.$v.valueUpdate.maxLength &&
                      errors.push("Username must be at most 10 characters long");
                      !this.$v.valueUpdate.required && errors.push("Username is required.");
                      return errors;
                  }*/

                //TODO perceber porque não funciona

            }
        },

    }

</script>

<style scoped>

</style>