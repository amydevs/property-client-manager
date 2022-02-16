<template>
<div>
    <v-container>
        <v-row class="justify-center mb-1">
            <client-comp :client="client"/>
        </v-row>
        <v-card class="flex-grow-1 mb-3">
            <v-card-title>Notes</v-card-title>
            <v-card-text v-html="markdownInfo"></v-card-text>
        </v-card>

        <v-card class="flex-grow-1 mb-3">
            <v-card-title>Reminders</v-card-title>
            <v-divider />
            <ClientReminders v-model="client"/>
        </v-card>
    </v-container>
    <v-btn
        fab 
        fixed
        left
        bottom
        @click="$router.go(-1)"
        color="primary"
    >
        <v-icon dark>
            mdi-arrow-left
        </v-icon>
    </v-btn>
    <v-btn
        fab 
        fixed
        right
        bottom
        :to="{path: `/client-create/${client.id}`}"
        color="primary"
    >
        <v-icon dark>
            mdi-account-edit
        </v-icon>
    </v-btn>

     <v-footer app bottom fixed padless class="px-1 text-caption">
        Updated: {{ new Date(client.updated).toLocaleString() }}
        <v-spacer />
        Created: {{ new Date(client.created).toLocaleString() }}
     </v-footer>
</div>
</template>
<script lang="ts">
import ClientComp from '@/components/Client/Client.vue'
import ClientReminders from '@/components/Client/Reminders.vue'

import mdit from "markdown-it";
const md = new mdit({
    linkify: true
});

import { ClientInfo, Reminder } from '@/modules/ClientsDB'
import Vue from 'vue'
export default Vue.extend({
    components: {
        ClientComp,
        ClientReminders
    },
    data() {
        return {
            client: window.electron.clients.get()?.clients.find( (c) => c.id === this.$route.params.id),
            markdownInfo: "",
            clientInfo: new ClientInfo(),
            createNewReminderOpen: false,
            newReminder: {
                title: "",
                details: "",
                date: new Date()
            } as Reminder
        }
    },
    mounted() {
        if (this.client) {
            this.markdownInfo = md.render(this.client.notes);
        }
    },
    computed: {
        btnHeight() {
            if (!this.$refs.backBtn) return 56
            return (this.$refs.backBtn as any).$el.offsetHeight as number;
        }
    }
})
</script>
<style lang="scss">
</style>