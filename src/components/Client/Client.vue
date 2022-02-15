<template>
<v-lazy
    width="100%"
    class="ma-3 text-left flex-grow-1"
>
    <v-card
        style="height: 100%"
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
            <v-card-subtitle v-text="client.email"></v-card-subtitle>
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