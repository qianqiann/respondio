<template>
    <!-- Success dialog -->
    <v-dialog v-model="showDialog" max-width="400">
        <v-card>
            <v-card-title class="success-dialog-title">Success Dialog</v-card-title>
            <v-card-text>
                <!-- Customize the success message here -->
                {{ successMessage }}
            </v-card-text>
            <v-card-actions class="action_buttons">
                <v-btn color="success" @click="closeSuccessDialog">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data: () => ({
        showDialog: false
    }),
    props: {
        successMessage: {
            type: String,
            default: 'Operation was successful!'
        },
        successAlert: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        successAlert() {
            this.showDialog = this.successAlert
        }
    },
    methods: {
        closeSuccessDialog() {
            this.$router.push('/tasks');
        }
    }
}
</script>

<style scoped>
.action_buttons {
    display: flex;
    justify-content: center;
    justify-items: center;
}

.success-dialog-title {
    font-weight: bold;

}
</style>