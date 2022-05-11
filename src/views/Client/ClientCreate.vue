<template>
    <v-form
        ref="form"
        lazy-validation
    >
        <v-list>
        <template v-for="([key, value], i) in clientEntries">
          <v-list-item :key="i">
            <v-list-item-content>
                <v-list-item-title>{{ clientInfo[key].name }}</v-list-item-title>
                <div v-if="typeof value == 'string'">
                    <v-textarea
                        v-if="clientInfo[key].type == 'textbox'"
                        class="mt-3"
                        v-model="client[key]"
                        hint=""
                        outlined
                        hide-details="auto"
                    ></v-textarea>
                    <v-text-field
                        v-else
                        :placeholder="''"
                        class="mt-3"
                        outlined
                        :hint="''"
                        v-model="client[key]"
                        hide-details="auto"
                    ></v-text-field>
                    
                </div>
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
            color="red"
        >
            <v-icon dark>
                mdi-close
            </v-icon>
        </v-btn>
        <v-btn
            fab 
            fixed
            right
            bottom
            ref="backBtn"
            @click="done"
            color="green"
        >
            <v-icon dark>
                mdi-check
            </v-icon>
        </v-btn>
    </v-form>
</template>
<script lang="ts">
import { Client, ClientInfo, ClientsDB } from '@/modules/ClientsDB'
import store from '@/store';
import Vue from 'vue'
export default Vue.extend({
    data: () => {
        return {
            client: new Client(),
            clientInfo: new ClientInfo()
        }
    },
    mounted() {
        const slugClientFromID = store.state.clientsdb?.clients.find(c => c.id == this.$route.params.id);
        if (slugClientFromID) {
            this.client = {...slugClientFromID};
        }
    },
    methods: {
        done() {
            if ((this.$refs.form as any).validate()) {
                const tempDb = store.state.clientsdb;
                if (tempDb) {
                    let existingClientIndex = tempDb.clients.findIndex((e) => e.id === this.client.id);

                    if (existingClientIndex !== -1) {
                        this.client.updated = new Date();
                        tempDb.clients[existingClientIndex] = this.client; 
                    }
                    else tempDb?.clients.push(this.client);
                    
                    this.$router.go(-1)
                }
            }
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