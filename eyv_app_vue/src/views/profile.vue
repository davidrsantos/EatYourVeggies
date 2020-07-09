<template>
    <v-container>
        <user-details :user-prop="user" myself="true"></user-details>
    </v-container>
</template>

<script>
import * as api from '../services/api';

export default {
    name: 'profile',

    data: () => ({
        user: {
            name: '',
            username: '',
            email: '',
            nif: '',
            role: ''
        }
    }),
    created: function() {
        if (this.$store.state.user != null) {
            this.user = this.$store.state.user;
        }
    },

    methods: {
        handleErrors(error) {
            this.$emit('errorEvent', error);
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
        },
        submitPasswordChange() {
            if (this.password === this.oldPassword)
                return this.handleErrors(
                    'The new password cannot be the same as old'
                );
            if (this.password !== this.repeatPassword)
                return this.handleErrors("The new password didn't match");

            transactions
                .changePassword(this.password, this.oldPassword)
                .then(encryptedKey => {
                    return axios.patch('users', {
                        encryptedKey,
                        password: api.hashPassword(this.password)
                    });
                })
                .then(() => {
                    this.dialogPassword = false;
                })
                .catch(e => this.handleErrors(e));
        },
        userUpdate() {
            let userUpdate = _.pick(this.userValueUpdate, this.key);
            return axios
                .patch('users', userUpdate)
                .then(response => {
                    let user = response.data;
                    user.name = this.user.name;

                    this.$store.commit('setUser', user);
                    this.user = user;
                })
                .catch(error => {
                    if (error.response && error.response.status === 406) {
                        this.handleErrors(
                            "It's no possible to make that change"
                        );
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
            _.set(this.userValueUpdate, this.key, this.valueUpdate);
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
            switch (this.key) {
                case 'email':
                    return {
                        required,
                        email
                    };

                case 'username':
                    return {
                        required,
                        maxLength: maxLength(10)
                    };

                case 'nif':
                    return {
                        required,
                        minLength: minLength(9),
                        maxLength: maxLength(9),
                        numeric
                    };
            }
        },
        passwordErrors() {
            const errors = [];
            if (!this.$v.password.$dirty) return errors;
            !this.$v.password.minLength &&
                errors.push('Password must be at most 8 characters long');
            !this.$v.password.required && errors.push('Password is required.');
            return errors;
        },
        repeatPasswordErrors() {
            const errors = [];
            if (!this.$v.repeatPassword.$dirty) return errors;
            if (
                !this.$v.repeatPassword.$dirty &&
                this.$v.repeatPassword !== this.$v.password
            )
                errors.push('Please make use the same password');
            if (!this.$v.repeatPassword.required) {
                errors.push('Password is required.');
            }

            return errors;
        },
        keyErrors() {
            const errors = [];
            if (this.key === 'nif') {
                if (!this.$v.valueUpdate.$dirty) return errors;
                !this.$v.valueUpdate.minLength &&
                    errors.push('Nif must be at most 9 characters long');
                !this.$v.valueUpdate.maxLength &&
                    errors.push(
                        'Nif should not be more that 9 characters long'
                    );
                !this.$v.valueUpdate.numeric &&
                    errors.push('Nif must be numeric.');
                !this.$v.valueUpdate.required &&
                    errors.push('Nif is required.');

                if (errors.length !== 0) this.submitStatus = 'ERROR';
                else this.submitStatus = 'OK';

                return errors;
            }

            if (this.key === 'email') {
                if (!this.$v.valueUpdate.$dirty) return errors;
                !this.$v.valueUpdate.email &&
                    errors.push('Must be valid e-mail');
                !this.$v.valueUpdate.required &&
                    errors.push('E-mail is required');

                if (errors.length !== 0) this.submitStatus = 'ERROR';
                else this.submitStatus = 'OK';

                return errors;
            }

            if (this.key === 'username') {
                if (!this.$v.valueUpdate.$dirty) return errors;
                !this.$v.valueUpdate.maxLength &&
                    errors.push('Username must be at most 10 characters long');
                !this.$v.valueUpdate.required &&
                    errors.push('Username is required.');

                if (errors.length !== 0) this.submitStatus = 'ERROR';
                else this.submitStatus = 'OK';

                return errors;
            }
        }
    }
};
</script>
