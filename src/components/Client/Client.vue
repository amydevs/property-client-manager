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
            >
            <v-img 
                :src="`tset.json`" 
                :alt="client.fname"
            >
                <template v-slot:placeholder>
                    <div></div>
                </template>
            </v-img>
        </v-avatar>
        <div class="flex-grow-1">
            
            <v-card-title v-text="client.fname"></v-card-title>
            <v-card-subtitle v-text="client.lname"></v-card-subtitle>
        </div>
    </div>
    </v-card>
</v-lazy>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Client } from '@/modules/ClientsDB'

export default Vue.extend({
    name: 'Client',
    props: {
        client: Object as () => Client,
        value: Number
    },
    mounted() {
    },
    components: {
    },
    data: () => {
        return {

        }
    },
    methods: {
    },
    computed: {

    }
})
</script>
