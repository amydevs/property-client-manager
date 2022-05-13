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
            <v-spacer />
            <v-btn
                fab
                text
                small
                @click="zoomType(1)"
                :disabled="calTypes.indexOf(type) === calTypes.length-1"
            >
                <v-icon small>
                mdi-plus
                </v-icon>
            </v-btn>
            <v-btn
                fab
                text
                small
                @click="zoomType(-1)"
                :disabled="calTypes.indexOf(type) === 0"
            >
                <v-icon small>
                mdi-minus
                </v-icon>
            </v-btn>
        </v-toolbar>
        <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :type="type"
            @click:event="showEvent"
            @click:more="showDay"
            @click:date="showDay"
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
                <ReminderComp v-if="selectedEvent.reminder && selectedEvent.reminder.id && selectedOpen" :id="selectedEvent.reminder.id" @delete="selectedOpen = false;" />
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
import store from '@/store'

const calTypes = ["month", 'week', 'day'] as const

export default Vue.extend({
    components: {
        ReminderComp,
        ClientComp
    },
    data() {
        return {
            focus: '',
            calTypes,
            type: 'month' as typeof calTypes[number],

            selectedOpen: false,
            selectedElement: null as EventTarget | null,
            selectedEvent: {} as Event,
            
            startDate: new Date(),
            endDate: new Date(),
        }
    },
    mounted() {
        (this.$refs.calendar as any).checkChange()
    },
    methods: {
        updateRange({start, end}: {start: Start; end: End}) {
            console.log("range update")
            this.startDate = new Date(`${start.date}T00:00:00`);
            this.endDate = new Date(`${end.date}T23:59:59`);
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
        showDay({ date }: { date : string }) {
            this.focus = date
            this.type = 'day'
        },
        zoomType(inOrOut: number) {
            this.type = this.calTypes[this.calTypes.indexOf(this.type) + inOrOut]
        }
    },
    computed: {
        events() {
            return store.state.clientsdb?.clients.flatMap((eClient) => {
                return eClient.reminders.flatMap(e => {
                    if (new Date(e.date) <= this.endDate && new Date(e.date) >= this.startDate)
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
        }
    },
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
