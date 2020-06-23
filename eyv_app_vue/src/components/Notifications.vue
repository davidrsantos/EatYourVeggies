<template>
    <v-container
            fill-height
            fluid
           >
        <v-card-text>


                    <material-notification
                            class="mb-3"
                            color="info"
                            dismissible
                    >
                        <strong>INFO</strong> - This is a regular notification made with `color="info"`
                    </material-notification>

                    <material-notification
                            class="mb-3"
                            color="success"
                            dismissible
                    >
                        <strong>SUCCESS</strong> - This is a regular notification made with `color="success"`
                    </material-notification>

                    <material-notification
                            class="mb-3"
                            color="warning"
                            dismissible
                    >
                        <strong>WARNING</strong> - This is a regular notification made with `color="warning"`
                    </material-notification>

                    <material-notification
                            class="mb-3"
                            color="error"
                            dismissible
                    >
                        <strong>DANGER</strong> - This is a regular notification made with `color="error"`
                    </material-notification>

                    <material-notification
                            class="mb-3"
                            color="purple"
                            dismissible
                    >
                        <strong>PRIMARY</strong> - This is a regular notification made with `color="purple"`
                    </material-notification>
                    <material-notification
                            class="mb-3"
                            color="general"
                            dismissible
                    >
                        <strong>GENERAL</strong> - This is a regular notification made with `color="general"`
                    </material-notification>

        </v-card-text>

    </v-container>
</template>

<script>
  export default {
    name: 'Notifications',
    data: () => ({
      color: null,
      colors: [
        'purple',
        'info',
        'success',
        'warning',
        'error'
      ],
      top: true,
      bottom: false,
      left: false,
      right: false,
      snackbar: false
    }),
    methods: {
      snack (...args) {
        this.top = false
        this.bottom = false
        this.left = false
        this.right = false
        for (const loc of args) {
          this[loc] = true
        }
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)]
        this.snackbar = true
      }
    }
  }
</script>
