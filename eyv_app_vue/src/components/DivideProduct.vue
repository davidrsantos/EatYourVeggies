<template>
    <v-card>
        <v-container>
            <v-card outlined>
                <v-container>
                    <v-card-title>Current Product</v-card-title>
                    <v-row>
                        <v-col>
                            <v-text-field
                                label="Batch"
                                outlined
                                readonly
                                v-model="product.recordId"
                            />
                        </v-col>
                        <v-col>
                            <v-text-field
                                :value="product.weight"
                                label="Weight (grams)"
                                outlined
                                readonly
                            />
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
            <v-container>
                <v-header
                    >Use the slider to choose the amount of products you want to
                    generate</v-header
                >

                <v-card-text>
                    <v-row>
                        <v-col class="pr-4">
                            <v-slider
                                :max="max"
                                :min="min"
                                class="align-center"
                                hide-details
                                v-model="slider"
                            >
                                <template v-slot:append>
                                    <v-text-field
                                        class="mt-0 pt-0"
                                        hide-details
                                        single-line
                                        style="width: 60px"
                                        type="number"
                                        v-model="slider"
                                    ></v-text-field>
                                </template>
                            </v-slider>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-container>
            <v-card flat>
                <v-container>
                    <v-card-title>New Products Properties</v-card-title>
                    <v-card-subtitle
                        >After you enter the new name, you will be able to
                        preview the generated products
                    </v-card-subtitle>
                    <form>
                        <v-row>
                            <v-col>
                                <v-card max-height="200">
                                    <v-container>
                                        <v-card-text>
                                            <v-text-field
                                                :counter="10"
                                                :error-messages="nameErrors"
                                                @blur="$v.name.$touch()"
                                                @input="$v.name.$touch()"
                                                hint="Add a new name for your product"
                                                label="New Name"
                                                required
                                                v-model="name"
                                            />

                                            <v-text-field
                                                label="New Weight (grams)"
                                                outlined
                                                readonly
                                                v-model="newWeights"
                                            />
                                        </v-card-text>
                                    </v-container>
                                </v-card>
                            </v-col>
                            <v-col>
                                <v-card max-height="200">
                                    <v-container>
                                        <v-card-title>
                                            Optional Properties</v-card-title
                                        >
                                        <v-card-subtitle
                                            >Check the box if you want to add a
                                            optional property
                                        </v-card-subtitle>
                                        <v-card-text>
                                            <v-row
                                                align="center"
                                                justify="center"
                                            >
                                                <v-checkbox
                                                    dense
                                                    v-model="
                                                        expirationDateCheck
                                                    "
                                                ></v-checkbox>
                                                <v-menu
                                                    :close-on-content-click="
                                                        false
                                                    "
                                                    :nudge-right="40"
                                                    min-width="290px"
                                                    offset-y
                                                    transition="scale-transition"
                                                    v-model="menuExpirationDate"
                                                >
                                                    <template
                                                        v-slot:activator="{
                                                            on
                                                        }"
                                                    >
                                                        <v-text-field
                                                            :counter="10"
                                                            :disabled="
                                                                !expirationDateCheck
                                                            "
                                                            :error-messages="
                                                                expirationDateErrors
                                                            "
                                                            @blur="
                                                                $v.expirationDate.$touch()
                                                            "
                                                            @input="
                                                                $v.expirationDate.$touch()
                                                            "
                                                            label="Expiration Date"
                                                            readonly
                                                            v-model="
                                                                expirationDate
                                                            "
                                                            v-on="on"
                                                        ></v-text-field>
                                                    </template>
                                                    <v-date-picker
                                                        @input="
                                                            menuExpirationDate = false
                                                        "
                                                        v-model="expirationDate"
                                                    ></v-date-picker>
                                                </v-menu>
                                                <v-checkbox
                                                    dense
                                                    v-model="packingDateCheck"
                                                ></v-checkbox>
                                                <v-menu
                                                    :close-on-content-click="
                                                        false
                                                    "
                                                    :nudge-right="40"
                                                    min-width="290px"
                                                    offset-y
                                                    transition="scale-transition"
                                                    v-model="menuPackingDate"
                                                >
                                                    <template
                                                        v-slot:activator="{
                                                            on
                                                        }"
                                                    >
                                                        <v-text-field
                                                            :counter="10"
                                                            :disabled="
                                                                !packingDateCheck
                                                            "
                                                            :error-messages="
                                                                packingDateErrors
                                                            "
                                                            @blur="
                                                                $v.packingDate.$touch()
                                                            "
                                                            @input="
                                                                $v.packingDate.$touch()
                                                            "
                                                            label="Packing Date"
                                                            readonly
                                                            v-model="
                                                                packingDate
                                                            "
                                                            v-on="on"
                                                        ></v-text-field>
                                                    </template>
                                                    <v-date-picker
                                                        @input="
                                                            menuPackingDate = false
                                                        "
                                                        v-model="packingDate"
                                                    ></v-date-picker>
                                                </v-menu>
                                            </v-row>
                                        </v-card-text>
                                    </v-container>
                                </v-card>
                            </v-col>
                        </v-row>
                        <!--      <v-btn :disabled="submitStatus==='ERROR'" @click="submit" class="mr-4">submit</v-btn>
                              <v-btn @click="clear">clear</v-btn>-->
                    </form>
                </v-container>
            </v-card>
            <v-card color="green" v-if="slider > 1 && name != null">
                <v-card-title>
                    List of new products generated
                </v-card-title>
                <v-card-subtitle>
                    It will generate {{ slider }} products with
                    {{ newWeights }} grams each</v-card-subtitle
                >
                <v-container>
                    <v-data-table
                        :headers="headers"
                        :items="records"
                        class="elevation-1"
                        dense
                    >
                    </v-data-table>
                </v-container>
            </v-card>

            <v-row justify="center">
                <v-btn @click="submit" color="green" dark x-large
                    >Generate</v-btn
                >
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
import * as payloads from '../services/payloads';
import * as parsing from '../services/parsing';
import * as transactions from '../services/transactions';
import { validationMixin } from 'vuelidate';
import {
    alpha,
    decimal,
    maxLength,
    minLength,
    minValue,
    required
} from 'vuelidate/lib/validators';

