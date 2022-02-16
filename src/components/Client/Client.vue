<template>
<v-lazy
    width="100%"
    class="ma-3 text-left flex-grow-1"    
>
    <v-card
        style="height: 100%"
        :to="{path: `/client-detail/${client.id}`}"
    >
    <div class="d-flex" style="height: 100%;">
        <v-avatar
                class="ma-3"
                size="60"
            >
            <v-img 
                :src="`tset.json`" 
                :alt="client.fname"
            >
                <template v-slot:placeholder>
                    <div class="placeholder primary white--text">
                        {{ client.fname.charAt(0) }}
                    </div>
                </template>
            </v-img>
        </v-avatar>
        <div class="flex-grow-1">
            
            <v-card-title v-text="`${client.fname} ${client.lname}`"></v-card-title>
            <v-card-subtitle v-text="
                client.reminders.length === 0 ? 'No Reminders' : client.reminders.reduce((a1, b1) => a1.date.getTime() < b1.date.getTime() ? a1 : b1 ).date
            "></v-card-subtitle>
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
<style lang="scss" scoped>
.placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>