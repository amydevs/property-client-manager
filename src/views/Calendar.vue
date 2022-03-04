<template>

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
            v-model="focus"
            color="primary"
            :events="events"
            type="month"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
        ></v-calendar>
        <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
        >
            <v-card>
                hi
            </v-card>
        </v-menu>
    </v-sheet>
</template>
<script lang="ts">
import Vue from 'vue'
import { Client, ClientsDB, Reminder } from '@/modules/ClientsDB'

export default Vue.extend({
    data() {
        return {
            focus: '',
            events: [] as Event[],

            selectedOpen: false,
            selectedElement: null as EventTarget | null,
            selectedEvent: {} as Event
        }
    },
    mounted() {
        (this.$refs.calendar as any).checkChange()
    },
    methods: {
        updateRange({start, end}: {start: Start; end: End}) {
            console.log(start)
            const startDate = new Date(`${start.date}T00:00:00`),
                endDate = new Date(`${end.date}T23:59:59`);
            const thing = [...(this.$altStore.$data.clientsdb as ClientsDB).clients].flatMap((eClient) => {
                return eClient.reminders.flatMap(e => {
                    if (new Date(e.date) <= endDate && new Date(e.date) >= startDate)
                    {
                        return {
                            name: e.title,
                            start: new Date(e.date),
                            end: new Date(e.date),
                            color: "primary",
                            timed: true,
                            client: eClient
                        } as Event
                    }
                    return []
                })
            });
            this.events = thing;
        },
        showEvent({nativeEvent, event }: {event: Event, nativeEvent: MouseEvent} ) {
            const open = () => {
                this.selectedEvent = event
                this.selectedElement = nativeEvent.target
                requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
            }

            if (this.selectedOpen) {
                this.selectedOpen = false
                requestAnimationFrame(() => requestAnimationFrame(() => open()))
            } else {
                open()
            }

            nativeEvent.stopPropagation()
        },
        viewDay() {

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
    client?: Client;
}

</script>
