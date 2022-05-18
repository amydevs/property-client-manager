<template>
<v-lazy
    width="100%"
    class="ma-3 text-left flex-grow-1"    
>
    <v-card
        style="height: 100%"
        :to="client_details ? '' : {path: `/client-detail/${client.id}`}"
    >
    <div class="d-flex" style="height: 100%;">
        <v-avatar
                class="ma-3"
                size="60"
            >
            <v-img 
                :src="`${imgPath}?v=${imgKey}`" 
                :alt="client.fname"
                @click="client_details ? changePfp() : ''"
            >
                <template v-slot:placeholder>
                    <div class="placeholder primary white--text">
                        {{ client.fname.charAt(0) }}
                    </div>
                </template>
            </v-img>
        </v-avatar>
        <div class="flex-grow-1">
            
            <v-card-title v-text="(new Boolean(client.fname.length) | new Boolean(client.lname.length)) ? `${client.fname} ${client.lname}` : `No Name`"></v-card-title>
            <v-card-subtitle v-text="
                client.reminders.length === 0 ? 'No Reminders' : `Next Reminder: ${new Date(closestReminder.date).toLocaleString()}`
            "></v-card-subtitle>
        </div>
    </div>
    </v-card>
</v-lazy>
</template>

<script lang="ts">
import path from "path";
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Client, Reminder } from '@/modules/ClientsDB'

export default Vue.extend({
    name: 'Client',
    props: {
        client: Object as () => Client,
        client_details: Boolean
    },
    mounted() {
        const normalized = (window.electron.store.get("clientsPath") as string).split(window.electron.path.sep()).join("/")
        this.imgPath = `filer:///${path.join(path.normalize(normalized), this.client.id, "profile.png")}`;
        //  `filer://${path.join(window.electron.store.get("clientsPath") as string, this.client.id, "profile.png")}?noerror=0`
    },
    components: {
    },
    data: () => {
        return {
            imgKey: "",
            imgPath: "unknown.png"
        }
    },
    methods: {
        async changePfp() {
            if (window.electron.dialog.openDialogPfp(this.client.id)) {
                this.imgKey = Math.random().toString();
            }
        }
    },
    computed: {
        closestReminder(): Reminder {
            return this.client.reminders.reduce((a1, b1) => new Date(a1.date).getTime() < new Date(b1.date).getTime() ? a1 : b1 )
        }
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