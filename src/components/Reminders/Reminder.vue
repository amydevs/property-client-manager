<template>
    <ReminderEditor v-model="reminder" v-slot="slotProp">
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
        </v-list-item>
    </ReminderEditor>
</template>
<script lang="ts">
import Vue from 'vue'
import { ClientsDB, Reminder } from '@/modules/ClientsDB'
import ReminderEditor from '@/components/Reminders/ReminderEditor.vue';
import mdit from "markdown-it";

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
        value: {
            type: Object as () => Reminder
        },
        reminders: {
            type: Array as () => Reminder[]
        }
    },
    computed: {
        reminder: {
            get(): Reminder {
                return this.value
            },
            set(e: Reminder) {
                this.$emit('input', e)
            }
        }
    },
    methods: {
        remove(inputReminder : Reminder) {
            if (this.$listeners['remove']) {
                this.$emit('remove')
            }
            else if (this.reminders) {
                this.reminders.splice(this.reminders.indexOf(inputReminder), 1)
            }
            else {
                const client = (this.$altStore.$data.clientsdb as ClientsDB).clients.find(c => {
                    return c.reminders.includes(inputReminder)
                })
                client?.reminders.splice(client?.reminders.indexOf(inputReminder), 1)
            }
        }
    }
})
</script>