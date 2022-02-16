<template>
<div>
    <v-list>
        <template v-for="(reminder, i) in sortedReminders">
            <ReminderEditor v-model="sortedReminders[i]" v-slot="slotProp" :key="i">
                <v-list-item v-if="!slotProp.opened">
                    <v-list-item-content>
                        <v-list-item-title>{{reminder.title}}</v-list-item-title>
                        <v-list-item-subtitle>{{reminder.details}}</v-list-item-subtitle>
                        <div v-if="reminder.details.length !== 0" v-html="md.render(reminder.details)"></div>

                    </v-list-item-content>
                    
                    <v-btn icon v-if="!slotProp.opened" @click="slotProp.toggle(!slotProp.opened)">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                </v-list-item>
            </ReminderEditor>
            <v-divider :key="`divfor-${i}`"/>
        </template>
    </v-list>
    <v-container>
        <ReminderEditor v-model="cleanReminder" v-slot="slotProp">
            <v-btn style="width: 100%" dense v-if="!slotProp.opened" @click="slotProp.toggle(!slotProp.opened)"
                color="green">
                Create Reminder
            </v-btn>
        </ReminderEditor>
    </v-container>
</div>
</template>
<script lang="ts">
import ReminderEditor from '@/components/Reminders/ReminderEditor.vue';

import { Reminder, Client } from '@/modules/ClientsDB'
import { format, parseISO, parse } from 'date-fns'
import mdit from "markdown-it";


import Vue from 'vue'
export default Vue.extend({
    components: {
        ReminderEditor
    },
    props: {
        value: {
            type: Object as () => Client
        }
    },
    methods: {
        addReminder() {
            this.value?.reminders.push(this.newReminder)
        },
    },
    data() {
        return {
            createNewReminderOpen: false,
            newReminder: new Reminder(),

            tempDate: "",
            tempTime: "",
            dateMenu: false,
            timeMenu: false,

            md: new mdit({
                linkify: true
            })
        }
    },
    mounted() {
        this.tempDate = format(parseISO(new Date(this.newReminder.date).toISOString()), "yyyy-MM-dd")
        this.tempTime = format(parseISO(new Date(this.newReminder.date).toISOString()), "HH:mm")
    },
    computed: {
        cleanReminder: {
            get() {
                return undefined;
            },
            set(newValue: Reminder) {
                this.value?.reminders.push(newValue)
            }
        },
        sortedReminders() {
            return this.value.reminders.sort((a,b) => {return new Date(b.date).getTime() - new Date(a.date).getTime();})
        }
    },
    watch: {
        tempDate(e: string) {
            const tmpDate = parse(e, "yyyy-MM-dd" ,new Date());
            const actualDate = new Date(this.newReminder.date);
            actualDate.setDate(tmpDate.getDate());
            actualDate.setMonth(tmpDate.getMonth());
            actualDate.setFullYear(tmpDate.getFullYear());
            this.newReminder.date = actualDate
        },
        tempTime(e: string) {
            const tmpDate = parse(e, "HH:mm" ,new Date());
            const actualDate = new Date(this.newReminder.date);
            actualDate.setSeconds(tmpDate.getSeconds());
            actualDate.setMinutes(tmpDate.getMinutes());
            actualDate.setHours(tmpDate.getHours());
            this.newReminder.date = actualDate
        }
    }
})
</script>