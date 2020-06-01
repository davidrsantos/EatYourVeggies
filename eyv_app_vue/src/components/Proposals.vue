<template>
    <v-container>
        <v-card>
            <v-card-title>
                Proposals
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
                          sort-by="recordId"

            >

                <template v-slot:item.actions="{ item }">
                    <div v-if="item.status ==='OPEN'">
                    <v-btn
                            @click="acceptedProposal(item.recordId)"
                            color="green darken-1"
                    >
                        Answer Proposal
                    </v-btn>
                    <v-btn
                            @click="rejectedProposal(item.recordId)"
                            color="red darken-1"
                    >
                        Refused Proposal
                    </v-btn>
                    </div>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script>

  const payloads = require('../services/payloads')
  const transactions = require('../services/transactions')

  export default {
    name: 'proposals',
    data: () => ({
      loading: true,
      role:"OWNER",
      proposals: [],
      search: '',
      headers: [
        { text: 'RecordId', value: 'recordId', },
        { text: 'Issuing User', value: 'issuingAgent' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

    }),
    beforeMount () {
      this.getProposals()
    },
    methods: {
      refreshList () {
        this.getProposals()
      },
      getProposals () {
        this.loading = true
        axios.get(`/proposals/${this.$store.state.user.publicKey}`).then(response => {
          this.proposals = response.data
          console.log(this.proposals)
          this.loading = false
        })
          .catch(function (error) {
            console.log(error)
            this.loading = false

          })
      },
      answerProposal(record, role, publicKey, response){//todo @luana resolver como guardar o id do record e a resposta do user
        let answerPayload = payloads.answerProposal({
          recordId: record,
          receivingAgent: publicKey,
          role,
          response
        })
        return transactions.submit([answerPayload], true).then(() => {
          console.log('Successfully submitted answer')
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
      acceptedProposal(recordId){
        this.answerProposal(recordId, this.roleToEnum(this.role), this.$store.state.user.publicKey, payloads.answerProposal.enum.ACCEPT)
        this.refreshList();
      },
      rejectedProposal(recordId){
        this.answerProposal(recordId, this.roleToEnum(this.role), this.$store.state.user.publicKey, payloads.answerProposal.enum.REJECT)
        this.refreshList();
      }
    }
  }
</script>

<style scoped>

</style>