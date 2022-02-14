<template>
    
</template>
<script lang="ts">
import { keys } from 'ts-transformer-keys';
import { IClient } from '@/modules/ClientsDB'
import Vue from 'vue'
export default Vue.extend({
    data: () => {
        return {
            fields: keys<IClient>()
        }
    }
})
</script>
<style lang="scss">
</style>