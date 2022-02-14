<template>
    <div>
        <v-list>
        <template v-for="([key, value], i) in clientEntries">
          <v-list-item :key="i">
            <v-list-item-content>
                <v-list-item-title>{{ clientInfo[key].name }}</v-list-item-title>

                <v-text-field
                    v-if="typeof value == 'string'"
                    :placeholder="''"
                    class="mt-3"
                    outlined
                    :hint="''"
                    v-model="client[key]"
                    hide-details="auto"
                ></v-text-field>
            </v-list-item-content>
            <v-switch
                v-if="typeof value == 'boolean'"
                v-model="client[key]"
                flat
            ></v-switch>
          </v-list-item>
          <v-divider :key="`divfor-${i}`"/>
          <div v-if="clientEntries.length-1 == i" :key="`spacefor-${i}`" :style="`min-height: ${btnHeight*1.5}px`"></div>
        </template>
      </v-list>
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
            ref="backBtn"
            @click="done"
        >
            <v-icon dark>
                mdi-check
            </v-icon>
        </v-btn>
    </div>
</template>
<script lang="ts">
import { Client, ClientInfo } from '@/modules/ClientsDB'
import Vue from 'vue'
export default Vue.extend({
    data: () => {
        return {
            client: new Client(),
            clientInfo: new ClientInfo()
        }
    },
    mounted() {
       
    },
    methods: {
        done() {
            const tempDb = window.electron.clients.get()
            tempDb.clients.push(this.client)
            window.electron.clients.write(tempDb)
            this.$router.go(-1)
        }
    },
    computed: {
        clientEntries() {
            return Object.entries(this.client).filter(([key, value]) => {
                return !this.$data.clientInfo[key].hidden
            })
        },
        btnHeight() {
            if (!this.$refs.backBtn) return 56
            return (this.$refs.backBtn as any).$el.offsetHeight as number;
        }
    }
})
</script>
<style lang="scss">
</style>