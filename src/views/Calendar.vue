<template>
  <v-container>
      <v-sheet>
        <v-toolbar>
                <v-btn
                fab
                text
                small
                @click="$refs.calendar.prev()"
            >
                <v-icon small>
                mdi-chevron-left
                </v-icon>
            </v-btn>
            <v-btn
                fab
                text
                small
                @click="$refs.calendar.next()"
            >
                <v-icon small>
                mdi-chevron-right
                </v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
                {{ $refs.calendar.title }}
            </v-toolbar-title>
        </v-toolbar>
        <v-calendar
            ref="calendar"
            v-model="value"
            type="month"
            color="primary"
            :events="events"
            event-overlap-mode="stack"
            @change="updateRange"
        ></v-calendar>
      </v-sheet>
  </v-container>
</template>
<script lang="ts">
import Vue from 'vue'
import {format, parseISO} from 'date-fns'
import { ClientsDB, Reminder } from '@/modules/ClientsDB'

export default Vue.extend({
    data() {
        return {
            value: '',
            events: [] as Event[]
        }
    },
    mounted() {
    },
    methods: {
        updateRange({start, end}: {start: Start; end: End}) {
            console.log(start)
            const startDate = new Date(`${start.date}T00:00:00`),
                endDate = new Date(`${end.date}T23:59:59`);
            const thing = [...(this.$altStore.$data.clientsdb as ClientsDB).clients].flatMap((e) => {
                return e.reminders.flatMap(e => {
                    console.log(new Date(e.date) <= endDate && new Date(e.date) >= startDate)
                    if (new Date(e.date) <= endDate && new Date(e.date) >= startDate)
                    {
                        return {
                            name: e.title,
                            start: new Date(e.date),
                            end: new Date(e.date),
                            color: "primary",
                            timed: true
                        } as Event
                    }
                    return []
                })
            });
            this.events = thing;
        }
    },
    watch: {
        value() {
        }
    },
    computed: {
    }    
})

export type Start = {
    date: string;
    time: string;
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    weekday: number;
    hasDay: boolean;
    hasTime: boolean;
    past: boolean;
    present: boolean;
    future: boolean;
}
export type End = {
    date: string;
    time: string;
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    weekday: number;
    hasDay: boolean;
    hasTime: boolean;
    past: boolean;
    present: boolean;
    future: boolean;
}
export type Event = {
    name: string;
    start: string | Date;
    end: string | Date;
    color: string;
    timed: boolean;
}

</script>
