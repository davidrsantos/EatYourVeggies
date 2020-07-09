<template>
    <v-container>
        <v-card v-show="this.$store.state.user.role !== 'producer'">
            <v-card-title>
                Proposals Received
                <v-spacer></v-spacer>
                <v-text-field
                    append-icon="mdi-magnify"
                    hide-details
                    label="Search"
                    single-line
                    v-model="search"
                ></v-text-field>
            </v-card-title>
            <v-data-table
                :headers="headers"
                :items="proposals"
                :loading="loading"
                :search="search"
                fixed-header
                item-key="key"
                sort-by="timestamp"
            >
                <template v-slot:item.timestamp="{ item }">
                    {{ formatTimestamp(item.timestamp) }}
                </template>
                <template v-slot:item.actions="{ item }">
                    <div v-if="item.status === 'OPEN'">
                        <v-btn
                            @click="acceptedProposal(item.recordId)"
                            color="green darken-1"
                            small
                        >
                            Accepted Proposal
                        </v-btn>
                        <v-btn
                            @click="rejectedProposal(item.recordId)"
                            color="red darken-1"
                            small
                        >
                            Refused Proposal
                        </v-btn>
                    </div>
                </template>
            </v-data-table>
        </v-card>
        <v-card v-show="$store.state.user.role !== 'customer'">
            <v-card-title>
                Proposals Sent
                <v-spacer></v-spacer>
                <v-text-field
                    append-icon="mdi-magnify"
                    hide-details
                    label="Search"
                    single-line
                    v-model="search"
                ></v-text-field>
            </v-card-title>
            <v-data-table
                :headers="headersProposalsSent"
                :items="proposalsSent"
                :loading="loading"
                :search="search"
                fixed-header
                item-key="key"
                sort-by="timestamp"
            >
                <template v-slot:item.timestamp="{ item }">
                    {{ formatTimestamp(item.timestamp) }}
                </template>
                <template v-slot:item.actions="{ item }">
                    <div v-if="item.status === 'OPEN'">
                        <v-btn
                            @click="
                                cancelProposal(
                                    item.recordId,
                                    item.receivingAgent
                                )
                            "
                            color="red darken-1"
                            small
                        >
                            Cancel Proposal
                        </v-btn>
                    </div>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script>
import * as moment from 'moment';

const payloads = require('../services/payloads');
const transactions = require('../services/transactions');

export default {
    name: 'proposals',
    data: () => ({
        loading: true,
        role: 'OWNER',
        proposals: [],
        proposalsSent: [],
        search: '',
        headers: [
            { text: 'Data', value: 'timestamp' },
            { text: 'RecordId', value: 'recordId' },
            { text: 'Issuing User Public Key', value: 'issuingAgent' },
            { text: 'Status', value: 'status' },
            { text: 'Actions', value: 'actions', sortable: false }
        ],
        headersProposalsSent: [
            { text: 'Data', value: 'timestamp' },
            { text: 'RecordId', value: 'recordId' },
            { text: 'Receiving User Public Key', value: 'receivingAgent' },
            { text: 'Status', value: 'status' },
            { text: 'Actions', value: 'actions', sortable: false }
        ]
    }),
    beforeMount() {
        this.getProposals();
        this.getProposalsSend();
    },
    methods: {
        refreshList() {
            this.getProposals();
        },
        refreshListProposalsSent() {
            this.getProposalsSend();
        },
        getProposals() {
            this.loading = true;
            axios
                .get(`/proposals/${this.$store.state.user.publicKey}`)
                .then(response => {
                    this.proposals = response.data;
                    this.loading = false;
                })
                .catch(function(error) {
                    console.error(error);
                    this.loading = false;
                });
        },
        getProposalsSend() {
            this.loading = true;
            axios
                .get(`/proposals-send/${this.$store.state.user.publicKey}`)
                .then(response => {
                    this.proposalsSent = response.data;
                    this.loading = false;
                })
                .catch(function(error) {
                    console.error(error);
                    this.loading = false;
                });
        },
        answerProposal(record, role, publicKey, response) {
            let answerPayload = payloads.answerProposal({
                recordId: record,
                receivingAgent: publicKey,
                role,
                response
            });
            this.$snotify.async(
                'Submitting your answer',
                'Submitting Answer',
                () => {
                    return new Promise((resolve, reject) => {
                        return transactions
                            .submit([answerPayload], true)
                            .then(res => {
                                if (
                                    response ===
                                    payloads.answerProposal.enum.ACCEPT
                                ) {
                                    return this.justify(record);
                                }
                                return res;
                            })
                            .then(res => {
                                if (
                                    response ===
                                    payloads.answerProposal.enum.ACCEPT
                                ) {
                                    return this.finalizeProductSubmit(record);
                                }
                                return res;
                            })
                            .then(res => {
                                if (res.status && res.type === undefined) {
                                    setTimeout(
                                        () =>
                                            resolve({
                                                title: 'Success',
                                                body:
                                                    'Successfully submitted answer',
                                                config: {
                                                    showProgressBar: true,
                                                    closeOnClick: true,
                                                    timeout: 8000
                                                }
                                            }),
                                        2000
                                    );
                                    if (response === 2) {
                                        //2 == cancel no enum do proto
                                        this.refreshListProposalsSent();
                                    } else {
                                        this.refreshList();
                                    }
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

        finalizeProductSubmit(record) {
            let finalizePayload = payloads.finalizeRecord({
                recordId: record
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
        justify(record) {
            this.updateProperty(record, {
                name: 'finalizeJustification',
                stringValue: 'Transfer to Customer',
                dataType: payloads.updateProperties.enum.STRING
            });
        },
        roleToEnum(role) {
            //todo for the future
            if ((role = 'owner')) {
                return payloads.createProposal.enum.OWNER;
            } else if ((role = 'custodian')) {
                return payloads.createProposal.enum.CUSTODIAN;
            } else if ((role = 'reporter')) {
                return payloads.createProposal.enum.REPORTER;
            }
        },
        formatTimestamp(sec) {
            if (!sec) {
                sec = Date.now() / 1000;
            }
            return moment.unix(sec).format('DD-MM-YYYY');
        },
        acceptedProposal(recordId) {
            this.answerProposal(
                recordId,
                this.roleToEnum(this.role),
                this.$store.state.user.publicKey,
                payloads.answerProposal.enum.ACCEPT
            );
        },
        rejectedProposal(recordId) {
            this.answerProposal(
                recordId,
                this.roleToEnum(this.role),
                this.$store.state.user.publicKey,
                payloads.answerProposal.enum.REJECT
            );
        },
        cancelProposal(recordId, receivingAgent) {
            this.answerProposal(
                recordId,
                this.roleToEnum(this.role),
                receivingAgent,
                payloads.answerProposal.enum.CANCEL
            );
        }
    }
};
</script>

<style scoped></style>
