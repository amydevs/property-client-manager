<template>
<div>
    <slot 
        :opened="createNewReminderOpen" 
        :toggle="(e) => { createNewReminderOpen = e }">
    </slot>
    <div v-if="createNewReminderOpen">
        <v-container> <v-text-field label="Title" hide-details="auto" outlined dense v-model="newReminder.title"/></v-container>
        <v-container> <v-textarea label="Details" hide-details="auto" outlined dense rows="2" v-model="newReminder.details"/></v-container>
        <v-container>
        <v-menu
            ref="menu"
            v-model="dateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
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
                color="primary"
                v-model="tempDate"
            ></v-date-picker>
        </v-menu>
        </v-container>
        <v-container>
            <v-menu
                ref="timeMenu"
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
                    color="primary"
                    v-if="timeMenu"
                    v-model="tempTime"
                    ampm-in-title
                    @click:minute="$refs.timeMenu.save(tempTime)"
                ></v-time-picker>
            </v-menu>
        </v-container>
        <v-container>
            <v-btn style="width: 100%" dense @click="createNewReminderOpen = false" color="red">Close</v-btn>
        </v-container>
        <v-container>
            <v-btn style="width: 100%" dense @click="addReminder()" color="green">Confirm</v-btn>
        </v-container>
        
    </div>
</div>
</template>
<script lang="ts">
import { Reminder, Client } from '@/modules/ClientsDB'
import { format, parseISO, parse } from 'date-fns'

import Vue from 'vue'
export default Vue.extend({
    props: {
        value: {
            type: Object as () => Reminder
        }
    },
    data() {
        return {
            createNewReminderOpen: false,
            createNew: this.value ? false : true,

            newReminder: this.value ? {...this.value} : new Reminder(),

            menu1: false,
            tempDate: "",
            tempTime: "",
            dateMenu: false,
            timeMenu: false
        }
    },
    mounted() {
        console.log(this.newReminder)
        this.tempDate = format(parseISO(new Date(this.newReminder.date).toISOString()), "yyyy-MM-dd")
        this.tempTime = format(parseISO(new Date(this.newReminder.date).toISOString()), "HH:mm")
    },
    methods: {
        addReminder() {
            this.createNewReminderOpen = false
            this.$emit('input', this.newReminder)
        },
    },
    watch: {
        value() {
            this.newReminder = {...this.value};
        },
        tempDate(e: string) {
            console.log(e)
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