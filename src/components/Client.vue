<template>
<v-lazy
    width="300px"
    class="ma-3 text-left flex-grow-1"
>
    <v-card
        style="height: 100%"
    >
    <div class="d-flex" style="height: 100%;">
        <v-avatar
                class="ma-3 my-auto"
                size="100"
                tile
            >
            <v-img 
                :src="'test.jpg'" 
                :alt="chart.name"
            />
        </v-avatar>
        <div class="flex-grow-1">
            
            <v-card-title v-text="chart.fname"></v-card-title>
            <v-card-subtitle v-text="chart.author"></v-card-subtitle>
        </div>
    </div>
    <Detail v-if="displayDetails" v-model="displayDetails" :chart="addIdFromLocal(chart)" :inputDiff="inputDiff" />
    </v-card>
</v-lazy>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Client } from '@/modules/ClientsDB'

export default Vue.extend({
    name: 'Chart',
    props: {
        chart: Object as () => Client,
        value: Number
    },
    components: {
    },
    data() {
        return {
        inputDiff: this.value || 2,
        audio: null as null | HTMLAudioElement,
        audioPaused: true,
        displayDetails: false
        }
    },
    methods: {
    },
    computed: {

    }
})
</script>
