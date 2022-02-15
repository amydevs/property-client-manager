<template>
<div>
    <v-container>
        <v-row class="justify-center">
            <client-comp :client="client"/>
        </v-row>
        
    </v-container>
    <v-container>
            <div v-html="markdownInfo"></div>
    </v-container>
    <v-btn
        fab 
        fixed
        left
        bottom
        @click="$router.go(-1)"
    >
        <v-icon dark>
            mdi-arrow-left
        </v-icon>
    </v-btn>
    <v-btn
        fab 
        fixed
        right
        bottom
        :to="{path: `/client-create/${client.id}`}"
    >
        <v-icon dark>
            mdi-account-edit
        </v-icon>
    </v-btn>
</div>
</template>
<script lang="ts">
import ClientComp from '@/components/Client/Client.vue'
import mdit from "markdown-it";
const md = new mdit();

import { Client, ClientInfo } from '@/modules/ClientsDB'
import Vue from 'vue'
export default Vue.extend({
    components: {
        ClientComp
    },
    data() {
        return {
            client: window.electron.clients.get()?.clients.find(c => c.id === this.$route.params.id),
            markdownInfo: "",
            clientInfo: new ClientInfo()
        }
    },
    mounted() {
        if (this.client) {
            this.markdownInfo = md.render(this.client.notes);
        }
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