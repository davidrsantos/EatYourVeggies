<template>
    <div>
        <list-users @errorEvent="handleErrors"
                    v-show="this.$store.state.user!=null && this.$store.state.user.role ==='admin'"></list-users>
        <proposals @requestPasswordEvent="$emit('requestPasswordEvent')" v-show="this.$store.state.user!=null"></proposals>

    </div>
</template>

<script>
  export default {
    name: 'Home',
    data: () => ({
      items: [],
      timer: '',

      agents: []
    }),
    methods: {
      handleErrors (error) {
        this.$emit('errorEvent', error)
      },
      getItems () {
        /* axios.get('/records?recordType=vegetable').then(response => {
             this.items = response.data;
         })
             .catch(function (error) {
                 console.log(error);
             });
         axios.get('/agents').then(response => {
             this.agents = response.data;
         })
             .catch(function (error) {
                 console.log(error);
             });*/
      }
    },
    created () {
      this.getItems()
      this.timer = setInterval(this.getItems, 300000)
    },

  }
</script>
