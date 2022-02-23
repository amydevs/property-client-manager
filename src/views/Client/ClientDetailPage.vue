<template>
<div>
    <v-container>
        <v-row class="justify-center mb-1">
            <client-comp :client="client"/>
        </v-row>
        <v-card class="flex-grow-1 mb-3">
            <v-card-title>Details</v-card-title>
            <v-divider />
            <v-list>
                <template v-for="([key, value], i) in details">
                        <v-list-item :key="i">
                            <v-list-item-content>
                                <v-list-item-title>{{clientInfo[key].name}}</v-list-item-title>
                                <v-list-item-subtitle v-if="typeof value === 'boolean'">{{value ? 'Yes' : 'No'}}</v-list-item-subtitle>
                                <v-list-item-subtitle v-else-if="typeof value === 'string'">{{ value.length === 0 ? "No Value" : value }}</v-list-item-subtitle>
                            </v-list-item-content>
        
                        </v-list-item>
                    <v-divider :key="`divfor-${i}`" v-if="details.length-1 !== i"/>
                </template>
            </v-list>
        </v-card>

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
    <v-speed-dial
        v-model="spdDial"
        bottom
        right
        fixed
        open-on-hover
        transition="slide-y-reverse-transition"
    >
        <template v-slot:activator>
            <v-btn
                v-model="spdDial"
                :to="{path: `/client-create/${client.id}`}"
                fab
                color="primary"
            >
                <v-icon dark>
                    mdi-account-edit
                </v-icon>
            </v-btn>
        </template>
        <v-btn
            fab
            @click="openFolder"
            color="orange"
        >
            <v-icon dark>
                mdi-folder-account
            </v-icon>
        </v-btn>
        <v-btn
            fab
            @click="deleteCurrent"
            color="red"
        >
            <v-icon dark>
                mdi-delete
            </v-icon>
        </v-btn>
    </v-speed-dial>
    <!-- <v-btn
        fab 
        fixed
        bottom
        left
        @click="openFolder"
        color="primary"
        :style="{ left: '50%', transform:'translateX(-50%)'}"
    >
        <v-icon dark>
            mdi-folder-account
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
    </v-btn> -->

     <v-footer app bottom fixed padless class="px-1 text-caption">
        Updated: {{ new Date(client.updated).toLocaleString() }}
        <v-spacer />
        Created: {{ new Date(client.created).toLocaleString() }}
     </v-footer>
</div>
</template>
<script lang="ts">
import ClientComp from '@/components/Client/Client.vue'
import ClientReminders from '@/components/Reminders/RemindersContainer.vue'

import path from "path";
import mdit from "markdown-it";
const md = new mdit({
    linkify: true
});

import { Client, ClientInfo, ClientsDB, Reminder } from '@/modules/ClientsDB'
import Vue from 'vue'
export default Vue.extend({
    components: {
        ClientComp,
        ClientReminders
    },
    data() {
        return {
            spdDial: false,
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
    methods: {
        openFolder() {
            if (this.client) window.electron.shell.openPath(path.join((this.$altStore.$data.clientsdb as ClientsDB).clientsPath, this.client?.id));
        },
        deleteCurrent() {
            const clientdb = this.$altStore.$data.clientsdb as ClientsDB | null;
            if (clientdb) {
                clientdb.clients.splice(clientdb.clients.findIndex( (c) => c.id === this.client?.id), 1) 
                this.$router.go(-1)
            }
        }
    },
    watch: {
    },
    computed: {
        details(): [string, any][] {
            return Object.entries((this as any).client).filter(([k, v]) => !(this as any).clientInfo[k].hidden)
        },
        client(): Client | undefined {
            return (this.$altStore.$data.clientsdb as ClientsDB).clients.find( (c) => c.id === this.$route.params.id)
        },
        btnHeight(): number {
            if (!this.$refs.backBtn) return 56
            return (this.$refs.backBtn as any).$el.offsetHeight as number;
        }
    }
})
</script>
<style lang="scss">
</style>