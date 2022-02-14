<template>
    <div>
        <div v-for="([key, value], i) in Object.entries(client)" :key="i">
            {{(typeof value === 'string')}}
        </div>
    </div>
</template>
<script lang="ts">
import { IClient, Client } from '@/modules/ClientsDB'
import Vue from 'vue'
export default Vue.extend({
    data: () => {
        return {
            client: new Client() as IClient
        }
    },
    mounted() {
    }
})
</script>
<style lang="scss">
</style>