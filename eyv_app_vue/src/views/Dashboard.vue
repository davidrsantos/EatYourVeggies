<template>
    <v-container>
        <list-users @errorEvent="handleErrors"
                    v-show="this.$store.state.user!=null && this.$store.state.user.role ==='admin'"></list-users>
        <proposals @requestPasswordEvent="$emit('requestPasswordEvent')" v-show="this.$store.state.user!=null"></proposals>


    </v-container>
</template>

<script>
  import ManagerProducts from './ManagerProducts'
  export default {
    name: 'Home',
    components: { ManagerProducts },
    data: () => ({
      items: [],
      timer: '',

      agents: []
    }),
    methods: {
      handleErrors (error) {
        this.$emit('errorEvent', error)
      },
    },
    created () {
      this.timer = setInterval(this.getItems, 300000)
    },

  }
</script>
