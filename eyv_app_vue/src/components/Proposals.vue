<template>
    <v-container>
        <v-card>
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
            <v-data-table :headers="headers"
                          :items="proposals"
                          :loading="loading"
                          :search="search"
                          fixed-header
                          item-key="key"
                          sort-by="timestamp"

            >
                <template v-slot:item.timestamp="{ item }">
                    {{formatTimestamp(item.timestamp)}}
                </template>
                <template v-slot:item.actions="{ item }">
                    <div v-if="item.status ==='OPEN'">
                    <v-btn small
                            @click="acceptedProposal(item.recordId)"
                            color="green darken-1"
                    >
                        Accepted Proposal
                    </v-btn>
                    <v-btn small
                            @click="rejectedProposal(item.recordId)"
                            color="red darken-1"
                    >
                        Refused Proposal
                    </v-btn>
                    </div>
                </template>
            </v-data-table>
        </v-card>
        <v-card>
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
            <v-data-table :headers="headersProposalsSent"
                          :items="proposalsSent"
                          :loading="loading"
                          :search="search"
                          fixed-header
                          item-key="key"
                          sort-by="timestamp"

            >
                <template v-slot:item.timestamp="{ item }">
                    {{formatTimestamp(item.timestamp)}}
                </template>
                <template v-slot:item.actions="{ item }">
                    <div v-if="item.status ==='OPEN'">
                        <v-btn small
                               @click="cancelProposal(item.recordId, item.receivingAgent)"
                               color="green darken-1"
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

  import * as moment from 'moment'

  const payloads = require('../services/payloads')
  const transactions = require('../services/transactions')

  export default {
    name: 'proposals',
    data: () => ({
      loading: true,
      role:"OWNER",
      proposals: [],
      proposalsSent: [],
      search: '',
      headers: [
        { text: 'Data', value: 'timestamp'},
        { text: 'RecordId', value: 'recordId', },
        { text: 'Issuing User Public Key', value: 'issuingAgent'},
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      headersProposalsSent: [
        { text: 'Data', value: 'timestamp'},
        { text: 'RecordId', value: 'recordId', },
        { text: 'Receiving User Public Key', value: 'receivingAgent'},
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
    }),
    beforeMount () {
      this.getProposals()
      this.getProposalsSend()
    },
    methods: {
      refreshList() {
        this.getProposals()
      },
      refreshListProposalsSent(){
        this.getProposalsSend()
      },
      getProposals () {
        this.loading = true
        axios.get(`/proposals/${this.$store.state.user.publicKey}`).then(response => {
          this.proposals = response.data
          this.loading = false
        })
          .catch(function (error) {
            console.log(error)
            this.loading = false

          })
      },
      getProposalsSend() {
        this.loading = true
        axios.get(`/proposals-send/${this.$store.state.user.publicKey}`).then(response => {
          this.proposalsSent = response.data
          this.loading = false
        })
          .catch(function (error) {
            console.log(error)
            this.loading = false

          })
      },
      answerProposal(record, role, publicKey, response){
        let answerPayload = payloads.answerProposal({
          recordId: record,
          receivingAgent: publicKey,
          role,
          response
        })
        return transactions.submit([answerPayload], true).then(() => {
          console.log('Successfully submitted answer')
          if(response=== 2) {//2 == cancel no enum do proto
            this.refreshListProposalsSent();
          }else{
            this.refreshList();
          }
        }).catch(error=>{this.$emit('errorEvent', error)})
      },

        roleToEnum (role) {//todo perguntar as proffs se querem manter o custodiam e o reporter
        if (role = 'owner') {
          return payloads.createProposal.enum.OWNER
        } else if (role = 'custodian') {
          return payloads.createProposal.enum.CUSTODIAN
        } else if (role = 'reporter') {
          return payloads.createProposal.enum.REPORTER
        }
      },
      formatTimestamp (sec){
        if (!sec) {
          sec = Date.now() / 1000
        }
        return moment.unix(sec).format('DD-MM-YYYY')
      },
      acceptedProposal(recordId){
        this.answerProposal(recordId, this.roleToEnum(this.role), this.$store.state.user.publicKey, payloads.answerProposal.enum.ACCEPT)
      },
      rejectedProposal(recordId){
        this.answerProposal(recordId, this.roleToEnum(this.role), this.$store.state.user.publicKey, payloads.answerProposal.enum.REJECT)
      },
      cancelProposal(recordId,receivingAgent){
        this.answerProposal(recordId, this.roleToEnum(this.role), receivingAgent, payloads.answerProposal.enum.CANCEL)
      },
    }
  }
</script>

<style scoped>

</style>