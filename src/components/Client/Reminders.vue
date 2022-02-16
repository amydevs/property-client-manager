<template>
<div>
    <v-list>
        <template v-for="(reminder, i) in sortedReminders">
            <v-list-item :key="i">
                <v-list-item-content>
                    <v-list-item-title>{{reminder.title}}</v-list-item-title>
                    <v-list-item-subtitle>{{reminder.details}}</v-list-item-subtitle>

                </v-list-item-content>
            </v-list-item>
            <v-divider :key="`divfor-${i}`"/>
        </template>
    </v-list>
    <v-container>
        <v-form class="new-form">
            <div v-if="createNewReminderOpen">
                <v-container> <v-text-field label="Title" hide-details="auto" outlined dense v-model="newReminder.title"/></v-container>
                <v-container> <v-textarea label="Details" hide-details="auto" outlined dense rows="2" v-model="newReminder.details"/></v-container>
                <v-container>
                <v-menu
                    ref="menu"
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="tempDate"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        hide-details="auto"
                        v-model="tempDate"
                        outlined
                        dense
                        label="Date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                </template>
                    <v-date-picker
                        v-model="tempDate"
                    ></v-date-picker>
                </v-menu>
                </v-container>
                <v-container>
                    <v-menu
                        ref="menu"
                        v-model="timeMenu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="tempTime"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                    >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            hide-details="auto"
                            v-model="tempTime"
                            outlined
                            dense
                            label="Time"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                        ></v-text-field>
                    </template>
                        <v-time-picker
                            v-model="tempTime"
                            ampm-in-title
                        ></v-time-picker>
                    </v-menu>
                </v-container>
                <v-container>
                    <v-btn style="width: 100%" dense @click="createNewReminderOpen = false" color="red">Cancel</v-btn>
                </v-container>
            </div>
            <v-container>
                <v-btn style="width: 100%" dense @click="createNewReminderOpen ? addReminder() : createNewReminderOpen = true" color="green">Add Reminder</v-btn>
            </v-container>
        </v-form>
    </v-container>
</div>
</template>
<script lang="ts">
import { Reminder, Client } from '@/modules/ClientsDB'
import { format, parseISO, parse } from 'date-fns'

import Vue from 'vue'
export default Vue.extend({
    props: {
        value: {
            type: Object as () => Client
        }
    },
    methods: {
        addReminder() {
            this.value?.reminders.push(this.newReminder)
            const tempDb = window.electron.clients.get();
            let existingClientIndex = tempDb?.clients.findIndex((e) => e.id === this.$route.params.id);
            

            if (tempDb && this.value && typeof existingClientIndex === "number" && existingClientIndex !== -1) {
                tempDb.clients[existingClientIndex] = this.value;
                window.electron.clients.write(tempDb);
            }
            this.$emit('input', this.value)
        },
    },
    data() {
        return {
            createNewReminderOpen: false,
            newReminder: {
                title: "",
                details: "",
                date: new Date()
            } as Reminder,

            menu1: false,
            tempDate: "",
            tempTime: "",
            dateMenu: false,
            timeMenu: false
        }
    },
    mounted() {
        this.tempDate = format(parseISO(new Date(this.newReminder.date).toISOString()), "yyyy-MM-dd")
        this.tempTime = format(parseISO(new Date(this.newReminder.date).toISOString()), "HH:mm")
    },
    computed: {
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
            actualDate.setTime(tmpDate.getTime());
            this.newReminder.date = actualDate
        }
    }
})
</script>