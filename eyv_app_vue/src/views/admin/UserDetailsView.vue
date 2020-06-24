<template>
    <div v-model="user" >
    <user-details :user-prop="user" v-on:errorEvent="handleErrors"></user-details>
    </div>
</template>

<script>
  export default {
    name: 'UserDetailsView',
    data: () => ({
      user: null,
    }),
    methods: {
      getUser () {
        console.log(this.$route.params.publicKey)
        axios.get(`agents/${this.$route.params.publicKey}`)
          .then(res => {
            console.log(res.data)
            this.user = res.data
            console.log(this.user)
          }).catch(error => {
          this.$emit('errorEvent', error)
        })
      },
      handleErrors (error) {
        console.log(error)
        this.$emit('errorEvent', error)
      },
    },
    beforeMount () {
      this.getUser()
    }
  }
</script>

<style scoped>

</style>