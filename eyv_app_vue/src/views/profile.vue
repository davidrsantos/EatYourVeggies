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
                            :value="typeOfUser(user.role)"
                            label="Role"
                            outlined
                            readonly

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
                                            required
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
                                            required
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
                                            requied
                                            v-model="repeatPassword"
                                    />

                                    <v-divider></v-divider>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn :disabled="(password==null||repeatPassword!==password||oldPassword==null)"
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

                                  @blur="$v.valueUpdate.$touch()"
                                  @input="$v.valueUpdate.$touch()"
                                  class="ml-4 mr-4"

                                  v-model="valueUpdate"
                    />




                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                                @click="cancel"
                                color="grey darken-1"
                        >
                            Cancel
                        </v-btn>
                        <v-btn :disabled="submitStatus==='ERROR'" @click="submit" class="ml-4" color="green darken-1">
                            Update
                        </v-btn>

                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>


        <!-- dialog for Errors -->

    </v-container>

</template>

<script>
    import * as transactions from "../services/transactions";
    import * as api from "../services/api";
    import {email, maxLength, minLength, numeric, required, sameAs} from "vuelidate/lib/validators";


    export default {
        name: "profile",

        validations() {
            return {
                password: {
                    required,
                    minLength: minLength(8)
                },
                repeatPassword: {

                    sameAsPassword: sameAs("password")
                },
                valueUpdate: this.rules
            }
        },
        data: () => ({

            submitStatus: null,
            showPassword: false,
            oldPassword: null,
            password: null,
            repeatPassword: null,
            dialogPassword: false,
            valueUpdate: "",
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

        }),
        created: function () {
            if (this.$store.state.user != null) {
                this.user = this.$store.state.user;

            }


        },
        methods: {

            handleErrors(error) {
                this.$emit('errorEvent', error)
            },

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
                if(this.password === this.oldPassword) return this.handleErrors("The new password cannot be the same as old")
                if(this.password !== this.repeatPassword) return this.handleErrors("The new password didn't match")

                transactions.changePassword(this.password, this.oldPassword)
                    .then(encryptedKey => {
                        return axios.patch('users', {
                            encryptedKey,
                            password: api.hashPassword(this.password)
                        })

                    }).then(() => {
                    this.dialogPassword = false
                }).catch(e =>
                    this.handleErrors(e)
                )
            },

            userUpdate() {
                let key = this.key
                let userUpdate = _.pick(this.userValueUpdate, this.key);
                return axios.patch('users', userUpdate)
                    .then((response) => {
                        console.log(response);
                        let user = response.data
                        user.name = this.user.name

                        this.$store.commit('setUser', user);
                        this.user = user;
                    })
                    .catch( (error) => {
                            if (error.response && error.response.status === 406) {
                                this.handleErrors("It's no possible to make that change")
                            }

                    });



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
            openDialog(model, key, label) {
                this.dialog = true;
                this.key = key;
                this.dialogLabel = label;
                this.valueUpdate = model;
            }

        },
        computed: {
            rules() {
                switch (this.key
                    ) {

                    case
                    'email'
                    :
                        return {
                            required, email
                        }
                            ;

                    case
                    'username'
                    :
                        return {
                            required, maxLength: maxLength(10)
                        }
                            ;
                    case
                    'nif'
                    :
                        return {
                            required, minLength: minLength(9),
                            maxLength: maxLength(9), numeric
                        }
                            ;
                }

            },


            passwordErrors() {
                const errors = [];
                if (!this.$v.password.$dirty) return errors;
                !this.$v.password.minLength &&
                errors.push("Password must be at most 8 characters long");
                !this.$v.password.required && errors.push("Password is required.");
                return errors;
            }
            ,

            repeatPasswordErrors() {
                const errors = [];
                if (!this.$v.repeatPassword.$dirty) return errors;
                if (!this.$v.repeatPassword.$dirty && this.$v.repeatPassword !== this.$v.password)
                    errors.push("Please make use the same password");
                if (!this.$v.repeatPassword.required) {
                    errors.push("Password is required.");
                }

                return errors;
            }
            ,


            keyErrors() {
                const errors = [];
                if (this.key === 'nif') {

                    if (!this.$v.valueUpdate.$dirty) return errors;
                    !this.$v.valueUpdate.minLength && errors.push("Nif must be at most 9 characters long");
                    !this.$v.valueUpdate.maxLength && errors.push("Nif should not be more that 9 characters long");
                    !this.$v.valueUpdate.numeric && errors.push("Nif must be numeric.");
                    !this.$v.valueUpdate.required && errors.push("Nif is required.");

                    if (errors.length !== 0) this.submitStatus = 'ERROR'
                    else this.submitStatus = 'OK';

                    return errors;
                }

                if (this.key === 'email') {

                    if (!this.$v.valueUpdate.$dirty) return errors;
                    !this.$v.valueUpdate.email && errors.push("Must be valid e-mail");
                    !this.$v.valueUpdate.required && errors.push("E-mail is required");

                    if (errors.length !== 0) this.submitStatus = 'ERROR'
                    else this.submitStatus = 'OK';

                    return errors;
                }

                if (this.key === 'username') {

                    if (!this.$v.valueUpdate.$dirty) return errors;
                    !this.$v.valueUpdate.maxLength &&
                    errors.push("Username must be at most 10 characters long");
                    !this.$v.valueUpdate.required && errors.push("Username is required.");

                    if (errors.length !== 0) this.submitStatus = 'ERROR'
                    else this.submitStatus = 'OK';

                    return errors;
                }



            }
        },

    }

</script>