export default {
    name: 'DivideProduct',
    props: ['product'],

    mixins: [validationMixin],

    validations: {
        name: {
            required,
            maxLength: maxLength(50),
            minLength: minLength(2),
            alpha
        },

        weight: {
            required,
            decimal,
            maxLength: maxLength(10),
            minLength: minLength(1),
            minValue: minValue(0.01)
        },

        expirationDate: {
            maxLength: maxLength(11)
        },
        packingDate: {
            maxLength: maxLength(11)
        }
    },

    data() {
        return {
            min: 1,
            max:
                this.product.weight < 1000
                    ? Math.floor(this.product.weight)
                    : 1000, //Protection
            slider: 1,
            plus: 1,

            name: null,
            weight: '',

            expirationDate: null,
            packingDate: null,
            expirationDateCheck: false,
            packingDateCheck: false,
            menu: false,
            menuExpirationDate: false,
            menuPackingDate: false,

            records: null,
            headers: [
                { text: 'Batch', value: 'batch' },
                { text: 'Name', value: 'name' },
                { text: 'Classification', value: 'classification' },
                { text: 'Origin', value: 'origin' },
                { text: 'Cultivation Process', value: 'cultivationProcess' },
                { text: 'Size', value: 'size' },
                { text: 'Weight', value: 'weight' },
                { text: 'HarvestDate', value: 'harvestDate' },
                { text: 'ExpirationDate', value: 'expirationDate' },
                { text: 'PackingDate', value: 'packingDate' },
                { text: 'Latitude', value: 'latitude' },
                { text: 'Longitude', value: 'longitude' }
            ]
        };
    },
    watch: {
        slider: function() {
            this.table();
        },
        name: function() {
            this.table();
        },
        expirationDate: function() {
            this.table();
        },
        packingDate: function() {
            this.table();
        }
    },

    computed: {
        newWeights: function() {
            return (this.product.weight / this.slider).toFixed(2);
        },

        nameErrors() {
            const errors = [];
            if (!this.$v.name.$dirty) return errors;
            !this.$v.name.maxLength &&
                errors.push(
                    'The name should not be more that 50 characters long'
                );
            !this.$v.name.minLength &&
                errors.push('The name must be at most 1 characters long');
            !this.$v.name.required && errors.push('Name is required.');

            if (errors.length !== 0) this.submitStatus = 'ERROR';
            else this.submitStatus = 'OK';
            return errors;
        },

        weightErrors() {
            const errors = [];
            if (!this.$v.weight.$dirty) return errors;
            !this.$v.weight.minLength &&
                errors.push('The weight must be at most 1 characters long');
            !this.$v.weight.maxLength &&
                errors.push(
                    'The weight should not be more that 10 characters long'
                );
            !this.$v.weight.required && errors.push('Weight is required.');
            !this.$v.weight.decimal &&
                errors.push('The weight must be a decimal number.');
            !this.$v.weight.minValue &&
                errors.push('The weight must be greater than zero');

            if (errors.length !== 0) this.submitStatus = 'ERROR';
            else this.submitStatus = 'OK';
            return errors;
        },

        expirationDateErrors() {
            const errors = [];
            if (!this.$v.expirationDate.$dirty) return errors;
            !this.$v.expirationDate.maxLength &&
                errors.push(
                    'The expiration date should not be more that 11 characters long'
                );

            if (errors.length !== 0) this.submitStatus = 'ERROR';
            else this.submitStatus = 'OK';
            return errors;
        },
        packingDateErrors() {
            const errors = [];
            if (!this.$v.packingDate.$dirty) return errors;
            !this.$v.packingDate.maxLength &&
                errors.push(
                    'The packingDate should not be more that 11 characters long'
                );

            if (errors.length !== 0) this.submitStatus = 'ERROR';
            else this.submitStatus = 'OK';
            return errors;
        }
    },
    methods: {
        table() {
            this.records = [];
            for (let i = 1; i <= this.slider; i++) {
                let record = {
                    batch: this.product.recordId + '-' + i,
                    name: this.name,
                    classification: this.product.classification,
                    origin: this.product.origin,
                    cultivationProcess: this.product.cultivationProcess,
                    size: this.product.size,
                    weight: this.newWeights,
                    harvestDate: this.product.harvestDate,
                    expirationDate: this.expirationDate,
                    packingDate: this.packingDate,
                    latitude: this.product.latitude,
                    longitude: this.product.latitude
                };
                this.records.push(record);
            }
        },

        submit: function() {
            let recordsPayload = this.records.map(record =>
                payloads.createRecord({
                    recordId: record.batch,
                    recordType: 'vegetable',
                    properties: [
                        {
                            name: 'name',
                            stringValue: record.name,
                            dataType: payloads.createRecord.enum.STRING
                        },
                        {
                            name: 'classification',
                            stringValue: record.classification,
                            dataType: payloads.createRecord.enum.STRING
                        },
                        {
                            name: 'origin',
                            stringValue: record.origin,
                            dataType: payloads.createRecord.enum.STRING
                        },
                        {
                            name: 'cultivationProcess',
                            stringValue: record.cultivationProcess,
                            dataType: payloads.createRecord.enum.STRING
                        },
                        {
                            name: 'weight',
                            numberValue: parsing.toInt(record.weight),
                            dataType: payloads.createRecord.enum.NUMBER
                        },
                        {
                            name: 'size',
                            numberValue: parsing.toInt(record.size),
                            dataType: payloads.createRecord.enum.NUMBER
                        },
                        {
                            name: 'harvestDate',
                            timestampValue:
                                new Date(record.harvestDate).getTime() / 1000,
                            dataType: payloads.createRecord.enum.TIMESTAMP
                        },
                        {
                            name: 'expirationDate',
                            timestampValue:
                                record.expirationDate !== null
                                    ? new Date(
                                          record.expirationDate
                                      ).getTime() / 1000
                                    : null,
                            dataType: payloads.createRecord.enum.TIMESTAMP
                        },
                        {
                            name: 'packingDate',
                            timestampValue:
                                record.expirationDate !== null
                                    ? new Date(record.packingDate).getTime() /
                                      1000
                                    : null,
                            dataType: payloads.createRecord.enum.TIMESTAMP
                        },
                        {
                            name: 'location',
                            locationValue: {
                                latitude: parsing.toInt(record.latitude),
                                longitude: parsing.toInt(record.longitude)
                            },
                            dataType: payloads.createRecord.enum.LOCATION
                        }
                    ]
                })
            );
            let transactionNumber = 0;
            while (recordsPayload.length > 140) {
                let toSend = recordsPayload.slice(0, 140);
                recordsPayload = recordsPayload.slice(140);
                this.transitionSubmit(toSend, ++transactionNumber);
            }
            this.transitionSubmit(recordsPayload, ++transactionNumber);
        },

        transitionSubmit(recordsPayload, transactionNumber) {
            this.$snotify.async(
                'Transaction Number: ' +
                    transactionNumber +
                    ' \n Adding product to the blockchain \n This may take a while...',
                'Adding Products',
                () => {
                    return new Promise((resolve, reject) => {
                        return transactions
                            .submit(recordsPayload, true)
                            .then(() => this.justify())
                            .then(() => this.finalizeProductSubmit())
                            .then(response => {
                                if (
                                    response.status &&
                                    response.type === undefined
                                ) {
                                    setTimeout(
                                        () =>
                                            resolve({
                                                title: 'Success',
                                                body:
                                                    'Successfully submitted products',
                                                config: {
                                                    showProgressBar: true,
                                                    closeOnClick: true,
                                                    timeout: 8000
                                                }
                                            }),
                                        2000
                                    );
                                }
                            })
                            .catch(error => {
                                if (error === 'requestPassword') {
                                    this.$emit('requestPasswordEvent');
                                    reject({
                                        title: 'Error',
                                        body: '',
                                        icon: false,
                                        config: {
                                            timeout: 1
                                        }
                                    });
                                } else {
                                    console.error(error);
                                    setTimeout(
                                        () =>
                                            reject({
                                                title: 'Error',
                                                body: error,
                                                config: {
                                                    showProgressBar: true,
                                                    closeOnClick: true,
                                                    timeout: 8000
                                                }
                                            }),
                                        2000
                                    );
                                }
                            });
                    });
                }
            );
        },

        finalizeProductSubmit() {
            let finalizePayload = payloads.finalizeRecord({
                recordId: this.product.recordId
            });
            return transactions
                .submit([finalizePayload], true)
                .then(response => {
                    if (response.status && response.type === undefined) {
                        this.$emit('close');
                        return response;
                    }
                })
                .catch(error => {
                    console.error(error);
                    if (error === 'requestPassword') {
                        this.$emit('requestPasswordEvent');
                    } else {
                        throw error;
                    }
                });
        },

        updateProperty(record, value) {
            let updatePayload = payloads.updateProperties({
                recordId: record,
                properties: [value]
            });
            return transactions
                .submit([updatePayload], true)
                .then(response => {
                    if (response.status && response.type === undefined) {
                        return response;
                    }
                })
                .catch(error => {
                    console.error(error);
                    if (error === 'requestPassword') {
                        this.$emit('requestPasswordEvent');
                    } else {
                        throw error;
                    }
                });
        },
        justify() {
            this.updateProperty(this.product.recordId, {
                name: 'finalizeJustification',
                stringValue: 'Divide Product',
                dataType: payloads.updateProperties.enum.STRING
            });
        }
    }
};
</script>

<style scoped></style>
