<template>
  <div class="text-center">
    <v-progress-circular
      v-if="!loaded"
      :size="50"
      indeterminate
      color="primary"
    ></v-progress-circular>
    <ClientContainer v-if="clientsdb" :clients="clientsdb.clients" />
    <v-btn
      fab 
      fixed
      right
      bottom
      :to="{path: '/client-create'}"
    >
      <v-icon dark>
          mdi-plus
      </v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ClientContainer from '@/components/Client/ClientContainer.vue'
import { Client } from '@/modules/ClientsDB'

export default Vue.extend({
  name: 'Home',

  components: {
    ClientContainer
  },
  data: () => {
    return {
      loaded: true,
      clientsdb: window.electron.clients.get(),
      delFunc: null as null | (() => void),
    }
  },
  mounted() {
    console.log(this.$data.clientsdb)
    this.delFunc = window.electron.ipc.receive("clients-changed", (event:any) => {
      console.log("changed")
      this.clientsdb = event;
    });
  },
  beforeDestroy() {
    if (this.delFunc) {
      this.delFunc();
    }
  },
})
</script>
