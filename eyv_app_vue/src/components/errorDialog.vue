<template>
    <v-dialog color="error" elevation="24" max-width="500" type="error" v-model="showErrors">
        <v-card>
            <v-toolbar color="red" dark>
                <v-toolbar-title>Some problem...</v-toolbar-title>
            </v-toolbar>

            <v-card-text class="d-flex pa-2">
                <p class="subtitle-2 text-center">
                    <v-icon>mdi-alert-box</v-icon>
                    {{error}}
                </p>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="$emit('closeDialog')" color="primary" text>Ok</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
    export default {
        name: 'dialogError',
        props: {
            error: {},
            showErrors: {}
        }
    }
</script>
