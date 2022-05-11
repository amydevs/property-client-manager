<template>
    <ReminderEditor :id="reminder.id" :clientId="clientId" v-slot="slotProp">
        <v-list-item v-if="!slotProp.opened">
            <v-list-item-content>
                <v-list-item-title>{{reminder.title ? reminder.title : "No Title"}}</v-list-item-title>
                <v-list-item-subtitle>{{new Date(reminder.date).toLocaleString()}}</v-list-item-subtitle>
                <v-list-item-subtitle v-if="reminder.details.length !== 0" v-html="md.render(reminder.details)"/>

            </v-list-item-content>
            
            <v-btn icon v-if="!slotProp.opened" @click="slotProp.toggle(!slotProp.opened)">
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="remove(reminder)">
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <slot>
                
            </slot>
        </v-list-item>
    </ReminderEditor>
</template>
<script lang="ts">
import Vue from 'vue'
import { ClientsDB, Reminder } from '@/modules/ClientsDB'
import ReminderEditor from '@/components/Reminders/ReminderEditor.vue';
import mdit from "markdown-it";
import store, { StoreUtils } from "@/store";

export default Vue.extend({
    components: {
        ReminderEditor
    },
    mounted() {
    },
    data() {
        return {
            md: new mdit({
                linkify: true
            }) 
        }
    },
    props: {
        id: {
            type: String as () => string
        }
    },
    computed: {
        reminder:{
            get(): Reminder {
                return StoreUtils.findReminderById(this.id) as Reminder;
            },
            set(e: Reminder) {
                let acc = store.state.clientsdb?.clients.flatMap(c => c.reminders).find(r => r.id === this.id);
                if (acc) {
                    acc = e;
                }
            }
        },
        clientId: {
            get(): string {
                return store.state.clientsdb?.clients.find(c => c.reminders.includes(this.reminder))?.id as string;
            }
        }
    },
    methods: {
        remove() {
            this.$emit("remove", this.reminder);
            const clientrreminders = store.state.clientsdb?.clients.find(c => c.reminders.includes(this.reminder))?.reminders;
            clientrreminders?.splice(clientrreminders.indexOf(this.reminder), 1);
        }
    }
})
</script>