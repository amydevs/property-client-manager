<template>
<div>
    <v-container>
        <v-row class="justify-center">
            <client-comp :client="client"/>
        </v-row>
    </v-container>
</div>
</template>
<script lang="ts">
import ClientComp from '@/components/Client/Client.vue'
import { Client, ClientInfo } from '@/modules/ClientsDB'
import Vue from 'vue'
export default Vue.extend({
    components: {
        ClientComp
    },
    data() {
        return {
            client: window.electron.clients.get()?.clients.find(c => c.id === this.$route.params.id),
            clientInfo: new ClientInfo()
        }
    },
    mounted() {
        console.log(this.client)
    },
    methods: {
    },
    computed: {
        btnHeight() {
            if (!this.$refs.backBtn) return 56
            return (this.$refs.backBtn as any).$el.offsetHeight as number;
        }
    }
})
</script>
<style lang="scss">
</style>