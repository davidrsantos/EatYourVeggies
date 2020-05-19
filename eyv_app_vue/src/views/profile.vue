<template>
    <v-container>
        <user-details :user-prop="user" myself="true"></user-details>
    </v-container>
</template>

<script>
  export default {
    name: 'profile',

    data: () => ({

      user: {
        name: '',
        username: '',
        email: '',
        nif: '',
        role: '',
      },

    }),
    created: function () {
      if (this.$store.state.user != null) {
        this.user = this.$store.state.user

      }

    },

  }

</script>

