<template>
    <v-container>
    <v-sheet style="height: 75vh;">
        <v-toolbar dense>
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
                <v-row class="justify-center"><ClientComp :client="selectedEvent.client" /></v-row>
                <ReminderComp v-model="selectedEvent.reminder" @remove="removeEvent(selectedEvent.reminder, selectedEvent.client)" />
            </v-card>
        </v-menu>
    </v-sheet>
    </v-container>
</template>
<script lang="ts">
import Vue from 'vue'
import ReminderComp from '@/components/Reminders/Reminder.vue'
import ClientComp from '@/components/Client/Client.vue'
import { Client, ClientsDB, Reminder } from '@/modules/ClientsDB'

export default Vue.extend({
    components: {
        ReminderComp,
        ClientComp
    },
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
            const thing = (this.$altStore.$data.clientsdb as ClientsDB).clients.flatMap((eClient) => {
                return eClient.reminders.flatMap(e => {
                    if (new Date(e.date) <= endDate && new Date(e.date) >= startDate)
                    {
                        return {
                            name: e.title,
                            start: new Date(e.date),
                            end: new Date(e.date),
                            color: "primary",
                            timed: true,
                            client: eClient,
                            reminder: e
                        } as Event
                    }
                    return []
                })
            });
            this.events = thing;
        },
        showEvent({event, nativeEvent}: {event: Event, nativeEvent: MouseEvent} ) {
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

        },
        removeEvent(inputReminder : Reminder, inputClient : Client) {
            inputClient.reminders.splice(inputClient.reminders.indexOf(inputReminder), 1);
            this.events.splice(this.events.findIndex(e => e.reminder?.id == inputReminder.id), 1);
            this.selectedOpen = false;
        },
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
    reminder?: Reminder;
}

</script>
